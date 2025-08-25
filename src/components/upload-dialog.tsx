
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import type { UploadedMovie } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { addMovie } from '@/app/actions';


interface UploadDialogProps {
  onUploadComplete: () => void;
}

export function UploadDialog({ onUploadComplete }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const { toast } = useToast();
 
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setFiles(event.target.files);
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read file."));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const resizePoster = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const MAX_WIDTH = 600;
                  const scaleSize = MAX_WIDTH / img.width;
                  canvas.width = MAX_WIDTH;
                  canvas.height = img.height * scaleSize;

                  const ctx = canvas.getContext('2d');
                  if (!ctx) {
                      return reject(new Error('Failed to get canvas context'));
                  }
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                  
                  resolve(canvas.toDataURL('image/jpeg')); 
              };
              img.onerror = reject;
              img.src = event.target?.result as string;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
      });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!files) return;

    const fileGroups: Record<string, { poster?: File, logo?: File, info?: File }> = {};

    for (const file of Array.from(files)) {
        const parts = file.name.match(/(.+?)_(poster|logo|info)\.\w+$/);
        if (!parts) continue;
        
        const name = parts[1];
        const type = parts[2] as 'poster' | 'logo' | 'info';

        if (!fileGroups[name]) {
            fileGroups[name] = {};
        }

        fileGroups[name][type] = file;
    }
    

    let moviesAdded = 0;
    try {
      const uploadPromises = Object.keys(fileGroups).map(async (movieName) => {
          const group = fileGroups[movieName];
          if (group.poster && group.info) {
             const infoText = await group.info!.text();
             const info: Record<string, string> = {};
             let descriptionParts: string[] = [];
             
             const lines = infoText.split('\n');
             let currentKey = 'description';

             lines.forEach(line => {
                 const parts = line.split(':');
                 if (parts.length > 1) {
                     const key = parts[0].toLowerCase().replace(/\s/g, '');
                     const value = parts.slice(1).join(':').trim();
                     info[key] = value;
                     if(key === 'rating') currentKey = 'post-rating';
                 } else if (line.trim().length > 0 && currentKey === 'description') {
                   descriptionParts.push(line.trim());
                 }
             });
             info.description = descriptionParts.join('\n');

             const posterUrl = await resizePoster(group.poster!);
             const logoUrl = group.logo ? await fileToDataUrl(group.logo) : 'https://placehold.co/400x150.png';

             const newMovie: UploadedMovie = {
                 name: info.name || movieName.replace(/_/g, ' '),
                 posterUrl,
                 logoUrl,
                 description: info.description || '',
                 starring: info.starring || '',
                 director: info.director || '',
                 runtime: info.runtime || '',
                 genre: info.genre || '',
                 rating: info.rating || '',
                 posterAiHint: `movie poster for ${movieName}`,
             };
             
             const result = await addMovie(newMovie);
             if (!result.success) {
                 throw new Error(result.error || `Failed to upload ${movieName}`);
             }
             moviesAdded++;
          }
      });

      await Promise.all(uploadPromises);

      if(moviesAdded > 0){
        toast({ title: "Upload Complete", description: `${moviesAdded} movie(s) have been added.` });
        onUploadComplete();
      } else {
        toast({ title: "Upload Info", description: "No valid movie sets found to upload.", variant: "default" });
      }

    } catch (error: any) {
       console.error("Error uploading movies:", error);
       toast({ title: "Upload Failed", description: error.message || "An error occurred while uploading.", variant: "destructive" });
    }
    
    setOpen(false);
    setFiles(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Posters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload Movie Files</DialogTitle>
            <DialogDescription>
              Select the poster, logo, and info files for your movie.
              Files should be named according to the movie title, e.g., `MyMovie_poster.png`, `MyMovie_logo.png`, `MyMovie_info.txt`.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="movie-files">Movie Files</Label>
              <Input id="movie-files" type="file" multiple onChange={handleFileChange} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Upload</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

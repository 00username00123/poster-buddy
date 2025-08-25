
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
import { db } from '@/lib/firebase';
import { collection, addDoc } from "firebase/firestore";


interface UploadDialogProps {
  onUploadComplete: () => void;
}

export function UploadDialog({ onUploadComplete }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
 
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setFiles(event.target.files);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isUploading && !isOpen) {
      return; 
    }
    setOpen(isOpen);
    if (!isOpen) {
      setIsUploading(false);
      setFiles(null);
    }
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
              if (!event.target?.result) {
                return reject(new Error("Failed to read file for resizing."));
              }
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
              img.onerror = (err) => reject(new Error(`Image load error for resizing: ${err.toString()}`));
              img.src = event.target.result as string;
          };
          reader.onerror = (err) => reject(new Error(`File read error for resizing: ${err.toString()}`));
          reader.readAsDataURL(file);
      });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!files || files.length === 0) {
      toast({ title: "No Files Selected", description: "Please select files to upload.", variant: "destructive" });
      return;
    }
    setIsUploading(true);

    try {
        const fileGroups: Record<string, { poster?: File, logo?: File, info?: File }> = {};

        for (const file of Array.from(files)) {
            const parts = file.name.match(/(.+?)[_.]((poster|logo|info))\.\w+$/i);
            if (!parts) continue;
            
            const name = parts[1];
            const type = parts[2].toLowerCase() as 'poster' | 'logo' | 'info';

            if (!fileGroups[name]) {
                fileGroups[name] = {};
            }
            fileGroups[name][type] = file;
        }

        const validGroups = Object.entries(fileGroups).filter(([, group]) => group.poster && group.info);
        
        if (validGroups.length === 0) {
            toast({ title: "No Valid Movie Sets Found", description: "Ensure files are named correctly (e.g., moviename_poster.jpg, moviename_info.txt).", variant: "destructive" });
            setIsUploading(false);
            return;
        }
        
        const uploadPromises = validGroups.map(async ([movieName, group]) => {
          try {
            const infoText = await group.info!.text();
            const info: Record<string, string> = {};
            const lines = infoText.split('\n');
            let currentKey = '';
            let descriptionValue = '';

            lines.forEach(line => {
                const match = line.match(/^([^:]+):\s*(.*)$/);
                if (match) {
                    currentKey = match[1].toLowerCase().trim().replace(/\s+/g, '');
                    if (currentKey === 'description') {
                        descriptionValue = match[2].trim();
                    } else {
                        info[currentKey] = match[2].trim();
                    }
                } else if (currentKey === 'description') {
                    descriptionValue += `\n${line.trim()}`;
                }
            });
            info.description = descriptionValue.trim();

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
                posterAiHint: `movie poster for ${info.name || movieName}`,
            };
            
            await addDoc(collection(db, "movies"), newMovie);
          } catch(err: any) {
              throw new Error(`Failed to process movie "${movieName}": ${err.message}`);
          }
        });

        await Promise.all(uploadPromises);

        toast({ title: "Upload Complete", description: `${validGroups.length} movie(s) have been successfully added.` });
        onUploadComplete();
        setOpen(false);

    } catch (error: any) {
       console.error("Error uploading movies:", error);
       toast({ title: "Upload Failed", description: error.message || "An unexpected error occurred.", variant: "destructive" });
       setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              <Input id="movie-files" type="file" multiple onChange={handleFileChange} required disabled={isUploading}/>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

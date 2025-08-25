
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
    setOpen(isOpen);
    if (!isOpen) {
      // Reset state when dialog is closed
      setIsUploading(false);
      setFiles(null);
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
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
          infoText.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
              const formattedKey = key.trim().toLowerCase().replace(/\s+/g, '');
              info[formattedKey] = valueParts.join(':').trim();
            }
          });

          const posterUrl = await fileToDataUrl(group.poster!);
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
          return { status: 'fulfilled', movieName };
        } catch(err: any) {
            console.error(`Failed to process movie "${movieName}":`, err);
            return { status: 'rejected', movieName, reason: err.message };
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      
      const successfulUploads = results.filter(r => r.status === 'fulfilled').length;
      const failedUploads = results.filter(r => r.status === 'rejected').length;

      if (successfulUploads > 0) {
        toast({ title: "Upload Complete", description: `${successfulUploads} movie(s) have been successfully added.` });
      }

      if (failedUploads > 0) {
        toast({ title: "Upload Failed", description: `${failedUploads} movie(s) could not be uploaded. Check console for details.`, variant: "destructive" });
      }
      
      onUploadComplete();
      handleOpenChange(false); // Close and reset dialog

    } catch (error: any) {
       console.error("An unexpected error occurred during upload:", error);
       toast({ title: "Upload Failed", description: error.message || "An unexpected error occurred.", variant: "destructive" });
       setIsUploading(false); // Ensure button is reset on unexpected error
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

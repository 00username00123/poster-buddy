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
import { Upload } from 'lucide-react';
import type { Movie } from '@/lib/data';

interface UploadDialogProps {
    movies: Movie[];
    setMovies: (value: Movie[] | ((val: Movie[]) => Movie[])) => void;
}

export function UploadDialog({ movies, setMovies }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!files) return;

    const newMovies: Movie[] = [];
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

    for (const name in fileGroups) {
        const group = fileGroups[name];
        if (group.poster && group.info) {
            const infoText = await group.info.text();
            const info: Record<string, string> = {};
            let descriptionParts: string[] = [];
            
            const lines = infoText.split('\n');
            let currentKey = 'description'; 

            lines.forEach(line => {
                const-parts = line.split(':');
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

            const nextId = (movies.length > 0 ? Math.max(...movies.map(m => m.id)) : 0) + newMovies.length + 1;

            const newMovie: Movie = {
                id: nextId,
                name: info.name || name.replace(/_/g, ' '),
                posterUrl: URL.createObjectURL(group.poster),
                logoUrl: group.logo ? URL.createObjectURL(group.logo) : 'https://placehold.co/400x150/000000/ffffff.png&text=%20',
                description: info.description || '',
                starring: info.starring || '',
                director: info.director || '',
                runtime: info.runtime || '',
                genre: info.genre || '',
                rating: info.rating || '',
                posterAiHint: `movie poster for ${name}`,
            };
            newMovies.push(newMovie);
        }
    }
    
    setMovies(prevMovies => [...prevMovies, ...newMovies]);
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

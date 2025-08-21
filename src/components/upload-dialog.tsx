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
    setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
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

    const newMovies: Movie[] = [...movies];
    const fileGroups: Record<string, { poster?: File, logo?: File, info?: File }> = {};

    for (const file of Array.from(files)) {
        const [name, type] = file.name.split(/_(poster|logo|info)\./);
        if (!name || !type) continue;

        if (!fileGroups[name]) {
            fileGroups[name] = {};
        }

        if (type.startsWith('poster')) fileGroups[name].poster = file;
        if (type.startsWith('logo')) fileGroups[name].logo = file;
        if (type.startsWith('info')) fileGroups[name].info = file;
    }

    for (const name in fileGroups) {
        const group = fileGroups[name];
        if (group.poster && group.info) {
            const infoText = await group.info.text();
            const info: Partial<Movie> = Object.fromEntries(
                infoText.split('\n').map(line => {
                    const [key, ...value] = line.split(': ');
                    const formattedKey = key.toLowerCase().replace(/\s/g, '');
                    return [formattedKey, value.join(': ')];
                })
            );

            const newMovie: Movie = {
                id: (newMovies[newMovies.length -1]?.id ?? 0) + 1,
                name: info.name || name.replace(/_/g, ' '),
                posterUrl: URL.createObjectURL(group.poster),
                description: info.description || '',
                commanderBlurb: info.commanderblurb || '',
                visualsBlurb: info.visualsblurb || '',
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
    
    setMovies(newMovies);
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

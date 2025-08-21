"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Movie, initialMovies } from "@/lib/data";
import { Film, Trash2, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ManagePage() {
  const [movies, setMovies] = useLocalStorage<Movie[]>("movies", initialMovies);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const { toast } = useToast();

  const handleEdit = (movie: Movie) => {
    setEditingMovie({ ...movie });
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
  };

  const handleSave = () => {
    if (!editingMovie) return;
    setMovies(movies.map((m) => (m.id === editingMovie.id ? editingMovie : m)));
    setEditingMovie(null);
    toast({
      title: "Movie Saved",
      description: `${editingMovie.name} has been updated.`,
    });
  };

  const handleDelete = (movieToDelete: Movie) => {
    setMovies(movies.filter((m) => m.id !== movieToDelete.id));
    toast({
      title: "Movie Deleted",
      description: `${movieToDelete.name} has been removed.`,
      variant: "destructive",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingMovie) return;
    const { name, value } = e.target;
    setEditingMovie({ ...editingMovie, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'posterUrl' | 'logoUrl') => {
    if (!editingMovie || !e.target.files?.length) return;
    const file = e.target.files[0];
    const newUrl = URL.createObjectURL(file);
    setEditingMovie({ ...editingMovie, [imageType]: newUrl });
  };
  
  const generateInfoFile = (movie: Movie) => {
    const content = `Name: ${movie.name}
Description: ${movie.description}
Starring: ${movie.starring}
Director: ${movie.director}
Runtime: ${movie.runtime}
Genre: ${movie.genre}
Rating: ${movie.rating}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${movie.name.replace(/\s+/g, '_')}_info.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (editingMovie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Editing: {editingMovie.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Poster</label>
                <Image src={editingMovie.posterUrl} alt="Poster" width={300} height={450} className="rounded-md object-cover" />
                <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'posterUrl')} className="mt-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Logo</label>
                <Image src={editingMovie.logoUrl} alt="Logo" width={200} height={75} className="rounded-md bg-gray-700 p-2 object-contain" />
                <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'logoUrl')} className="mt-2" />
              </div>
            </div>
            <Input name="name" value={editingMovie.name} onChange={handleInputChange} placeholder="Name" />
            <Textarea name="description" value={editingMovie.description} onChange={handleInputChange} placeholder="Description" rows={4} />
            <Input name="starring" value={editingMovie.starring} onChange={handleInputChange} placeholder="Starring" />
            <Input name="director" value={editingMovie.director} onChange={handleInputChange} placeholder="Director" />
            <Input name="runtime" value={editingMovie.runtime} onChange={handleInputChange} placeholder="Runtime" />
            <Input name="genre" value={editingMovie.genre} onChange={handleInputChange} placeholder="Genre" />
            <Input name="rating" value={editingMovie.rating} onChange={handleInputChange} placeholder="Rating" />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <a className="flex items-center gap-2" href="/">
              <Film className="h-6 w-6" />
              <span className="font-bold">Poster Buddy</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
             <Link href="/">
                <Button variant="outline"><Home className="mr-2"/> Home</Button>
            </Link>
          </div>
        </div>
      </header>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Posters</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <Card key={movie.id}>
            <CardHeader>
              <CardTitle className="truncate">{movie.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image src={movie.posterUrl} alt={`${movie.name} Poster`} width={300} height={450} className="rounded-md object-cover w-full h-auto mb-4" />
              <div className="flex justify-between items-center gap-2">
                <Button onClick={() => handleEdit(movie)}>Edit</Button>
                <Button onClick={() => generateInfoFile(movie)}>Download Info</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon"><Trash2 /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the poster for "{movie.name}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(movie)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </>
  );
}

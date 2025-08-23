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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore } from "@/hooks/use-firestore";
import { Movie, initialMovies } from "@/lib/data";
import { Film, Trash2, Home, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ManagePage() {
  const { movies, addMovie, updateMovie, deleteMovie } = useFirestore<Movie>("movies", initialMovies);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const { toast } = useToast();
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [cycleSpeed, setCycleSpeed] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedSpeed = localStorage.getItem('cycleSpeed');
      return savedSpeed ? Number(savedSpeed) : 5;
    }
    return 5;
  });

  const handleEdit = (movie: Movie) => {
    setEditingMovie({ ...movie });
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
  };

  const handleSave = async () => {
    if (!editingMovie) return;
    await updateMovie(editingMovie.id, editingMovie);
    setEditingMovie(null);
    toast({
      title: "Movie Saved",
      description: `${editingMovie.name} has been updated.`,
    });
  };

  const handleDelete = async (movieToDelete: Movie) => {
    await deleteMovie(movieToDelete.id);
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
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setEditingMovie({ ...editingMovie, [imageType]: base64String });
    };
    reader.readAsDataURL(file);
  };
  
  const handleMovieSelect = (movieId: string) => {
    setSelectedMovies((prevSelected) =>
      prevSelected.includes(movieId)
        ? prevSelected.filter((id) => id !== movieId)
        : [...prevSelected, movieId]
    );
  };

  const handleSelectAll = () => {
    setSelectedMovies(movies.map(movie => movie.id));
  };

  const handleDeleteSelected = async () => {
    await Promise.all(selectedMovies.map(movieId => deleteMovie(movieId)));
    setSelectedMovies([]);
    toast({
      title: "Selected Movies Deleted",
      description: `${selectedMovies.length} movies have been removed.`,
    });
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block text-sm font-medium mb-1">Poster</label>
                <Image src={editingMovie.posterUrl} alt="Poster" width={300} height={450} className="rounded-md object-cover w-full h-auto" />
                <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'posterUrl')} className="mt-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Logo</label>
                <div className="bg-gray-700 p-2 rounded-md flex justify-center items-center h-[150px]">
                  <Image src={editingMovie.logoUrl} alt="Logo" width={200} height={75} className="object-contain h-full w-auto" />
                </div>
                <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'logoUrl')} className="mt-2" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input name="name" value={editingMovie.name} onChange={handleInputChange} placeholder="Name" />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea name="description" value={editingMovie.description} onChange={handleInputChange} placeholder="Description" rows={4} />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-sm font-medium">Starring</label>
                <Input name="starring" value={editingMovie.starring} onChange={handleInputChange} placeholder="Starring" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Director</label>
                <Input name="director" value={editingMovie.director} onChange={handleInputChange} placeholder="Director" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Runtime</label>
                <Input name="runtime" value={editingMovie.runtime} onChange={handleInputChange} placeholder="Runtime" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Genre</label>
                <Input name="genre" value={editingMovie.genre} onChange={handleInputChange} placeholder="Genre" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Rating</label>
                <Input name="rating" value={editingMovie.rating} onChange={handleInputChange} placeholder="Rating" />
               </div>
            </div>
            <div className="flex gap-2 pt-4">
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
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex items-center">
            <a className="flex items-center gap-2" href="/">
              <Film className="h-6 w-6" />
              <span className="font-bold">Poster Buddy</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
             <Link href="/">
                <Button variant="outline"><Home className="mr-2 h-4 w-4"/> Home</Button>
            </Link>
          </div>
        </div>
      </header>
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Posters</h1>
        <div className="flex items-center space-x-4">
           <div className="flex items-center space-x-2">
            <label htmlFor="cycleSpeed" className="text-sm font-medium">Cycle Speed (seconds)</label>
            <Input
              id="cycleSpeed"
              type="number"
              value={cycleSpeed}
              onChange={(e) => {
                const newSpeed = Number(e.target.value);
                setCycleSpeed(newSpeed);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('cycleSpeed', String(newSpeed));
                }
              }}
  
              className="w-20"
              min="1"
            />

          </div>
          {selectedMovies.length > 0 && (
            <>
              <Button onClick={handleSelectAll} variant="outline">Select All</Button>
              <Button onClick={handleDeleteSelected} variant="destructive">Delete Selected</Button>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Card key={movie.id}>
            <CardHeader>
              <CardTitle className="truncate text-lg">{movie.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[2/3] w-full mb-4">
                 <div className="relative">
                   <Image src={movie.posterUrl} alt={`${movie.name} Poster`} width={300} height={450} className="rounded-md object-cover w-full h-full" />
                    <Checkbox
                      checked={selectedMovies.includes(movie.id)}
                      onCheckedChange={() => handleMovieSelect(movie.id)}
                      className="absolute top-2 right-2"
                    />
                 </div>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-2">
                <Button onClick={() => handleEdit(movie)} size="sm">Edit</Button>
                <Button onClick={() => generateInfoFile(movie)} size="sm" variant="secondary"><Download className="mr-2 h-4 w-4" /> Info</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4"/></Button>
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

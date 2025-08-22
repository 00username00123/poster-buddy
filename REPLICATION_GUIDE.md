# PosterScript Application Replication Guide

This document provides a comprehensive guide to recreating the PosterScript application. It includes an overview of the tech stack, a list of dependencies, and the full source code for every file in the project.

## 1. Core Features

- **Poster Display**: Displays movie posters from a Firestore collection.
- **Side-by-Side Information**: Shows a corresponding logo and text description next to each poster.
- **Automatic Cycling**: Automatically cycles through the posters at a set interval.
- **Manual Navigation**: Allows users to navigate through posters using arrow keys or on-screen buttons.
- **Content Management**: A dedicated page (`/manage`) allows users to add, edit, and delete movie entries.
- **File Uploads**: Users can upload poster, logo, and info files, which are automatically parsed and added to the collection.
- **Firebase Integration**: Uses Firestore as the backend database to persist movie data.

## 2. Technology Stack

- **Framework**: Next.js 15.x (with App Router)
- **Language**: TypeScript
- **UI Library**: React 18.x
- **Styling**: Tailwind CSS with `tailwindcss-animate`.
- **UI Components**: `shadcn/ui` - a collection of reusable components.
- **Database**: Google Firestore
- **Icons**: `lucide-react`

## 3. Project Setup and Dependencies

1.  **Initialize a Next.js Project**:
    ```bash
    npx create-next-app@latest posterscript --typescript --tailwind --eslint
    ```

2.  **Install Dependencies**:
    Navigate into your project directory and install the necessary packages.

    ```json
    {
      "dependencies": {
        "@genkit-ai/googleai": "^1.14.1",
        "@genkit-ai/next": "^1.14.1",
        "@hookform/resolvers": "^4.1.3",
        "@radix-ui/react-accordion": "^1.2.3",
        "@radix-ui/react-alert-dialog": "^1.1.6",
        "@radix-ui/react-avatar": "^1.1.3",
        "@radix-ui/react-checkbox": "^1.1.4",
        "@radix-ui/react-collapsible": "^1.1.11",
        "@radix-ui/react-dialog": "^1.1.6",
        "@radix-ui/react-dropdown-menu": "^2.1.6",
        "@radix-ui/react-label": "^2.1.2",
        "@radix-ui/react-menubar": "^1.1.6",
        "@radix-ui/react-popover": "^1.1.6",
        "@radix-ui/react-progress": "^1.1.2",
        "@radix-ui/react-radio-group": "^1.2.3",
        "@radix-ui/react-scroll-area": "^1.2.3",
        "@radix-ui/react-select": "^2.1.6",
        "@radix-ui/react-separator": "^1.1.2",
        "@radix-ui/react-slider": "^1.2.3",
        "@radix-ui/react-slot": "^1.2.3",
        "@radix-ui/react-switch": "^1.1.3",
        "@radix-ui/react-tabs": "^1.1.3",
        "@radix-ui/react-toast": "^1.2.6",
        "@radix-ui/react-tooltip": "^1.1.8",
        "class-variance-authority": "^0.7.1",
        "clsx": "^2.1.1",
        "date-fns": "^3.6.0",
        "dotenv": "^16.5.0",
        "embla-carousel-react": "^8.6.0",
        "firebase": "^11.9.1",
        "genkit": "^1.14.1",
        "lucide-react": "^0.475.0",
        "next": "15.3.3",
        "patch-package": "^8.0.0",
        "react": "^18.3.1",
        "react-day-picker": "^8.10.1",
        "react-dom": "^18.3.1",
        "react-hook-form": "^7.54.2",
        "recharts": "^2.15.1",
        "tailwind-merge": "^3.0.1",
        "tailwindcss-animate": "^1.0.7",
        "zod": "^3.24.2"
      },
      "devDependencies": {
        "@types/node": "^20",
        "@types/react": "^18",
        "@types/react-dom": "^18",
        "genkit-cli": "^1.14.1",
        "postcss": "^8",
        "tailwindcss": "^3.4.1",
        "typescript": "^5"
      }
    }
    ```

## 4. Source Code

Here is the full source code for each file required to build the application.

---

### `next.config.ts`

```typescript
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

---

### `tailwind.config.ts`

```typescript
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 1.5s ease-in-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

---

### `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: Arial, Helvetica, sans-serif;
}

@layer base {
  :root {
    --background: 0 0% 0%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 358 92% 14%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 0 100% 13%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 70% 35%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 358 92% 14%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
    --sidebar-background: 0 0% 4%;
    --sidebar-foreground: 0 0% 98%;
    --sidebar-primary: 0 100% 13%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 0 0% 20%;
    --sidebar-accent-foreground: 0 0% 98%;
    --sidebar-border: 0 0% 25%;
    --sidebar-ring: 0 100% 13%;
  }
  .dark {
    --background: 0 0% 0%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 358 92% 14%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 0 100% 13%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 70% 35%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 358 92% 14%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

### `src/app/layout.tsx`

```typescript
import type {Metadata} from 'next';
import { Film } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

export const metadata: Metadata = {
  title: 'Poster Buddy',
  description: 'A cycling display of movie posters and information.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
```

---

### `src/app/page.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PosterView } from "@/components/poster-view";
import { Movie, initialMovies } from "@/lib/data";
import { UploadDialog } from "@/components/upload-dialog";
import { useFirestore } from "@/hooks/use-firestore";
import { Film } from "lucide-react";

export default function Home() {
  const { movies, addMovie } = useFirestore<Movie[]>("movies", initialMovies);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 7000);
    return () => clearInterval(interval);
  }, [movies.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentMovie = movies[currentIndex];

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
            <Link href="/manage">
              <Button variant="outline">Manage Posters</Button>
            </Link>
            <UploadDialog movies={movies} addMovie={addMovie} />
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {!currentMovie ? (
           <div className="text-center">
             <p>No movies to display. Upload some posters to get started!</p>
           </div>
         ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <PosterView movie={currentMovie} movieIndex={currentIndex} totalMovies={movies.length} />
            </div>
            <div className="flex items-center justify-center mt-8 gap-4">
              <Button variant="outline" size="icon" onClick={goToPrevious} disabled={movies.length <= 1}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <div className="flex items-center gap-2">
                {movies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      currentIndex === index ? 'bg-primary' : 'bg-muted-foreground/50 hover:bg-muted-foreground'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <Button variant="outline" size="icon" onClick={goToNext} disabled={movies.length <= 1}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
```

---

### `src/app/manage/page.tsx`

```typescript
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
import { useFirestore } from "@/hooks/use-firestore";
import { Movie, initialMovies } from "@/lib/data";
import { Film, Trash2, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ManagePage() {
  const { movies, setMovies, addMovie, updateMovie, deleteMovie } = useFirestore<Movie>("movies", initialMovies);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const { toast } = useToast();

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
```

---

### `src/components/poster-view.tsx`

```typescript
import Image from "next/image";
import type { Movie } from "@/lib/data";

interface PosterViewProps {
  movie: Movie;
  movieIndex: number;
  totalMovies: number;
}

export function PosterView({ movie, movieIndex, totalMovies }: PosterViewProps) {
  return (
    <>
      <div className="flex justify-center">
        <Image
          src={movie.posterUrl}
          alt={`${movie.name} Poster`}
          width={600}
          height={900}
          className="rounded-lg shadow-2xl object-cover"
          data-ai-hint={movie.posterAiHint}
          priority={movieIndex === 0}
        />
      </div>
      <div className="flex flex-col">
        <div className="mb-4 flex justify-center">
          <Image 
            src={movie.logoUrl} 
            alt={`${movie.name} logo`}
            width={400}
            height={150}
            data-ai-hint="movie logo"
            className="object-contain w-full"
          />
        </div>
        <p className="text-muted-foreground mb-4">{`${movieIndex + 1} of ${totalMovies}`}</p>
        <div className="space-y-4 border rounded-md p-4 text-sm text-muted-foreground">
          <p>{movie.description}</p>
          <div>
            <p>{movie.starring}</p>
            <p>{movie.director}</p>
            <p>{movie.runtime}</p>
            <p>{movie.genre}</p>
            <p>{movie.rating}</p>
          </div>
        </div>
      </div>
    </>
  );
}
```

---

### `src/components/upload-dialog.tsx`

```typescript
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
    addMovie: (movie: Omit<Movie, 'id'>) => Promise<void>;
}

export function UploadDialog({ movies, addMovie }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
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

    for (const name in fileGroups) {
        const group = fileGroups[name];
        if (group.poster && group.info) {
            const infoText = await group.info.text();
            const info: Record<string, string> = {};
            const descriptionParts: string[] = [];

            const lines = infoText.split('\n');
            let isDescriptionSection = true;

            lines.forEach(line => {
                const parts = line.split(':');
                if (parts.length > 1 && ['Starring', 'Director', 'Runtime', 'Genre', 'Rating'].includes(parts[0])) {
                    isDescriptionSection = false;
                    const key = parts[0].toLowerCase().replace(/\s/g, '');
                    const value = parts.slice(1).join(':').trim();
                    info[key] = value;
                } else if (line.trim().length > 0) {
                    if(isDescriptionSection) {
                        descriptionParts.push(line.trim());
                    }
                }
            });
            
            const nameMatch = infoText.match(/^Name:\s*(.*)$/im);
            info.name = nameMatch ? nameMatch[1] : name.replace(/_/g, ' ');
            info.description = descriptionParts.join('\n\n');


            const newMovie: Omit<Movie, 'id'> = {
                name: info.name,
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
            await addMovie(newMovie);
        }
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
```

---

### `src/hooks/use-firestore.ts`

```typescript
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';

export function useFirestore<T extends { id: string }>(collectionName: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData);

  useEffect(() => {
    const q = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      setData(documents);
    });

    return () => unsubscribe();
  }, [collectionName]);

  const addDocument = async (newDocument: Omit<T, 'id'>) => {
    await addDoc(collection(db, collectionName), newDocument);
  };

  const updateDocument = async (id: string, updatedDocument: Partial<T>) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, updatedDocument);
  };

  const deleteDocument = async (id: string) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  };

  return { movies: data, setMovies: setData, addMovie: addDocument, updateMovie: updateDocument, deleteMovie: deleteDocument };
}
```

---

### `src/lib/data.ts`

```typescript
export interface Movie {
  id: string;
  name: string;
  posterUrl: string;
  logoUrl: string;
  description: string;
  starring: string;
  director: string;
  runtime: string;
  genre: string;
  rating: string;
  posterAiHint: string;
}

export const initialMovies: Movie[] = [
  {
    id: "1",
    name: "The Last Guardian",
    posterUrl: "https://placehold.co/600x900/a31621/ffffff.png",
    logoUrl: "https://placehold.co/400x150/000000/ffffff.png&text=The+Last+Guardian",
    description: "In a dystopian future where humanity teeters on the brink of extinction, one warrior stands as the final hope against an alien invasion that has consumed the galaxy. With breathtaking action sequences and stunning visual effects, 'The Last Guardian' explores themes of sacrifice, redemption, and the unbreakable human spirit in the face of overwhelming darkness.",
    starring: "Maya Rodriguez, James Chen, Alexandra Park",
    director: "Marcus Thompson",
    runtime: "127 minutes",
    genre: "Sci-Fi Action Thriller",
    rating: "PG-13",
    posterAiHint: "sci-fi warrior poster",
  },
  {
    id: "2",
    name: "Cybernetic City",
    posterUrl: "https://placehold.co/600x900/a31621/ffffff.png",
    logoUrl: "https://placehold.co/400x150/000000/ffffff.png&text=Cybernetic+City",
    description: "In a neon-drenched metropolis of the. Enhanced detective Jax must navigate the neon-soaked underbelly of the city, where every byte of data can be a clue or a trap. Experience a visually stunning cyberpunk world, where advanced technology and urban decay create a captivating and dangerous atmosphere.",
    starring: "Keanu Reeves, Scarlett Johansson",
    director: "Denis Villeneuve",
    runtime: "148 minutes",
    genre: "Cyberpunk Noir",
    rating: "R",
    posterAiHint: "cyberpunk poster",
  },
  {
    id: "3",
    name: "The Last Dragon",
    posterUrl: "https://placehold.co/600x900/a31621/ffffff.png",
    logoUrl: "https://placehold.co/400x150/000000/ffffff.png&text=The+Last+Dragon",
    description: "In a realm of magic and myth, a young warrior is destined to find the last dragon's egg. She must protect it from dark forces who seek to extinguish the last spark of draconic power. Elara, a skilled archer from a secluded village, discovers her connection to an ancient dragon lineage and must embrace her destiny. Journey through breathtaking landscapes, from enchanted forests to towering mountains, in a world brought to life with stunning CGI.",
    starring: "Zendaya, Tom Holland",
    director: "Peter Jackson",
    runtime: "165 minutes",
    genre: "Fantasy Adventure",
    rating: "PG-13",
    posterAiHint: "fantasy poster",
  },
];
```

---

### `src/lib/firebase.ts`

**Note**: You will need to replace the `firebaseConfig` object with your own project's configuration from the Firebase console.

```typescript
'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'posterscript',
  appId: '1:792606330261:web:5e14b903d4a49866cd3a9c',
  storageBucket: 'posterscript.firebasestorage.app',
  apiKey: 'REPLACE_WITH_YOUR_API_KEY',
  authDomain: 'posterscript.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '792606330261',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
```

---

### `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

This guide should provide everything necessary to reconstruct the application. The remaining files are standard `shadcn/ui` components that can be added via the `shadcn/ui` CLI.

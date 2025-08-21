"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PosterView } from "@/components/poster-view";
import { Movie, initialMovies } from "@/lib/data";
import { UploadDialog } from "@/components/upload-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Film } from "lucide-react";

export default function Home() {
  const [movies, setMovies] = useLocalStorage<Movie[]>("movies", initialMovies);
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
            <UploadDialog movies={movies} setMovies={setMovies} />
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

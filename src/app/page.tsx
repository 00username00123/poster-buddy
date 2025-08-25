
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Film } from "lucide-react";
import { PosterView } from "@/components/poster-view";
import { Movie } from "@/lib/data";
import { getMoviesAndSettings } from "@/app/actions";
import { onSnapshot, doc, getFirestore } from "firebase/firestore";
import { app } from "@/lib/firebase"; // Required for onSnapshot listener

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cycleSpeed, setCycleSpeed] = useState(7);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { movies: fetchedMovies, cycleSpeed: fetchedCycleSpeed, error } = await getMoviesAndSettings();
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setMovies(fetchedMovies || []);
      setCycleSpeed(fetchedCycleSpeed || 7);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const db = getFirestore(app);
    
    const unsubscribe = onSnapshot(collection(db, 'movies'), (snapshot) => {
        const fetchedMovies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
        setMovies(fetchedMovies);
    });

    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'user-settings'), (doc) => {
        if (doc.exists()) {
            const settingsData = doc.data();
            if (settingsData && settingsData.cycleSpeed !== undefined) {
                setCycleSpeed(settingsData.cycleSpeed);
            }
        }
    });

    return () => {
        unsubscribe();
        unsubscribeSettings();
    };
}, []);


  const goToPrevious = useCallback(() => {
    if (movies.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  }, [movies.length]);

  const goToNext = useCallback(() => {
    if (movies.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  }, [movies.length]);

  useEffect(() => {
    if (movies.length > 1) {
      const interval = setInterval(goToNext, cycleSpeed * 1000);
      return () => clearInterval(interval);
    }
  }, [movies.length, cycleSpeed, goToNext]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  useEffect(() => {
    if (currentIndex >= movies.length && movies.length > 0) {
      setCurrentIndex(movies.length - 1);
    }
  }, [movies.length, currentIndex]);

  const currentMovie = movies.length > 0 ? movies[currentIndex] : null;

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
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center">
            <p>Loading movies...</p>
          </div>
        ) : !currentMovie ? (
          <div className="text-center">
            <p>No movies to display. Upload some posters to get started!</p>
          </div>
        ) : (
          <>
            <div className="items-center">
              <PosterView
                movie={currentMovie}
                movieIndex={currentIndex}
                totalMovies={movies.length}
              />
            </div>
            <div className="flex items-center justify-center mt-8 gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                disabled={movies.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <div className="flex items-center gap-2">
                {movies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      currentIndex === index
                        ? "bg-primary"
                        : "bg-muted-foreground/50 hover:bg-muted-foreground"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                disabled={movies.length <= 1}
              >
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

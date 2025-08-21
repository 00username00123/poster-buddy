"use client";

import { useState, useEffect } from "react";
import { PosterView } from "@/components/poster-view";
import { movies, CYCLE_INTERVAL } from "@/lib/data";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Preload images for smoother transitions
    movies.forEach(movie => {
      const poster = new window.Image();
      poster.src = movie.posterUrl;
      const logo = new window.Image();
      logo.src = movie.logoUrl;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, CYCLE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const currentMovie = movies[currentIndex];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div
        key={currentIndex}
        className="w-full animate-fade-in"
      >
        <PosterView
          movie={currentMovie}
          isFirst={currentIndex === 0}
        />
      </div>
    </main>
  );
}

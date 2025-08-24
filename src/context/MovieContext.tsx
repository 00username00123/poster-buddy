"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Movie, initialMovies, UploadedMovie } from '@/lib/data';

interface MovieContextType {
  movies: Movie[];
  addMovie: (movie: UploadedMovie) => Movie;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  setMovies: (movies: Movie[]) => void; // Added setMovies function
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>(() => {
    if (typeof window !== 'undefined') {
    }
    return []; // Start with an empty array, movies will be loaded from Firestore
  });


  const addMovie = (movie: UploadedMovie): Movie => {
    // Ensure a unique ID is always generated here
    const newMovie = { ...movie, id: crypto.randomUUID() };
    setMovies(prevMovies => [...prevMovies, newMovie]);
    return newMovie;
  };

  const updateMovie = (id: string, updatedMovie: Partial<Movie>) => {
    setMovies(prevMovies =>
      prevMovies.map(movie =>
        movie.id === id ? { ...movie, ...updatedMovie } : movie
      )
    );
  };

  const deleteMovie = (id: string) => {
    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
  };

  return (
    <MovieContext.Provider value={{ movies, addMovie, updateMovie, deleteMovie, setMovies }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
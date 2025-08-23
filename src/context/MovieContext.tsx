"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Movie, initialMovies } from '@/lib/data';

interface MovieContextType {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  const addMovie = (movie: Movie) => {
    // Generate a simple unique ID for new movies
    const newMovie = { ...movie, id: Date.now().toString() };
    setMovies([...movies, newMovie]);
  };

  const updateMovie = (id: string, updatedMovie: Partial<Movie>) => {
    setMovies(movies.map(movie => movie.id === id ? { ...movie, ...updatedMovie } : movie));
  };

  const deleteMovie = (id: string) => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  return (
    <MovieContext.Provider value={{ movies, addMovie, updateMovie, deleteMovie }}>
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
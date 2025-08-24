"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Movie, initialMovies } from '@/lib/data';

interface MovieContextType {
  movies: Movie[];
  addMovie: (movie: Omit<Movie, 'id'>) => Movie;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('movies');
  }
  const [movies, setMovies] = useState<Movie[]>(() => {
    if (typeof window !== 'undefined') {
      const savedMovies = localStorage.getItem('movies');
      if (savedMovies) {
        return JSON.parse(savedMovies);
      }
    }
    return initialMovies;
  });

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('movies', JSON.stringify(movies.slice(0, 100))); // Save only the first 100 movies
  //   }
  // }, [movies]);

  const addMovie = (movie: Omit<Movie, 'id'>): Movie => {
    const newMovie = { ...movie, id: Date.now().toString() };
    setMovies(prevMovies => [...prevMovies, newMovie]);
    return newMovie;
  };

  const updateMovie = (id: string, updatedMovie: Partial<Movie>) => {
    console.log("updateMovie called with id:", id, "and updatedMovie:", updatedMovie);
 setMovies(prevMovies => {
 console.log("Movies before update:", prevMovies); // Keep existing log
      const index = prevMovies.findIndex(movie => movie.id === id);
      if (index === -1) return prevMovies;

      // Check for duplicate IDs (log only, don't prevent update for testing)
      const duplicateExists = prevMovies.some((movie, idx) =>
        movie.id === updatedMovie.id && idx !== index
      );
      if (duplicateExists) {
        console.error(`Warning: Duplicate movie ID found before update: ${updatedMovie.id}`);
      }

      const newMovies = [...prevMovies.slice(0, index), { ...prevMovies[index], ...updatedMovie as Movie }, ...prevMovies.slice(index + 1)];
 console.log("Movies after update:", newMovies); // Keep existing log

      return newMovies;
    });
  };

  const deleteMovie = (id: string) => {
    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
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
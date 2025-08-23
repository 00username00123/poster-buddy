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
  const [movies, setMovies] = useState<Movie[]>(() => {
    if (typeof window !== 'undefined') {
      const savedMovies = localStorage.getItem('movies');
      if (savedMovies) {
        return JSON.parse(savedMovies);
      }
    }
    return initialMovies;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('movies', JSON.stringify(movies));
    }
  }, [movies]);

  const addMovie = (movie: Omit<Movie, 'id'>): Movie => {
    const newMovie = { ...movie, id: Date.now().toString() };
    setMovies(prevMovies => [...prevMovies, newMovie]);
    return newMovie;
  };

  const updateMovie = (id: string, updatedMovie: Partial<Movie>) => {
    setMovies(prevMovies => prevMovies.map(movie => movie.id === id ? { ...movie, ...updatedMovie } : movie));
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
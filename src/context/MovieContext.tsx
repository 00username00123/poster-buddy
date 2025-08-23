"use client";
import { useEffect } from 'react';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Movie, initialMovies } from '@/lib/data';

interface MovieContextType {
  movies: Movie[];
  addMovie: (movie: Movie) => Movie; // Updated return type
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>(() => {
    // Initialize state from localStorage
    if (typeof window !== 'undefined') {
      const savedMovies = localStorage.getItem('movies');
      if (savedMovies) {
        return JSON.parse(savedMovies);
      }
    } else {
 return initialMovies; // If localStorage is empty, use initialMovies
    }
    return []; // Initialize with an empty array if not in a browser environment
  });

  useEffect(() => {
    // Save movies to localStorage whenever the movies state changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('movies', JSON.stringify(movies));
      console.log('Movies state updated and saved to localStorage:', movies);
    }
  }, [movies]);

  const addMovie = (movie: Movie): Movie => {
    // Generate a simple unique ID for new movies
    const newMovie = { ...movie, id: Date.now().toString() };
    setMovies([...movies, newMovie]);
    return newMovie; // Return the newly added movie
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
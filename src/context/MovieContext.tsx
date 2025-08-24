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
    setMovies(prevMovies => {
 console.log("Movies before update:", prevMovies);
      const index = prevMovies.findIndex(movie => movie.id === id);
      if (index === -1) return prevMovies;
      const newMovies = [...prevMovies.slice(0, index), { ...prevMovies[index], ...updatedMovie }, ...prevMovies.slice(index + 1)];
 console.log("Movies after update:", newMovies);

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
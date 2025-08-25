
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Movie, UploadedMovie } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';

interface MovieContextType {
  movies: Movie[];
  cycleSpeed: number;
  setCycleSpeed: (speed: number) => void;
  addMovie: (movie: UploadedMovie) => Movie;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  setMovies: (movies: Movie[]) => void;
  loading: boolean;
  saveLayout: () => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cycleSpeed, setCycleSpeed] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch movies
        const moviesQuerySnapshot = await getDocs(collection(db, "movies"));
        const fetchedMovies: Movie[] = moviesQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
        setMovies(fetchedMovies);

        // Fetch settings
        const settingsDocRef = doc(db, "settings", "user-settings");
        const settingsDocSnap = await getDoc(settingsDocRef);
        if (settingsDocSnap.exists()) {
          const settingsData = settingsDocSnap.data();
          if (settingsData.cycleSpeed !== undefined) {
            setCycleSpeed(settingsData.cycleSpeed);
          }
        }
      } catch (error) {
        console.error("Error fetching data from Firestore in MovieContext:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addMovie = (movie: UploadedMovie): Movie => {
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
  
  const saveLayout = async () => {
    const batch = writeBatch(db);

    // Save all movies
    movies.forEach(movie => {
      const { id, ...movieData } = movie;
      const movieRef = doc(db, "movies", id);
      batch.set(movieRef, movieData);
    });

    // Save settings
    const settingsRef = doc(db, "settings", "user-settings");
    batch.set(settingsRef, { cycleSpeed: cycleSpeed });
    
    await batch.commit();
  };

  return (
    <MovieContext.Provider value={{ movies, cycleSpeed, setCycleSpeed, addMovie, updateMovie, deleteMovie, setMovies, loading, saveLayout }}>
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

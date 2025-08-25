
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Movie, UploadedMovie } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, deleteDoc, setDoc, updateDoc, writeBatch, getDoc } from 'firebase/firestore';

interface MovieContextType {
  movies: Movie[];
  cycleSpeed: number;
  loading: boolean;
  setCycleSpeed: (speed: number) => void;
  addMovie: (movie: UploadedMovie) => Promise<void>;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  saveLayout: (moviesToSave: Movie[], newCycleSpeed: number) => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cycleSpeed, setCycleSpeed] = useState<number>(7);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const moviesCollection = collection(db, 'movies');
    const unsubscribeMovies = onSnapshot(moviesCollection, (snapshot) => {
      const fetchedMovies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
      setMovies(fetchedMovies);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching movies from Firestore:", error);
      setLoading(false);
    });

    const settingsDoc = doc(db, 'settings', 'user-settings');
    const unsubscribeSettings = onSnapshot(settingsDoc, (doc) => {
      if (doc.exists()) {
        const settingsData = doc.data();
        if (settingsData.cycleSpeed !== undefined) {
          setCycleSpeed(settingsData.cycleSpeed);
        }
      }
    }, (error) => {
      console.error("Error fetching settings from Firestore:", error);
    });

    return () => {
      unsubscribeMovies();
      unsubscribeSettings();
    };
  }, []);

  const addMovie = useCallback(async (movie: UploadedMovie) => {
    const newId = crypto.randomUUID();
    const movieRef = doc(db, "movies", newId);
    await setDoc(movieRef, movie);
  }, []);

  const updateMovie = useCallback(async (id: string, updatedMovie: Partial<Movie>) => {
    // Optimistic update
    setMovies(prevMovies => prevMovies.map(m => m.id === id ? { ...m, ...updatedMovie } : m));
    const movieRef = doc(db, "movies", id);
    try {
      await updateDoc(movieRef, updatedMovie);
    } catch (error) {
      console.error("Failed to update movie, rolling back:", error);
      // NOTE: A more robust rollback would re-fetch the original state
    }
  }, []);

  const deleteMovie = useCallback(async (id: string) => {
    // Optimistic update
    setMovies(prevMovies => prevMovies.filter(m => m.id !== id));
    const movieRef = doc(db, "movies", id);
    await deleteDoc(movieRef);
  }, []);

  const saveLayout = useCallback(async (moviesToSave: Movie[], newCycleSpeed: number) => {
    // Optimistic UI updates
    setMovies(moviesToSave);
    setCycleSpeed(newCycleSpeed);

    try {
      const batch = writeBatch(db);

      // Save cycle speed
      const settingsRef = doc(db, "settings", "user-settings");
      batch.set(settingsRef, { cycleSpeed: newCycleSpeed }, { merge: true });

      // Save all movies
      moviesToSave.forEach(movie => {
        const movieRef = doc(db, "movies", movie.id);
        batch.set(movieRef, movie);
      });
      
      await batch.commit();
    } catch (error) {
      console.error("Error saving layout to Firestore:", error);
      // NOTE: Here you could implement a rollback logic or notify the user
      throw error;
    }
  }, []);


  return (
    <MovieContext.Provider value={{ movies, cycleSpeed, loading, setCycleSpeed, addMovie, updateMovie, deleteMovie, saveLayout }}>
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

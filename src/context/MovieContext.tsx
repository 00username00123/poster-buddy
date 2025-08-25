
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Movie, UploadedMovie } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, writeBatch, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';

interface MovieContextType {
  movies: Movie[];
  cycleSpeed: number;
  loading: boolean;
  setCycleSpeed: (speed: number) => void;
  addMovie: (movie: UploadedMovie) => Promise<void>;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  saveLayout: (data: { movies: Movie[], cycleSpeed: number }) => Promise<void>;
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

  const addMovie = async (movie: UploadedMovie) => {
    const newMovie = { ...movie, id: crypto.randomUUID() };
    const movieRef = doc(db, "movies", newMovie.id);
    await setDoc(movieRef, movie); 
  };

  const updateMovie = async (id: string, updatedMovie: Partial<Movie>) => {
    const movieRef = doc(db, "movies", id);
    await updateDoc(movieRef, updatedMovie);
  };

  const deleteMovie = async (id: string) => {
    const movieRef = doc(db, "movies", id);
    await deleteDoc(movieRef);
  };
  
  const saveLayout = async ({ movies: layoutMovies, cycleSpeed: layoutSpeed }: { movies: Movie[], cycleSpeed: number }) => {
    const batch = writeBatch(db);

    layoutMovies.forEach(movie => {
      const { id, ...movieData } = movie;
      const movieRef = doc(db, "movies", id);
      batch.set(movieRef, movieData);
    });
    
    const settingsRef = doc(db, "settings", "user-settings");
    batch.set(settingsRef, { cycleSpeed: layoutSpeed });

    await batch.commit();
  };

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

    
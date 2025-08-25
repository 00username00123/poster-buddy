
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Movie, UploadedMovie } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, deleteDoc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

interface MovieContextType {
  movies: Movie[];
  cycleSpeed: number;
  loading: boolean;
  setCycleSpeed: (speed: number) => void;
  addMovie: (movie: UploadedMovie) => Promise<void>;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  saveLayout: () => Promise<void>;
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
    const newId = crypto.randomUUID();
    const movieRef = doc(db, "movies", newId);
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

  const saveLayout = async () => {
    try {
      // Save cycle speed
      const settingsRef = doc(db, "settings", "user-settings");
      await setDoc(settingsRef, { cycleSpeed: cycleSpeed }, { merge: true });

      // The onSnapshot listener already keeps the local `movies` state
      // in sync with Firestore, so we only need to update the documents
      // that have actually changed (e.g., through the edit form).
      // The `updateMovie` function already handles this.
      // So, just saving the cycle speed is enough here.
      console.log("Layout saved successfully (Cycle Speed).");

    } catch (error) {
      console.error("Error saving layout:", error);
      throw error;
    }
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


"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Movie, UploadedMovie } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, setDoc, addDoc } from 'firebase/firestore';

interface MovieContextType {
  movies: Movie[];
  cycleSpeed: number;
  loading: boolean;
  addMovie: (movie: UploadedMovie) => Promise<void>;
  setCycleSpeed: React.Dispatch<React.SetStateAction<number>>; // Allow direct setting from manage page
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
      if (loading) setLoading(false);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const addMovie = async (movie: UploadedMovie) => {
    try {
      await addDoc(collection(db, 'movies'), movie);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const contextValue = {
    movies,
    cycleSpeed,
    loading,
    addMovie,
    setCycleSpeed
  };

  return (
    <MovieContext.Provider value={contextValue}>
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

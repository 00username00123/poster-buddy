
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Movie, UploadedMovie } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, writeBatch } from 'firebase/firestore';

interface MovieContextType {
  movies: Movie[];
  cycleSpeed: number;
  setCycleSpeed: (speed: number) => void;
  addMovie: (movie: UploadedMovie) => void;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  setMovies: (movies: Movie[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  loadData: () => Promise<void>;
  saveLayout: () => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const loadDataFromFirestore = async (): Promise<{ movies: Movie[]; cycleSpeed: number }> => {
  const moviesQuerySnapshot = await getDocs(collection(db, "movies"));
  const fetchedMovies: Movie[] = moviesQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));

  const settingsDocRef = doc(db, "settings", "user-settings");
  const settingsDocSnap = await getDoc(settingsDocRef);
  let fetchedCycleSpeed = 7;
  if (settingsDocSnap.exists()) {
    const settingsData = settingsDocSnap.data();
    if (settingsData.cycleSpeed !== undefined) {
      fetchedCycleSpeed = settingsData.cycleSpeed;
    }
  }
  return { movies: fetchedMovies, cycleSpeed: fetchedCycleSpeed };
};

export const saveLayoutToFirestore = async (movies: Movie[], cycleSpeed: number) => {
  const batch = writeBatch(db);

  movies.forEach(movie => {
    const { id, ...movieData } = movie;
    const movieRef = doc(db, "movies", id);
    batch.set(movieRef, movieData);
  });

  const settingsRef = doc(db, "settings", "user-settings");
  batch.set(settingsRef, { cycleSpeed });

  await batch.commit();
};


export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies, setMoviesState] = useState<Movie[]>([]);
  const [cycleSpeed, setCycleSpeedState] = useState<number>(7);
  const [loading, setLoading] = useState<boolean>(true);

  const addMovie = (movie: UploadedMovie) => {
    const newMovie = { ...movie, id: crypto.randomUUID() };
    setMoviesState(prevMovies => [...prevMovies, newMovie]);
  };

  const updateMovie = (id: string, updatedMovie: Partial<Movie>) => {
    setMoviesState(prevMovies =>
      prevMovies.map(movie =>
        movie.id === id ? { ...movie, ...updatedMovie } : movie
      )
    );
  };

  const deleteMovie = (id: string) => {
    setMoviesState(prevMovies => prevMovies.filter(movie => movie.id !== id));
  };
  
  const setMovies = (newMovies: Movie[]) => {
    setMoviesState(newMovies);
  }

  const setCycleSpeed = (speed: number) => {
    setCycleSpeedState(speed);
  }

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { movies, cycleSpeed } = await loadDataFromFirestore();
      setMovies(movies);
      setCycleSpeed(cycleSpeed);
    } catch (error) {
      console.error("Error loading data from Firestore:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveLayout = useCallback(async () => {
    await saveLayoutToFirestore(movies, cycleSpeed);
  }, [movies, cycleSpeed]);


  return (
    <MovieContext.Provider value={{ movies, cycleSpeed, setCycleSpeed, addMovie, updateMovie, deleteMovie, setMovies, loading, setLoading, loadData, saveLayout }}>
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

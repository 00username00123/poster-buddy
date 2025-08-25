
'use server';

import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Movie, UploadedMovie } from '@/lib/data';

// Explicitly define the projectId for initialization.
const projectId = 'posterscript';

// Initialize Firebase Admin SDK if not already initialized.
if (!getApps().length) {
  initializeApp({ projectId });
}

const db = getFirestore();

export async function getMoviesAndSettings() {
  try {
    const moviesCollection = db.collection('movies');
    const settingsDocRef = db.collection('settings').doc('user-settings');

    const [moviesSnapshot, settingsDoc] = await Promise.all([
      moviesCollection.get(),
      settingsDocRef.get(),
    ]);

    const movies = moviesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
    
    let cycleSpeed = 7; // Default value
    if (settingsDoc.exists) {
        const settingsData = settingsDoc.data();
        if (settingsData && settingsData.cycleSpeed !== undefined) {
            cycleSpeed = settingsData.cycleSpeed;
        }
    }

    return { movies, cycleSpeed };
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return { movies: [], cycleSpeed: 7, error: 'Failed to load data.' };
  }
}

export async function saveMoviesAndSettings(movies: Movie[], cycleSpeed: number) {
    const batch = db.batch();

    const settingsRef = db.collection('settings').doc('user-settings');
    batch.set(settingsRef, { cycleSpeed: cycleSpeed });

    movies.forEach(movie => {
        const movieRef = db.collection('movies').doc(movie.id);
        batch.set(movieRef, movie);
    });

    try {
        await batch.commit();
        return { success: true };
    } catch (error) {
        console.error("Error saving layout:", error);
        return { success: false, error: 'Failed to save layout.' };
    }
}


export async function addMovie(movie: UploadedMovie) {
    try {
        const docRef = await db.collection('movies').add(movie);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding movie:", error);
        return { success: false, error: 'Failed to add movie.' };
    }
}

export async function deleteMovie(movieId: string) {
    try {
        await db.collection('movies').doc(movieId).delete();
        return { success: true };
    } catch (error) {
        console.error("Error deleting movie:", error);
        return { success: false, error: 'Failed to delete movie.' };
    }
}

export async function deleteSelectedMovies(movieIds: string[]) {
    const batch = db.batch();
    movieIds.forEach(movieId => {
        const docRef = db.collection("movies").doc(movieId);
        batch.delete(docRef);
    });
    try {
        await batch.commit();
        return { success: true };
    } catch (error) {
        console.error("Error deleting selected movies:", error);
        return { success: false, error: 'Failed to delete movies.' };
    }
}

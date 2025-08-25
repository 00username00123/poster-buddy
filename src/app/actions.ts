
'use server';

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Movie, UploadedMovie } from '@/lib/data';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    // projectId is used for local development and will be automatically
    // inferred in the App Hosting environment.
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = getFirestore();

export async function getMoviesAndSettings() {
    try {
        const moviesCollection = db.collection('movies');
        const settingsDocRef = db.doc('settings/user-settings');

        const [moviesSnapshot, settingsDoc] = await Promise.all([
            moviesCollection.get(),
            settingsDocRef.get(),
        ]);

        const movies = moviesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
        
        let cycleSpeed = 7;
        if (settingsDoc.exists) {
            const settingsData = settingsDoc.data();
            if (settingsData && settingsData.cycleSpeed !== undefined) {
                cycleSpeed = settingsData.cycleSpeed;
            }
        }

        return { movies, cycleSpeed };
    } catch (error: any) {
        console.error("Error in getMoviesAndSettings:", error);
        return { error: error.message || 'Failed to load data.' };
    }
}

export async function saveSettings(cycleSpeed: number) {
    try {
        const settingsRef = db.doc('settings/user-settings');
        await settingsRef.set({ cycleSpeed }, { merge: true });
        return { success: true };
    } catch (error: any) {
        console.error("Error saving settings:", error);
        return { success: false, error: error.message || 'Failed to save settings.' };
    }
}

export async function addMovie(movie: UploadedMovie) {
    try {
        await db.collection('movies').add(movie);
        return { success: true };
    } catch (error: any) {
        console.error("Error adding movie:", error);
        return { success: false, error: error.message || 'Failed to add movie.' };
    }
}

export async function updateMovie(movie: Movie) {
    try {
        const movieRef = db.doc(`movies/${movie.id}`);
        const { id, ...movieData } = movie;
        await movieRef.set(movieData, { merge: true });
        return { success: true };
    } catch (error: any) {
        console.error("Error updating movie:", error);
        return { success: false, error: error.message || 'Failed to update movie.' };
    }
}

export async function deleteMovie(movieId: string) {
    try {
        await db.doc(`movies/${movieId}`).delete();
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting movie:", error);
        return { success: false, error: error.message || 'Failed to delete movie.' };
    }
}

export async function deleteSelectedMovies(movieIds: string[]) {
    try {
        const batch = db.batch();
        movieIds.forEach(movieId => {
            const docRef = db.doc(`movies/${movieId}`);
            batch.delete(docRef);
        });
        await batch.commit();
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting movies:", error);
        return { success: false, error: error.message || 'Failed to delete selected movies.' };
    }
}

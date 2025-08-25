
'use server';

import { Movie, UploadedMovie } from '@/lib/data';
import admin from 'firebase-admin';

// Helper function to initialize Firebase Admin and get a Firestore instance
function getDb() {
    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
        } catch (error: any) {
            if (!/already exists/u.test(error.message)) {
                console.error('Firebase admin initialization error', error);
            }
        }
    }
    return admin.firestore();
}

export async function getMoviesAndSettings() {
    try {
        const db = getDb();
        const moviesSnapshot = await db.collection('movies').get();
        const movies = moviesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));

        const settingsDoc = await db.collection('settings').doc('user-settings').get();
        const cycleSpeed = settingsDoc.exists ? settingsDoc.data()?.cycleSpeed || 7 : 7;
        
        return { movies, cycleSpeed };
    } catch (error: any) {
        console.error("Error in getMoviesAndSettings:", error.message);
        return { error: error.message || 'Failed to load data.' };
    }
}

export async function saveSettings(cycleSpeed: number) {
    try {
        const db = getDb();
        await db.collection('settings').doc('user-settings').set({ cycleSpeed }, { merge: true });
        return { success: true };
    } catch (error: any) {
        console.error("Error saving settings:", error.message);
        return { success: false, error: error.message || 'Failed to save settings.' };
    }
}

export async function addMovie(movie: UploadedMovie) {
    try {
        const db = getDb();
        await db.collection('movies').add(movie);
        return { success: true };
    } catch (error: any) {
        console.error("Error adding movie:", error.message);
        return { success: false, error: error.message || 'Failed to add movie.' };
    }
}


export async function updateMovie(movie: Movie) {
    try {
        const db = getDb();
        const { id, ...movieData } = movie;
        await db.collection('movies').doc(id).update(movieData);
        return { success: true };
    } catch (error: any) {
        console.error("Error updating movie:", error.message);
        return { success: false, error: error.message || 'Failed to update movie.' };
    }
}

export async function deleteMovie(movieId: string) {
    try {
        const db = getDb();
        await db.collection('movies').doc(movieId).delete();
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting movie:", error.message);
        return { success: false, error: error.message || 'Failed to delete movie.' };
    }
}

export async function deleteSelectedMovies(movieIds: string[]) {
     try {
        const db = getDb();
        const batch = db.batch();
        movieIds.forEach(id => {
            const docRef = db.collection('movies').doc(id);
            batch.delete(docRef);
        });
        await batch.commit();
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting movies:", error.message);
        return { success: false, error: error.message || 'Failed to delete selected movies.' };
    }
}

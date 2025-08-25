
'use server';

import { Movie, UploadedMovie } from '@/lib/data';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
try {
    if (!admin.apps.length) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
    }
} catch (error: any) {
    // We ignore this during build step
    if (!error.message.includes('json')) {
        console.error('Firebase admin initialization error', error);
    }
}


const db = admin.firestore();

export async function getMoviesAndSettings() {
    try {
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
        await db.collection('settings').doc('user-settings').set({ cycleSpeed }, { merge: true });
        return { success: true };
    } catch (error: any) {
        console.error("Error saving settings:", error.message);
        return { success: false, error: error.message || 'Failed to save settings.' };
    }
}

export async function addMovie(movie: UploadedMovie) {
    try {
        await db.collection('movies').add(movie);
        return { success: true };
    } catch (error: any) {
        console.error("Error adding movie:", error.message);
        return { success: false, error: error.message || 'Failed to add movie.' };
    }
}


export async function updateMovie(movie: Movie) {
    try {
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
        await db.collection('movies').doc(movieId).delete();
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting movie:", error.message);
        return { success: false, error: error.message || 'Failed to delete movie.' };
    }
}

export async function deleteSelectedMovies(movieIds: string[]) {
     try {
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

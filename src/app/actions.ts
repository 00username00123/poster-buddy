'use server';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { Movie, UploadedMovie } from '@/lib/data';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export async function getMoviesAndSettings() {
    try {
        const moviesCollection = collection(db, 'movies');
        const settingsDocRef = doc(db, 'settings', 'user-settings');

        const [moviesSnapshot, settingsDoc] = await Promise.all([
            getDocs(moviesCollection),
            getDoc(settingsDocRef),
        ]);

        const movies = moviesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
        
        let cycleSpeed = 7;
        if (settingsDoc.exists()) {
            const settingsData = settingsDoc.data();
            if (settingsData && settingsData.cycleSpeed !== undefined) {
                cycleSpeed = settingsData.cycleSpeed;
            }
        }

        return { movies, cycleSpeed };
    } catch (error) {
        console.error("Error in getMoviesAndSettings:", error);
        return { error: 'Failed to load data.' };
    }
}

export async function saveSettings(cycleSpeed: number) {
    try {
        const settingsRef = doc(db, 'settings', 'user-settings');
        await setDoc(settingsRef, { cycleSpeed });
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to save settings.' };
    }
}


export async function addMovie(movie: UploadedMovie) {
    try {
        await addDoc(collection(db, "movies"), movie);
        return { success: true };
    } catch (error: any) {
        console.error("Error in addMovie:", error);
        return { success: false, error: 'Failed to add movie.' };
    }
}

export async function updateMovie(movie: Movie) {
    try {
        const movieRef = doc(db, 'movies', movie.id);
        await setDoc(movieRef, movie);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update movie.' };
    }
}

export async function deleteMovie(movieId: string) {
    try {
        await deleteDoc(doc(db, "movies", movieId));
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete movie.' };
    }
}

export async function deleteSelectedMovies(movieIds: string[]) {
    try {
        const batch = writeBatch(db);
        movieIds.forEach(movieId => {
            const docRef = doc(db, "movies", movieId);
            batch.delete(docRef);
        });
        await batch.commit();
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete selected movies.' };
    }
}

'use server';

import { Movie, UploadedMovie } from '@/lib/data';
import { GoogleAuth } from 'google-auth-library';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

let authToken: string | null | undefined;

async function getAuthToken() {
    if (authToken) {
        return authToken;
    }
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/datastore'
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    authToken = token.token;
    return authToken;
}

// Firestore REST API data format is verbose. These helpers simplify conversion.
const formatValue = (value: any) => {
    if (typeof value === 'string') return { stringValue: value };
    if (typeof value === 'boolean') return { booleanValue: value };
    if (typeof value === 'number') return { doubleValue: value }; // or integerValue
    if (value === null) return { nullValue: null };
    if (Array.isArray(value)) return { arrayValue: { values: value.map(formatValue) } };
    if (typeof value === 'object') {
        const mapValue: { [key: string]: any } = {};
        for (const key in value) {
            mapValue[key] = formatValue(value[key]);
        }
        return { mapValue: { fields: mapValue } };
    }
    return {};
};

const parseValue = (value: any): any => {
    if (value.stringValue !== undefined) return value.stringValue;
    if (value.booleanValue !== undefined) return value.booleanValue;
    if (value.doubleValue !== undefined) return value.doubleValue;
    if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
    if (value.nullValue !== undefined) return null;
    if (value.arrayValue?.values) return value.arrayValue.values.map(parseValue);
    if (value.mapValue?.fields) {
        const obj: { [key: string]: any } = {};
        for (const key in value.mapValue.fields) {
            obj[key] = parseValue(value.mapValue.fields[key]);
        }
        return obj;
    }
    return undefined;
};

const documentToMovie = (doc: any): Movie => {
    const id = doc.name.split('/').pop();
    const fields = doc.fields;
    const movieData: { [key: string]: any } = {};
    for (const key in fields) {
        movieData[key] = parseValue(fields[key]);
    }
    return { id, ...movieData } as Movie;
}

export async function getMoviesAndSettings() {
    try {
        const token = await getAuthToken();
        const headers = { 'Authorization': `Bearer ${token}` };

        const moviesUrl = `${API_BASE_URL}/movies`;
        const settingsUrl = `${API_BASE_URL}/settings/user-settings`;

        const [moviesResponse, settingsResponse] = await Promise.all([
            fetch(moviesUrl, { headers }),
            fetch(settingsUrl, { headers }),
        ]);

        if (!moviesResponse.ok && moviesResponse.status !== 404) {
            const error = await moviesResponse.json();
            throw new Error(`Failed to fetch movies: ${JSON.stringify(error)}`);
        }
        const moviesData = moviesResponse.ok ? await moviesResponse.json() : { documents: [] };
        const movies = (moviesData.documents || []).map(documentToMovie);

        let cycleSpeed = 7;
        if (settingsResponse.ok) {
            const settingsData = await settingsResponse.json();
            if (settingsData.fields?.cycleSpeed) {
                cycleSpeed = parseValue(settingsData.fields.cycleSpeed);
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
        const token = await getAuthToken();
        const url = `${API_BASE_URL}/settings/user-settings`;

        const payload = {
            fields: {
                cycleSpeed: formatValue(cycleSpeed),
            }
        };

        const response = await fetch(`${url}?updateMask.fieldPaths=cycleSpeed`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error saving settings:", error);
        return { success: false, error: error.message || 'Failed to save settings.' };
    }
}

export async function addMovie(movie: UploadedMovie) {
    try {
        const token = await getAuthToken();
        const url = `${API_BASE_URL}/movies`;

        const payload = {
            fields: formatValue(movie).mapValue?.fields
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error adding movie:", error);
        return { success: false, error: error.message || 'Failed to add movie.' };
    }
}


export async function updateMovie(movie: Movie) {
    try {
        const token = await getAuthToken();
        const { id, ...movieData } = movie;
        const url = `${API_BASE_URL}/movies/${id}`;

        const payload = {
            fields: formatValue(movieData).mapValue?.fields
        };

        // Create a list of field paths to update.
        const updateMask = Object.keys(movieData).map(field => `updateMask.fieldPaths=${field}`).join('&');

        const response = await fetch(`${url}?${updateMask}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error updating movie:", error);
        return { success: false, error: error.message || 'Failed to update movie.' };
    }
}

export async function deleteMovie(movieId: string) {
    try {
        const token = await getAuthToken();
        const url = `${API_BASE_URL}/movies/${movieId}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting movie:", error);
        return { success: false, error: error.message || 'Failed to delete movie.' };
    }
}

export async function deleteSelectedMovies(movieIds: string[]) {
     try {
        const token = await getAuthToken();
        const url = `${API_BASE_URL}:commit`;
        
        const writes = movieIds.map(movieId => ({
            delete: `projects/${PROJECT_ID}/databases/(default)/documents/movies/${movieId}`
        }));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ writes }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting movies:", error);
        return { success: false, error: error.message || 'Failed to delete selected movies.' };
    }
}

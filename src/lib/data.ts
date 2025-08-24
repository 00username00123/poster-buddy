export interface Movie {
  id: string;
  name: string;
  posterUrl: string;
  logoUrl: string;
  description: string;
  starring: string;
  director: string;
  runtime: string;
  genre: string;
  rating: string;
  posterAiHint: string;
}

// This is for movies that are being created but don't have a final ID yet.
export type UploadedMovie = Omit<Movie, 'id'>;

export const initialMovies: Movie[] = [];

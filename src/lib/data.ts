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

export const initialMovies: Movie[] = [];

import Image from "next/image";
import type { Movie } from "@/lib/data";

interface PosterViewProps {
  movie: Movie;
  movieIndex: number;
  totalMovies: number;
}

export function PosterView({ movie, movieIndex, totalMovies }: PosterViewProps) {
  return (
    <>
      <div className="flex justify-center">
        <Image
          src={movie.posterUrl}
          alt={`${movie.name} Poster`}
          width={600}
          height={900}
          className="rounded-lg shadow-2xl object-cover"
          data-ai-hint={movie.posterAiHint}
          priority={movieIndex === 0}
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold">{movie.name}</h1>
        <p className="text-muted-foreground mb-4">{`${movieIndex + 1} of ${totalMovies}`}</p>
        <div className="space-y-4 border rounded-md p-4 text-sm text-muted-foreground">
          <p>{movie.description}</p>
          <p>{movie.commanderBlurb}</p>
          <p>{movie.visualsBlurb}</p>
          <div>
            <p><strong>Starring:</strong> {movie.starring}</p>
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Runtime:</strong> {movie.runtime}</p>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Rating:</strong> {movie.rating}</p>
          </div>
        </div>
        <div className="mt-4 p-4 border border-dashed rounded-md text-sm text-muted-foreground">
          <p><strong>Demo Mode:</strong> Upload your own movie posters and text files to replace these samples. Ensure poster images and text files have matching names (e.g., "movie1.jpg" and "movie1.txt")</p>
        </div>
      </div>
    </>
  );
}

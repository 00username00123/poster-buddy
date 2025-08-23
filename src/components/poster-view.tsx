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
          className="rounded-lg shadow-2xl object-cover w-full h-auto max-w-md"
          data-ai-hint={movie.posterAiHint}
          priority={movieIndex === 0}
        />
      </div>
      <div className="flex flex-col">
        <div className="mb-4 flex justify-center h-24 sm:h-32 md:h-40">
          <Image 
            src={movie.logoUrl} 
            alt={`${movie.name} logo`}
            width={400}
            height={150}
            data-ai-hint="movie logo"
            className="object-contain w-auto h-full max-w-full"
          />
        </div>
        <p className="text-muted-foreground mb-4 text-center lg:text-left">{`${movieIndex + 1} of ${totalMovies}`}</p>
        <div className="space-y-4 border rounded-md p-4 text-sm sm:text-base text-muted-foreground">
          <p className="text-base sm:text-lg">{movie.description}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
            <p><span className="font-semibold">Starring:</span> {movie.starring}</p>
            <p><span className="font-semibold">Director:</span> {movie.director}</p>
            <p><span className="font-semibold">Runtime:</span> {movie.runtime}</p>
            <p><span className="font-semibold">Genre:</span> {movie.genre}</p>
            <p><span className="font-semibold">Rating:</span> {movie.rating}</p>
          </div>
        </div>
      </div>
    </>
  );
}

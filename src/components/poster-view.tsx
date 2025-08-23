import Image from "next/image";
import type { Movie } from "@/lib/data";

interface PosterViewProps {
  movie: Movie;
  movieIndex: number;
  totalMovies: number;
}

export function PosterView({ movie, movieIndex, totalMovies }: PosterViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
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
        <div className="mb-4 flex justify-center lg:justify-start">
          <Image 
            src={movie.logoUrl} 
            alt={`${movie.name} logo`}
            width={400}
            height={150}
            data-ai-hint="movie logo"
            className="object-contain"
          />
        </div>
        <p className="text-muted-foreground mb-4 text-center lg:text-left">{`${movieIndex + 1} of ${totalMovies}`}</p>
        <div className="space-y-4 border rounded-md p-4 text-sm text-muted-foreground">
          <p>{movie.description}</p>
          <div className="grid grid-cols-2 gap-2">
            <p>{movie.starring}</p>
            <p>{movie.director}</p>
            <p>{movie.runtime}</p>
            <p>{movie.genre}</p>
            <p>{movie.rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

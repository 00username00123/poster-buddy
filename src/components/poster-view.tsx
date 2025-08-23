import Image from "next/image";
import type { Movie } from "@/lib/data";

interface PosterViewProps {
  movie: Movie;
  movieIndex: number;
  totalMovies: number;
  theme: string;
}

export function PosterView({ movie, movieIndex, totalMovies, theme }: PosterViewProps) {
  let themeClass = '';
  switch (theme) {
    case 'Blue':
      themeClass = 'bg-blue-900';
      break;
    case 'Red':
      themeClass = 'bg-red-900';
      break;
    case 'Pumpkin':
      themeClass = 'bg-orange-900';
      break;
    default:
      themeClass = 'bg-gray-900'; // Default dark theme
  }

  return (
    <div className={`p-4 rounded-lg ${themeClass} dark`}>
      <div className="flex justify-center mb-4">
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
      <div className="flex flex-col items-center lg:items-start">
        <div className="mb-4 flex justify-center items-center h-24 sm:h-32 md:h-40">
          <Image
            src={movie.logoUrl}
            alt={`${movie.name} logo`}
            width={300}
            height={100}
            data-ai-hint="movie logo"
            className="object-contain w-auto h-full max-w-[80%]"
          />
        </div>
        <p className="text-muted-foreground mb-4">{`${movieIndex + 1} of ${totalMovies}`}</p>
        <div className="space-y-4 border rounded-md p-4 text-sm sm:text-base text-muted-foreground">
          <p className="text-base sm:text-lg">{movie.description}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
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

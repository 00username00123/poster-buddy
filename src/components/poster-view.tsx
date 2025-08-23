import Image from "next/image";
import type { Movie } from "@/lib/data";

interface PosterViewProps {
  isEditing: boolean;
  movie: Movie;
  movieIndex: number;
  totalMovies: number;
  theme: string;
}

export function PosterView({ movie, movieIndex, totalMovies, theme }: PosterViewProps) {
  let themeClass = ''; // TODO: Remove when dynamic theme is working.
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
    <div className={`p-4 rounded-lg ${themeClass} dark flex flex-col lg:flex-row gap-4 items-center lg:items-stretch`}>
      <div className="w-full lg:w-1/2 flex justify-center">
 <Image
 src={movie.posterUrl || '/placeholder-poster.png'}
 alt={`${movie.name} Poster`}
 width={600}
 height={900}
 className="rounded-lg shadow-2xl object-cover w-full h-auto max-w-md"
 data-ai-hint={movie.posterAiHint}
 priority={movieIndex === 0}
 />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-between">
        <div className="mb-4 flex justify-center items-center h-24 sm:h-32 md:h-40 w-full">
 <Image
 src={movie.logoUrl || '/placeholder-logo.png'}
 alt={`${movie.name} logo`}
 width={300}
 height={100}
 data-ai-hint="movie logo"
 className="object-contain w-auto h-full max-w-[80%] lg:max-w-full"
 />
        </div>
        <div className="flex-grow w-full flex flex-col justify-center">
 <p className="text-muted-foreground mb-4 text-center lg:text-left">{`${movieIndex + 1} of ${totalMovies}`}</p>

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
    </div>
  );
}

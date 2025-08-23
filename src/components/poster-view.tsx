import Image from "next/image";
import type { Movie } from "@/lib/data";

interface PosterViewProps {
 movie: Movie;
 movieIndex: number;
 totalMovies: number;
}

export function PosterView({ movie, movieIndex, totalMovies }: PosterViewProps) {
  const textColorClass = 'text-muted-foreground';
  const borderColorClass = 'border';

  const detailsGridClass = `grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm ${textColorClass}`;

  return (
    <div className={`dark flex flex-col lg:flex-row gap-8 items-center lg:items-start w-full px-4 py-8`}>
      <div className="w-full lg:w-2/3 flex justify-center lg:justify-start">
        <Image
          src={movie.posterUrl || '/placeholder-poster.png'}
          alt={`${movie.name} Poster`}
          width={2340}
          height={3510}
          className="rounded-lg shadow-2xl object-contain w-auto max-h-[calc(100vh-100px)]"
          data-ai-hint={movie.posterAiHint || "Movie poster"}
          priority={movieIndex === 0}
        />
      </div>
      <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start justify-start lg:text-left h-[600px] lg:h-[900px]">
        <div className="mb-4 flex justify-center lg:justify-start items-center h-24 sm:h-32 md:h-40 w-full flex-shrink-0">
          <Image
            src={movie.logoUrl || '/placeholder-logo.svg'}
            alt={`${movie.name} logo`}
            width={400}
            height={150}
            data-ai-hint="movie logo"
            className="object-contain w-auto h-full max-w-[80%] lg:max-w-full"
          />
        </div>
        <div className="flex-grow w-full flex flex-col justify-start items-start lg:text-left overflow-y-auto">
          <p className={`mb-4 text-center lg:text-left ${textColorClass}`}>{`${movieIndex + 1} of ${totalMovies}`}</p>
          <div className={`space-y-4 rounded-md p-4 text-sm sm:text-base ${borderColorClass} border w-full text-center lg:text-left flex-grow`}>
            <p className={`text-base sm:text-lg ${textColorClass} text-center lg:text-left`}>{movie.description}</p>
            <div className={detailsGridClass}>
              <p className="text-center lg:text-left">{movie.starring}</p>
              <p className="text-center lg:text-left">{movie.director}</p>
              <p className={`text-center lg:text-left`}>{movie.runtime}</p>
              <p className="text-center lg:text-left">{movie.genre}</p>
              <p className="text-center lg:text-left">{movie.rating}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

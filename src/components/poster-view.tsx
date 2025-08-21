import Image from "next/image";
import type { Movie } from "@/lib/data";

interface PosterViewProps {
  movie: Movie;
  isFirst: boolean;
}

export function PosterView({ movie, isFirst }: PosterViewProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-2 flex justify-center">
          <Image
            src={movie.posterUrl}
            alt={`${movie.name} Poster`}
            width={500}
            height={750}
            className="rounded-lg shadow-2xl shadow-primary/20 object-cover"
            data-ai-hint={movie.posterAiHint}
            priority={isFirst}
          />
        </div>
        <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="w-full max-w-xs md:max-w-sm mb-6">
            <Image
              src={movie.logoUrl}
              alt={`${movie.name} Logo`}
              width={400}
              height={200}
              className="object-contain"
              data-ai-hint={movie.logoAiHint}
            />
          </div>
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
            {movie.description}
          </p>
        </div>
      </div>
    </div>
  );
}

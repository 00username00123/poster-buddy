export interface Movie {
  id: number;
  name: string;
  posterUrl: string;
  logoUrl: string;
  description: string;
  posterAiHint: string;
  logoAiHint: string;
}

export const movies: Movie[] = [
  {
    id: 1,
    name: "Cosmic Odyssey",
    posterUrl: "https://placehold.co/500x750.png",
    logoUrl: "https://placehold.co/400x200.png",
    description: "In the vast expanse of the cosmos, a lone explorer journeys through nebulae and past dying stars, seeking the origin of a mysterious signal that promises to unlock the secrets of the universe.",
    posterAiHint: "sci-fi poster",
    logoAiHint: "space logo",
  },
  {
    id: 2,
    name: "Cybernetic City",
    posterUrl: "https://placehold.co/500x750.png",
    logoUrl: "https://placehold.co/400x200.png",
    description: "In a neon-drenched metropolis of the future, a hard-boiled detective with a cybernetic heart untangles a conspiracy that reaches the highest echelons of a city that never sleeps.",
    posterAiHint: "cyberpunk poster",
    logoAiHint: "tech logo",
  },
  {
    id: 3,
    name: "The Last Dragon",
    posterUrl: "https://placehold.co/500x750.png",
    logoUrl: "https://placehold.co/400x200.png",
    description: "In a realm of magic and myth, a young warrior is destined to find the last dragon's egg. She must protect it from dark forces who seek to extinguish the last spark of draconic power.",
    posterAiHint: "fantasy poster",
    logoAiHint: "fantasy logo",
  },
  {
    id: 4,
    name: "Noir Enigma",
    posterUrl: "https://placehold.co/500x750.png",
    logoUrl: "https://placehold.co/400x200.png",
    description: "On the rain-slicked streets of a 1940s city, a private eye is drawn into a web of deceit, betrayal, and murder when a mysterious femme fatale walks into his office.",
    posterAiHint: "noir poster",
    logoAiHint: "detective logo",
  },
];

export const CYCLE_INTERVAL = 7000;

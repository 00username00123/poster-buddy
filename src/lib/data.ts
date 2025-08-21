export interface Movie {
  id: number;
  name: string;
  posterUrl: string;
  description: string;
  commanderBlurb: string;
  visualsBlurb: string;
  starring: string;
  director: string;
  runtime: string;
  genre: string;
  rating: string;
  posterAiHint: string;
}

export const initialMovies: Movie[] = [
  {
    id: 1,
    name: "The Last Guardian",
    posterUrl: "https://placehold.co/600x900.png",
    description: "In a dystopian future where humanity teeters on the brink of extinction, one warrior stands as the final hope against an alien invasion that has consumed the galaxy.",
    commanderBlurb: "Commander Zara Chen, a battle-hardened soldier enhanced with experimental technology, must navigate treacherous alien landscapes and face impossible odds to protect the last human colony.",
    visualsBlurb: "With breathtaking action sequences and stunning visual effects, 'The Last Guardian' explores themes of sacrifice, redemption, and the unbreakable human spirit in the face of overwhelming darkness.",
    starring: "Maya Rodriguez, James Chen, Alexandra Park",
    director: "Marcus Thompson",
    runtime: "127 minutes",
    genre: "Sci-Fi Action Thriller",
    rating: "PG-13",
    posterAiHint: "sci-fi warrior poster",
  },
  {
    id: 2,
    name: "Cybernetic City",
    posterUrl: "https://placehold.co/600x900.png",
    description: "In a neon-drenched metropolis of the future, a hard-boiled detective with a cybernetic heart untangles a conspiracy that reaches the highest echelons of a city that never sleeps.",
    commanderBlurb: "Enhanced detective Jax must navigate the neon-soaked underbelly of the city, where every byte of data can be a clue or a trap.",
    visualsBlurb: "Experience a visually stunning cyberpunk world, where advanced technology and urban decay create a captivating and dangerous atmosphere.",
    starring: "Keanu Reeves, Scarlett Johansson",
    director: "Denis Villeneuve",
    runtime: "148 minutes",
    genre: "Cyberpunk Noir",
    rating: "R",
    posterAiHint: "cyberpunk poster",
  },
  {
    id: 3,
    name: "The Last Dragon",
    posterUrl: "https://placehold.co/600x900.png",
    description: "In a realm of magic and myth, a young warrior is destined to find the last dragon's egg. She must protect it from dark forces who seek to extinguish the last spark of draconic power.",
    commanderBlurb: "Elara, a skilled archer from a secluded village, discovers her connection to an ancient dragon lineage and must embrace her destiny.",
    visualsBlurb: "Journey through breathtaking landscapes, from enchanted forests to towering mountains, in a world brought to life with stunning CGI.",
    starring: "Zendaya, Tom Holland",
    director: "Peter Jackson",
    runtime: "165 minutes",
    genre: "Fantasy Adventure",
    rating: "PG-13",
    posterAiHint: "fantasy poster",
  },
];

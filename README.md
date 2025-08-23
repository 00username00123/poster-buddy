# Firebase Studio

This is a Next.js starter project within Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Data Storage

Movie data is currently stored in the state of the `Home` component located in `/src/app/page.tsx`. This data is not persistent and will be reset when the application is reloaded.

Each movie object stored in the state includes the following properties:

- `id`: A unique identifier for the movie (generated when added).
- `name`: The title of the movie.
- `posterUrl`: The data URL for the movie's poster image.
- `logoUrl`: The data URL for the movie's logo image.
- `description`: A brief description of the movie.
- `starring`: The main actors in the movie.
- `director`: The director of the movie.
- `runtime`: The runtime of the movie.
- `genre`: The genre of the movie.
- `rating`: The rating of the movie.
- `posterAiHint`: A hint that can be used for AI image generation if needed.

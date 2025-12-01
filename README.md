# Pokémon Explorer

A small React app that lets you browse, search, and explore Pokémon.
You can look up Pokémon by name, filter them by type, and open a detail page to see abilities, stats, and a larger image.

## Live Demo

https://pokemon-explorer-exec.vercel.app

## Features

- Search Pokémon by name
- Filter by type
- Pagination for smoother browsing
- Detail page with stats, abilities, and a larger sprite
- Uses data from the PokéAPI

## Tech Used

- React 19
- TypeScript
- React Router
- TailwindCSS
- Vite

## Project Structure

```
pokemon-explorer/
├── app/
│   ├── components/
│   │   ├── filters/
│   │   │   ├── PokemonFilters.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── TypeFilter.tsx
│   │   ├── pokemon/
│   │   │   ├── PokemonHeader.tsx
│   │   │   ├── PokemonList.tsx
│   │   │   └── PokemonTable.tsx
│   │   └── ui/
│   │       ├── ErrorMessage.tsx
│   │       └── LoadingSpinner.tsx
│   ├── contexts/
│   │   ├── FilterContext.tsx
│   │   └── PokemonDataContext.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── pokemon.ts
│   │   └── types/
│   │       └── pokemon.ts
│   ├── routes/
│   │   ├── home.tsx
│   │   └── pokemon-detail.tsx
│   ├── root.tsx
│   └── routes.ts
├── public/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Run the Project

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Then open:
http://localhost:5173

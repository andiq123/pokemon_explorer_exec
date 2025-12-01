import { useState, useEffect } from "react";
import {
  fetchPokemonList,
  fetchPokemon,
  extractPokemonIdFromUrl,
} from "../lib/api/pokemon";
import type { Pokemon } from "../lib/types/pokemon";
import { PokemonTable } from "./PokemonTable";

export function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPokemon() {
      try {
        setLoading(true);
        const listResponse = await fetchPokemonList(20, 0);
        
        const pokemonIds = listResponse.results
          .map((item) => extractPokemonIdFromUrl(item.url))
          .filter((id): id is number => id !== null);

        const pokemonData = await Promise.all(
          pokemonIds.map((id) => fetchPokemon(id))
        );

        setPokemon(pokemonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load Pokémon");
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pokémon Explorer</h1>
          <p className="text-gray-600">Discover and explore Pokémon data</p>
        </div>
        <PokemonTable data={pokemon} />
      </div>
    </div>
  );
}


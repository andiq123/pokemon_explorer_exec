import { useState, useEffect } from "react";
import {
  fetchPokemonList,
  extractPokemonIdFromUrl,
  fetchPokemon,
  fetchPokemonTypes,
  fetchPokemonByType,
} from "../lib/api/pokemon";
import type { Pokemon } from "../lib/types/pokemon";
import { PokemonTable } from "./PokemonTable";
import { PokemonHeader } from "./PokemonHeader";
import { PokemonFilters } from "./PokemonFilters";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";

const PAGE_SIZE = 20;

export function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [types, setTypes] = useState<Array<{ name: string; url: string }>>([]);

  useEffect(() => {
    async function loadTypes() {
      try {
        const typesData = await fetchPokemonTypes();
        setTypes(typesData);
      } catch (err) {
        console.error("Failed to load types:", err);
      }
    }
    loadTypes();
  }, []);

  useEffect(() => {
    async function loadPokemon() {
      try {
        setLoading(true);
        setError(null);

        if (selectedType) {
          const typePokemon = await fetchPokemonByType(selectedType);
          const pokemonIds = typePokemon
            .map((item) => extractPokemonIdFromUrl(item.url))
            .filter((id): id is number => id !== null)
            .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

          const pokemonData = await Promise.all(
            pokemonIds.map((id) => fetchPokemon(id))
          );

          setPokemon(pokemonData);
          setTotalCount(typePokemon.length);
          return;
        }

        const offset = page * PAGE_SIZE;
        const listResponse = await fetchPokemonList(PAGE_SIZE, offset);
        
        setTotalCount(listResponse.count);
        
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
  }, [page, selectedType]);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setPage(0);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <PokemonHeader />
        <PokemonFilters
          selectedType={selectedType}
          types={types}
          onTypeChange={handleTypeChange}
        />
        <PokemonTable
          data={pokemon}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          loading={loading}
        />
      </div>
    </div>
  );
}


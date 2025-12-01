import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import {
  fetchPokemonList,
  extractPokemonIdFromUrl,
  fetchPokemon,
  fetchPokemonByType,
} from "../lib/api/pokemon";
import type { Pokemon } from "../lib/types/pokemon";
import { useFilter } from "./FilterContext";

const PAGE_SIZE = 20;

interface PokemonDataContextType {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const PokemonDataContext = createContext<PokemonDataContextType | undefined>(
  undefined,
);

export function PokemonDataProvider({ children }: { children: ReactNode }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchedPokemon, setSearchedPokemon] = useState<Pokemon | null>(null);
  const { searchQuery, selectedType } = useFilter();

  useEffect(() => {
    async function searchPokemon() {
      if (!searchQuery.trim()) {
        setSearchedPokemon(null);
        return;
      }

      try {
        const found = await fetchPokemon(searchQuery.trim().toLowerCase());
        setSearchedPokemon(found);
      } catch (err) {
        setSearchedPokemon(null);
      }
    }

    searchPokemon();
  }, [searchQuery]);

  useEffect(() => {
    async function loadPokemon() {
      if (searchQuery.trim()) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let pokemonItems: { url: string }[] = [];
        let total: number;

        if (selectedType) {
          const typePokemon = await fetchPokemonByType(selectedType);
          pokemonItems = typePokemon;
          total = typePokemon.length;
        } else {
          const offset = page * PAGE_SIZE;
          const listResponse = await fetchPokemonList(PAGE_SIZE, offset);
          pokemonItems = listResponse.results;
          total = listResponse.count;
        }

        const start = selectedType ? page * PAGE_SIZE : 0;
        const end = selectedType ? (page + 1) * PAGE_SIZE : pokemonItems.length;
        const pokemonIds = pokemonItems
          .map((item) => extractPokemonIdFromUrl(item.url))
          .filter((id): id is number => id !== null)
          .slice(start, end);

        const pokemonData = await Promise.all(
          pokemonIds.map((id) => fetchPokemon(id)),
        );

        setPokemon(pokemonData);
        setTotalCount(total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load Pokémon");
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();
  }, [page, selectedType, searchQuery]);

  const filteredPokemon = useMemo(() => {
    if (searchQuery.trim() && searchedPokemon) {
      const matchesType =
        !selectedType ||
        searchedPokemon.types.some((t) => t.type.name === selectedType);
      return matchesType ? [searchedPokemon] : [];
    }

    if (selectedType) {
      return pokemon.filter((p) =>
        p.types.some((t) => t.type.name === selectedType),
      );
    }

    return pokemon;
  }, [pokemon, searchQuery, searchedPokemon, selectedType]);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedType]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <PokemonDataContext.Provider
      value={{
        pokemon: filteredPokemon,
        loading,
        error,
        page,
        totalPages,
        setPage,
      }}
    >
      {children}
    </PokemonDataContext.Provider>
  );
}

export function usePokemonData() {
  const context = useContext(PokemonDataContext);
  if (context === undefined) {
    throw new Error("usePokemonData must be used within a PokemonDataProvider");
  }
  return context;
}

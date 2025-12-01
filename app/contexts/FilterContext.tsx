import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { fetchPokemon, fetchPokemonTypes } from "../lib/api/pokemon";
import type { Pokemon } from "../lib/types/pokemon";

interface FilterContextType {
  searchQuery: string;
  selectedType: string;
  types: Array<{ name: string; url: string }>;
  searchedPokemon: Pokemon | null;
  filteredPokemon: Pokemon[];
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({
  children,
  pokemon,
}: {
  children: ReactNode;
  pokemon: Pokemon[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [types, setTypes] = useState<Array<{ name: string; url: string }>>([]);
  const [searchedPokemon, setSearchedPokemon] = useState<Pokemon | null>(null);

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
    async function searchPokemonByName() {
      if (!searchQuery.trim()) {
        setSearchedPokemon(null);
        return;
      }

      try {
        const foundPokemon = await fetchPokemon(searchQuery.trim().toLowerCase());
        setSearchedPokemon(foundPokemon);
      } catch (err) {
        setSearchedPokemon(null);
      }
    }

    searchPokemonByName();
  }, [searchQuery]);

  const filteredPokemon = useMemo(() => {
    if (searchedPokemon && searchQuery.trim()) {
      const matchesType =
        selectedType === "" ||
        searchedPokemon.types.some((t) => t.type.name === selectedType);
      return matchesType ? [searchedPokemon] : [];
    }

    return pokemon.filter((p) => {
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType === "" ||
        p.types.some((t) => t.type.name === selectedType);
      return matchesSearch && matchesType;
    });
  }, [pokemon, searchQuery, selectedType, searchedPokemon]);

  return (
    <FilterContext.Provider
      value={{
        searchQuery,
        selectedType,
        types,
        searchedPokemon,
        filteredPokemon,
        setSearchQuery,
        setSelectedType,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}


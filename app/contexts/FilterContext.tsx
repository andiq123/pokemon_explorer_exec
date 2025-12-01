import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { fetchPokemonTypes } from "../lib/api/pokemon";
import type { PokemonType } from "../lib/types/pokemon";

interface FilterContextType {
  searchQuery: string;
  selectedType: string;
  types: PokemonType[];
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [types, setTypes] = useState<PokemonType[]>([]);

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

  return (
    <FilterContext.Provider
      value={{
        searchQuery,
        selectedType,
        types,
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


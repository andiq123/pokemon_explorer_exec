import { PokemonTable } from "./PokemonTable";
import { PokemonHeader } from "./PokemonHeader";
import { PokemonFilters } from "../filters/PokemonFilters";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorMessage } from "../ui/ErrorMessage";
import { FilterProvider } from "../../contexts/FilterContext";
import { PokemonDataProvider, usePokemonData } from "../../contexts/PokemonDataContext";

function PokemonListContent() {
  const { pokemon, loading, error, page, totalPages, setPage } = usePokemonData();

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
        <PokemonFilters />
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

export function PokemonList() {
  return (
    <FilterProvider>
      <PokemonDataProvider>
        <PokemonListContent />
      </PokemonDataProvider>
    </FilterProvider>
  );
}

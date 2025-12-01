import { SearchBar } from "./SearchBar";
import { TypeFilter } from "./TypeFilter";
import { useFilter } from "../../contexts/FilterContext";

export function PokemonFilters() {
  const { searchQuery, selectedType, types, setSearchQuery, setSelectedType } =
    useFilter();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  return (
    <div className="mb-6 flex gap-4">
      <SearchBar value={searchQuery} onChange={handleSearchChange} />
      <TypeFilter
        value={selectedType}
        onChange={handleTypeChange}
        types={types}
      />
    </div>
  );
}

import { TypeFilter } from "./TypeFilter";

interface PokemonFiltersProps {
  selectedType: string;
  types: Array<{ name: string; url: string }>;
  onTypeChange: (value: string) => void;
}

export function PokemonFilters({
  selectedType,
  types,
  onTypeChange,
}: PokemonFiltersProps) {
  return (
    <div className="mb-6 flex gap-4">
      <TypeFilter value={selectedType} onChange={onTypeChange} types={types} />
    </div>
  );
}


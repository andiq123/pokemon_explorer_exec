import type { PokemonType } from "../../lib/types/pokemon";

interface TypeFilterProps {
  value: string;
  onChange: (value: string) => void;
  types: PokemonType[];
}

export function TypeFilter({ value, onChange, types }: TypeFilterProps) {
  return (
    <div className="w-48">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}


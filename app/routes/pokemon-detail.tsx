import { useEffect, useState } from "react";
import type { Route } from "./+types/pokemon-detail";
import { fetchPokemon } from "../lib/api/pokemon";
import type { Pokemon } from "../lib/types/pokemon";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Link } from "react-router";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Pokémon ${params.id}` },
    { name: "description", content: `Detailed view of Pokémon ${params.id}` },
  ];
}

export default function PokemonDetail({ params }: Route.ComponentProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setLoading(true);
        const data = await fetchPokemon(params.id);
        setPokemon(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load Pokémon details",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!pokemon) {
    return <ErrorMessage message="Pokémon not found" />;
  }

  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-6 px-4 py-2 bg-white text-blue-600 font-medium rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          ← Back to List
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={pokemon.name}
                  className="w-64 h-64 object-contain"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              <h1 className="text-4xl font-bold capitalize mt-6 text-gray-900">
                {pokemon.name}
              </h1>
              <p className="text-gray-600 mt-2">#{pokemon.id}</p>
            </div>

            <div className="space-y-6">
              {/* Types */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Type(s)
                </h2>
                <div className="flex flex-wrap gap-2">
                  {pokemon.types.map((t) => (
                    <span
                      key={t.slot}
                      className="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Physical Stats
                </h2>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Height:</span>{" "}
                    {(pokemon.height / 10).toFixed(1)} m
                  </p>
                  <p>
                    <span className="font-medium">Weight:</span>{" "}
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </p>
                  <p>
                    <span className="font-medium">Base Experience:</span>{" "}
                    {pokemon.base_experience}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Abilities
                </h2>
                <div className="space-y-2">
                  {pokemon.abilities.map((ability) => (
                    <div
                      key={ability.ability.name}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="capitalize font-medium text-gray-900">
                        {ability.ability.name}
                      </span>
                      {ability.is_hidden && (
                        <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Base Stats
            </h2>
            <div className="space-y-4">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name}>
                  <div className="flex justify-between mb-1">
                    <span className="capitalize font-medium text-gray-700">
                      {stat.stat.name}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {stat.base_stat}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full"
                      style={{
                        width: `${Math.min((stat.base_stat / 150) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

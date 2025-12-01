import { pokeApiClient } from "./client";
import type { Pokemon, PokemonListResponse, PokemonType } from "../types/pokemon";

export async function fetchPokemonList(limit = 20, offset = 0) {
  const response = await pokeApiClient.get<PokemonListResponse>("/pokemon", {
    params: { limit, offset },
  });
  return response.data;
}

export async function fetchPokemon(id: number | string) {
  const response = await pokeApiClient.get<Pokemon>(`/pokemon/${id}`);
  return response.data;
}

export function extractPokemonIdFromUrl(url: string): number | null {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : null;
}

export async function fetchPokemonTypes(): Promise<PokemonType[]> {
  const response = await pokeApiClient.get<{
    count: number;
    results: PokemonType[];
  }>("/type");
  return response.data.results.filter((type) => type.name !== "unknown" && type.name !== "shadow");
}

export async function fetchPokemonByType(type: string) {
  const response = await pokeApiClient.get<{
    pokemon: Array<{ pokemon: { name: string; url: string } }>;
  }>(`/type/${type}`);
  return response.data.pokemon.map((p) => p.pokemon);
}


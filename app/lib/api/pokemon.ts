import { pokeApiClient } from "./client";
import type { Pokemon, PokemonListResponse } from "../types/pokemon";

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


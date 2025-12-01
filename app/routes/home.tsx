import type { Route } from "./+types/home";
import { PokemonList } from "../components/pokemon/PokemonList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pokémon Explorer" },
    { name: "description", content: "Explore Pokémon data" },
  ];
}

export default function Home() {
  return <PokemonList />;
}

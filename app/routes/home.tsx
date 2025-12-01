import type { Route } from "./+types/home";
import { PokemonList } from "../components/PokemonList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pokémon Explorer" },
    { name: "description", content: "Explore Pokémon data" },
  ];
}

export default function Home() {
  return <PokemonList />;
}

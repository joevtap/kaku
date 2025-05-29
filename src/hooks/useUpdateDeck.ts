import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { DeckManifest } from "@/src/types/Manifest";

const handler = new DecksFileSystemHandler();

export function useUpdateDeck() {
  const updateDeck = async ({
    slug,
    name,
    description,
  }: {
    slug: string;
    name: string;
    description: string;
  }) => {
    await handler.updateDeck(slug, { name, description });
    console.log("[UPDATE DEBUG] Deck atualizado com sucesso.");
  };

  return { updateDeck };
}

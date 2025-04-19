import { create } from "zustand";
import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { DeckManifest, Manifest } from "../types/Manifest";
import { StaticDeck } from "../types/Deck";

interface DecksState {
  decks: DeckManifest[];
  fetchDecks: () => Promise<void>;
  getDeck: (slug: string) => Promise<StaticDeck | null>;
}

export const useDecksStore = create<DecksState>((set, get) => {
  const decksFileSystemHandler = new DecksFileSystemHandler();

  return {
    decks: [],
    fetchDecks: async () => {
      const data = await decksFileSystemHandler.getManifest();

      set({ decks: data.decks });
    },
    getDeck: async (slug: string) => {
      const deck = await decksFileSystemHandler.read(slug);

      return deck;
    },
  };
});

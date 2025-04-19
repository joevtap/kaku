import { create } from "zustand";
import { StaticDeck } from "../types/Deck";
import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";

interface DecksState {
  decks: StaticDeck[];
  fetchAllDecks: () => Promise<void>;
  getDeck: (slug: string) => StaticDeck | null;
}

export const useDecksStore = create<DecksState>((set, get) => ({
  decks: [],
  fetchAllDecks: async () => {
    const decksFileSystemHandler = new DecksFileSystemHandler();
    const data = await decksFileSystemHandler.getAllDecks();

    set({ decks: data });
  },
  getDeck: (slug: string) => {
    const result = get().decks.filter((deck) => deck.slug === slug);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  },
}));

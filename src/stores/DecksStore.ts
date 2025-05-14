import { create } from "zustand";
import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { DeckManifest } from "../types/Manifest";
import { StaticDeck } from "../types/Deck";

interface DecksState {
  decks: DeckManifest[];
  createDeck: (deck: StaticDeck) => Promise<void>;
}

export const useDecksStore = create<DecksState>((set, get) => {
  const decksFileSystemHandler = new DecksFileSystemHandler();

  return {
    decks: [],

    createDeck: async (deck: StaticDeck) => {
      await decksFileSystemHandler.write(deck);
      const data = await decksFileSystemHandler.getManifest();
      set({ decks: data.decks });
    },
  };
});

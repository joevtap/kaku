import { create } from "zustand";
import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { DeckManifest, Manifest } from "../types/Manifest";
import { FlashCard, StaticDeck } from "../types/Deck";

interface DecksState {
  decks: DeckManifest[];
  createDeck: (deck: StaticDeck) => Promise<void>;
  addCard: (deckSlug: string, card: Omit<FlashCard, "id">) => Promise<void>;
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
    addCard: async (deckSlug: string, card: Omit<FlashCard, "id">) => {
      await decksFileSystemHandler.addCard(deckSlug, card);
    },
  };
});

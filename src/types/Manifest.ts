import { StaticDeck } from "./Deck";

export type DeckManifest = Omit<StaticDeck, "cards" | "version"> & {
  cardAmount: number;
};

export interface Manifest {
  decks: DeckManifest[];
}

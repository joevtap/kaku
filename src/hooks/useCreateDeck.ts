import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { StaticDeck } from "../types/Deck";
import uuid from "react-native-uuid";

export function useCreateDeck() {
  const decksFileSystemHandler = new DecksFileSystemHandler();

  const createDeck = async (partialDeck: Partial<StaticDeck>) => {
    try {
      const deck: StaticDeck = {
        slug: `${uuid.v4()}_${partialDeck.name?.split(" ").join("_")}`,
        name: partialDeck.name ?? "",
        description: partialDeck.description ?? "",
        version: "1.0.0",
        cards: [],
      };

      await decksFileSystemHandler.write(deck);
    } catch (error) {
      console.error("Error creating deck:", error);
      throw error;
    }
  };

  return { createDeck };
}

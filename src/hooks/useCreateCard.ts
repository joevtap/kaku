import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { FlashCard } from "../types/Deck";

export function useCreateCard() {
  const decksFileSystemHandler = new DecksFileSystemHandler();

  const createCard = async (slug: string, card: Omit<FlashCard, "id">) => {
    try {
      await decksFileSystemHandler.addCard(slug, card);
    } catch (error) {
      console.error("Error creating card:", error);
      throw error;
    }
  };

  return { createCard };
}

import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { FlashCard } from "../types/Deck";

export function useUpdateCard() {
  const handler = new DecksFileSystemHandler();

  const updateCard = async (slug: string, updatedCard: FlashCard) => {
    try {
      await handler.updateCard(slug, updatedCard);
    } catch (error) {
      console.error("Error updating card:", error);
      throw error;
    }
  };

  return { updateCard };
}

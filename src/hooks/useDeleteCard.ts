import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { FlashCardId } from "../types/Deck";

export function useDeleteCard() {
  const decksFileSystemHandler = new DecksFileSystemHandler();

  const deleteCard = async (slug: string, id: FlashCardId) => {
    try {
      await decksFileSystemHandler.deleteCard(slug, id);
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  };

  return { deleteCard };
}

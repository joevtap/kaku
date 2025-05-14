import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";

export function useDeleteDeck() {
  const decksFileSystemHandler = new DecksFileSystemHandler();

  const deleteDeck = async (slug: string) => {
    try {
      await decksFileSystemHandler.deleteDeck(slug);
    } catch (error) {
      console.error("Error deleting deck:", error);
      throw error;
    }
  };

  return { deleteDeck };
}

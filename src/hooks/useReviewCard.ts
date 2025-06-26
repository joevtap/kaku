import { useState } from "react";
import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { FlashCardId } from "../types/Deck";

export function useReviewCard() {
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handler = new DecksFileSystemHandler();

  const reviewCard = async (
    slug: string,
    cardId: FlashCardId,
    grade: number,
  ) => {
    setIsReviewing(true);
    setError(null);
    try {
      await handler.reviewCard(slug, cardId, grade);
    } catch (e) {
      setError(e as Error);
      console.error("Erro ao revisar o card:", e);
    } finally {
      setIsReviewing(false);
    }
  };

  return { reviewCard, isReviewing, error };
}

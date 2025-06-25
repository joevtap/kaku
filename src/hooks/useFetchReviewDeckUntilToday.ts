import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { ReviewedDeck } from "../types/Deck";

export function useFetchReviewDeckUntilToday(slug: string) {
  const [deck, setDeck] = useState<ReviewedDeck>();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const decksFileSystemHandler = new DecksFileSystemHandler();

  const fetchData = async () => {
    try {
      const data =
        await decksFileSystemHandler.readReviewedDeckUntilToday(slug);

      if (!data) {
        throw new Error("Review deck not found");
      }

      setDeck(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching decks:", error);
      setError(error as Error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  return [deck, error, loading, fetchData] as const;
}

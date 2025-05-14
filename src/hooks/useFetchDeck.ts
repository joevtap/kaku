import { useCallback, useState } from "react";
import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { StaticDeck } from "../types/Deck";
import { useFocusEffect } from "expo-router";

export function useFetchDeck(slug: string) {
  const [deck, setDeck] = useState<StaticDeck>();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const decksFileSystemHandler = new DecksFileSystemHandler();

  const fetchData = async () => {
    try {
      const data = await decksFileSystemHandler.read(slug);

      if (!data) {
        throw new Error("Deck not found");
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

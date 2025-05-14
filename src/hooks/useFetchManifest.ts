import { useCallback, useState } from "react";
import { Manifest } from "../types/Manifest";
import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { useFocusEffect } from "expo-router";

export function useFetchManifest() {
  const [manifest, setManifest] = useState<Manifest>();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const decksFileSystemHandler = new DecksFileSystemHandler();

  const fetchData = async () => {
    try {
      const data = await decksFileSystemHandler.getManifest();
      setManifest(data);
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

  return [manifest, error, loading, fetchData] as const;
}

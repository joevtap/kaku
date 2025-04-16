import { Stack } from "expo-router/stack";
import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { useEffect } from "react";

export default function Layout() {
  useEffect(() => {
    const decksFileSystemHandler = new DecksFileSystemHandler();

    decksFileSystemHandler.bootstrap().then(() => {
      console.log("[Bootstrap] [DecksFileSystemHandler] bootstrap completed");
    });
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

import { Stack } from "expo-router/stack";
import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  useEffect(() => {
    const decksFileSystemHandler = new DecksFileSystemHandler();

    decksFileSystemHandler.bootstrap().then(() => {
      console.log("[Bootstrap] [DecksFileSystemHandler] bootstrap completed");
    });
  }, []);

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
}

import { DeckForm } from "@/src/components/Deck/DeckForm";
import { useCreateDeck } from "@/src/hooks/useCreateDeck";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function CreateDeckPage() {
  const router = useRouter();
  const { createDeck } = useCreateDeck();

  const handleCreate = async ({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) => {
    await createDeck({ name, description });
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Criar Deck" }} />
      <DeckForm onSubmit={handleCreate} submitLabel="Criar" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});

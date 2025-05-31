import { useCreateCard } from "@/src/hooks/useCreateCard";
import { FlashCardBack, FlashCardFront } from "@/src/types/Deck";
import { CardForm } from "@components/Card/CardForm";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default function CreateCardPage() {
  const router = useRouter();
  const { deck } = useLocalSearchParams();

  const { createCard } = useCreateCard();

  const handleCreate = async (front: FlashCardFront, back: FlashCardBack) => {
    await createCard(deck as string, {
      front: [front],
      back: [back],
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Criar Card" }} />
      <CardForm onSubmit={handleCreate} submitLabel="Criar" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

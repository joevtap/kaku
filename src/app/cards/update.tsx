import { useUpdateCard } from "@/src/hooks/useUpdateCard";
import { FlashCardBack, FlashCardFront } from "@/src/types/Deck";
import { CardForm } from "@components/Card/CardForm";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function UpdateCardPage() {
  const router = useRouter();
  const { deck, card } = useLocalSearchParams();
  const { updateCard } = useUpdateCard();
  const [parsedCard, setParsedCard] = useState<{
    id: string;
    front: FlashCardFront[];
    back: FlashCardBack[];
  } | null>(null);

  useEffect(() => {
    if (card && typeof card === "string") {
      try {
        const parsed = JSON.parse(card);
        setParsedCard({
          id: parsed.id,
          front: parsed.front,
          back: parsed.back,
        });
      } catch (error) {
        setParsedCard(null);
      }
    }
  }, [card]);

  const handleUpdate = async (front: FlashCardFront, back: FlashCardBack) => {
    const updatedCard = {
      id: parsedCard?.id as string,
      front: [front],
      back: [back],
    };
    await updateCard(deck as string, updatedCard);

    router.back();
  };

  return (
    <>
      {!parsedCard && (
        <Stack.Screen options={{ title: "Carregando informações..." }} />
      )}
      <ScrollView style={styles.container}>
        <Stack.Screen options={{ title: "Atualizar Card" }} />
        <CardForm
          initialFront={parsedCard?.front[0] || undefined}
          initialBack={parsedCard?.back[0] || undefined}
          onSubmit={handleUpdate}
          submitLabel="Atualizar"
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

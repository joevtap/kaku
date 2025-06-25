import { colors } from "@/src/constants/colors";
import { fonts } from "@/src/constants/fonts";
import { useFetchDeck } from "@/src/hooks/useFetchDeck";
import { useFetchReviewDeckUntilToday } from "@/src/hooks/useFetchReviewDeckUntilToday";
import { useReviewCard } from "@/src/hooks/useReviewCard";
import { CardReview, FlashCard } from "@/src/types/Deck";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ReviewPage() {
  const { deck: slugParam } = useLocalSearchParams();
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam!;
  const [reviewDeck] = useFetchReviewDeckUntilToday(slug);
  const [deck] = useFetchDeck(slug);

  const { reviewCard, isReviewing } = useReviewCard();

  const [cards, setCards] = useState<FlashCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (deck && reviewDeck) {
        if (reviewDeck.reviews.length === 0) {
          router.back();
          return;
        }
        const reviewCards = reviewDeck.reviews.map((review: CardReview) =>
          deck.cards.find((c) => c.id === review.id),
        );
        const filteredReviewCards = reviewCards.filter(
          (card): card is FlashCard => card !== undefined,
        );
        setCards(filteredReviewCards);
      }
    }, [deck, reviewDeck]),
  );

  const handleGradeCard = async (grade: number) => {
    if (isReviewing || !cards[cardIndex]) return;

    const currentCardId = cards[cardIndex].id;
    await reviewCard(slug, currentCardId, grade);

    if (cardIndex < cards.length - 1) {
      setCardIndex(cardIndex + 1);
      setShowAnswer(false);
    } else {
      router.back();
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  if (cards.length === 0) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  const currentCard = cards[cardIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{deck?.name}</Text>
        <Text style={styles.counter}>
          {cardIndex + 1} / {cards.length}
        </Text>
      </View>
      <Separator />

      {/* Conteúdo do Card (Frente e Verso) */}
      <View style={styles.cardContent}>
        {/* Frente */}
        <View style={styles.cardTextBlock}>
          {currentCard.front.map((front, idx) => (
            <Text
              style={[getTextStyle(front.writingSystem, idx), styles.cardText]}
              key={idx}
            >
              {front.content}
            </Text>
          ))}
        </View>

        <Separator />

        {/* Verso */}
        {showAnswer && (
          <View style={styles.cardTextBlock}>
            {currentCard.back.map((back, idx) => (
              <Text
                style={[getTextStyle(back.writingSystem, idx), styles.cardText]}
                key={idx}
              >
                {back.content}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        {!showAnswer ? (
          <Pressable style={styles.mainActionButton} onPress={handleShowAnswer}>
            <Text style={styles.mainActionButtonText}>Mostrar Resposta</Text>
          </Pressable>
        ) : (
          <View style={styles.ratingButtonsContainer}>
            <Pressable
              style={[styles.ratingButton, styles.ratingAgain]}
              onPress={() => handleGradeCard(1)}
              disabled={isReviewing}
            >
              <Text style={styles.ratingButtonText}>Errei</Text>
            </Pressable>
            <Pressable
              style={[styles.ratingButton, styles.ratingHard]}
              onPress={() => handleGradeCard(2)}
              disabled={isReviewing}
            >
              <Text style={styles.ratingButtonText}>Difícil</Text>
            </Pressable>
            <Pressable
              style={[styles.ratingButton, styles.ratingGood]}
              onPress={() => handleGradeCard(3)}
              disabled={isReviewing}
            >
              <Text style={styles.ratingButtonText}>Bom</Text>
            </Pressable>
            <Pressable
              style={[styles.ratingButton, styles.ratingEasy]}
              onPress={() => handleGradeCard(4)}
              disabled={isReviewing}
            >
              <Text style={styles.ratingButtonText}>Fácil</Text>
            </Pressable>
          </View>
        )}
        {isReviewing && <ActivityIndicator style={{ marginTop: 8 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.bg,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    color: colors.fg,
    fontWeight: "600",
  },
  counter: {
    fontSize: 16,
    color: colors.fg,
  },
  cardContent: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    justifyContent: "center",
  },
  cardTextBlock: {
    gap: 8,
    alignItems: "center",
  },
  cardText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  actionsContainer: {
    paddingVertical: 16,
  },
  mainActionButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  mainActionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  ratingButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  ratingButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  ratingAgain: { backgroundColor: "#DC2626" }, // Vermelho
  ratingHard: { backgroundColor: "#F97316" }, // Laranja
  ratingGood: { backgroundColor: "#2563EB" }, // Azul
  ratingEasy: { backgroundColor: "#16A34A" }, // Verde
});

const getTextStyle = (font: keyof typeof fonts, index: number) => ({
  fontFamily: fonts[font],
  fontSize: 28 - index * 6,
  lineHeight: 34 - index * 6,
  color: colors.fg,
});

function Separator() {
  return <View style={styles.separator} />;
}
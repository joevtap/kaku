import { colors } from "@/src/constants/colors";
import { fonts } from "@/src/constants/fonts";
import { useFetchDeck } from "@/src/hooks/useFetchDeck";
import { useFetchReviewDeckUntilToday } from "@/src/hooks/useFetchReviewDeckUntilToday";
import { CardReview, FlashCard } from "@/src/types/Deck";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function ReviewPage() {
  const { deck: slugParam } = useLocalSearchParams();
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const [reviewDeck, reviewLoading, reviewError] =
    useFetchReviewDeckUntilToday(slug);
  const [deck, loading, error] = useFetchDeck(slug);

  const [screenTitle, setScreenTitle] = useState<string>();
  const [cards, setCards] = useState<FlashCard[]>();
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      if (deck && reviewDeck) {
        setScreenTitle(deck.name);
        if (reviewDeck.reviews.length === 0) {
          setCards(deck.cards);
        } else {
          const reviewCards = reviewDeck.reviews.map((review: CardReview) =>
            deck.cards.find((c) => c.id === review.id),
          );
          if (reviewCards.some((card) => !card)) {
            console.warn("Some review cards were not found in the deck.");
          }
          const filteredReviewCards = reviewCards.filter(
            (card): card is FlashCard => card !== undefined,
          );
          setCards(filteredReviewCards);
        }
      }
    }, [deck, reviewDeck]),
  );

  const renderCard = ({ item }: { item: FlashCard; index: number }) => {
    return (
      <View>
        <View style={styles.cardContent}>
          <View style={styles.cardTextBlock}>
            {item.front.map((front, idx) => {
              if (idx <= 1) {
                return (
                  <Text
                    style={[
                      getTextStyle(front.writingSystem, idx),
                      styles.cardText,
                    ]}
                    key={front.content}
                  >
                    {front.content}
                  </Text>
                );
              }
            })}
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.iconsContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite a resposta..."
              value={userAnswer}
              onChangeText={setUserAnswer}
            />
            {showAnswer && (
              <View style={styles.cardTextBlock}>
                {item.back.map((back, idx) => {
                  if (idx <= 1) {
                    return (
                      <Text
                        style={[
                          getTextStyle(back.writingSystem, idx),
                          styles.cardText,
                        ]}
                        key={back.content}
                      >
                        {back.content}
                      </Text>
                    );
                  }
                })}
              </View>
            )}
            <Text style={styles.actionText} onPress={handleShowAnswer}>
              {showAnswer ? "Ocultar Resposta" : "Mostrar Resposta"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const handleNextCard = () => {
    setCardIndex(cardIndex + 1);
    setShowAnswer(false);
    setUserAnswer("");
  };

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  if (cards && cards.length > 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{screenTitle}</Text>
          <Text style={styles.counter}>
            {cardIndex + 1} / {cards?.length}
          </Text>
        </View>
        <Separator />
        {renderCard({ item: cards[cardIndex], index: cardIndex })}
        <Separator />

        {cardIndex < cards.length - 1 ? (
          <View>
            <Text style={styles.actionText} onPress={handleNextCard}>
              Próximo
            </Text>
          </View>
        ) : (
          <View style={styles.nextButton}>
            <Text
              style={styles.nextButtonText}
              onPress={() => {
                router.back();
              }}
            >
              Revisão Concluída
            </Text>
          </View>
        )}
      </View>
    );
  }

  if (error || reviewError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {error
            ? `Error loading deck: ${error}`
            : `Error loading review deck: ${reviewError}`}
        </Text>
      </View>
    );
  }

  if (loading || reviewLoading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
    backgroundColor: colors.bg,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    flexDirection: "column",
    gap: 24,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardTextBlock: {
    gap: 4,
  },
  cardText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: colors.fg,
    fontSize: 16,
  },
  iconsContainer: {
    flexDirection: "column",
    gap: 16,
  },
  actionText: {
    fontSize: 16,
    color: "#1E90FF",
    textAlign: "center",
    marginTop: 8,
  },
  nextButton: {
    marginTop: 16,
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    padding: 16,
  },
  loadingText: {
    color: colors.fg,
    fontSize: 16,
    textAlign: "center",
    padding: 16,
  },
});

const getTextStyle = (font: keyof typeof fonts, index: number) => ({
  fontFamily: fonts[font],
  fontSize: 18 - index * 4,
  lineHeight: 24 - index * 4,
  color: colors.fg,
});

function Separator() {
  return <View style={styles.separator} />;
}

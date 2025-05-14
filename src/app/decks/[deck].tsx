import { colors } from "@/src/constants/colors";
import { fonts } from "@/src/constants/fonts";
import { FlashCard } from "@/src/types/Deck";
import { Link, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View, Pressable } from "react-native";
import { Plus } from "@icons";
import { useFetchDeck } from "@/src/hooks/useFetchDeck";

export default function DeckPage() {
  const { deck: deckSlug } = useLocalSearchParams();

  const [deck, loading, error] = useFetchDeck(deckSlug as string);

  const [screenTitle, setScreenTitle] = useState<string>();
  const [cards, setCards] = useState<FlashCard[]>();

  useFocusEffect(
    useCallback(() => {
      if (deck) {
        setScreenTitle(deck.name);
        setCards(deck.cards);
      }
    }, [deck]),
  );

  const renderCards = ({ item, index }: { item: FlashCard; index: number }) => {
    return (
      <View style={styles.cardsListItem}>
        <Text style={styles.cardsListItemId}>{index + 1}</Text>
        <View style={{ gap: 4 }}>
          {item.front.map((front, idx) => {
            if (idx <= 1) {
              return (
                <Text
                  style={getTextStyle(front.writingSystem, idx)}
                  key={front.content}
                >
                  {front.content}
                </Text>
              );
            }
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!error && deck && cards) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: screenTitle ?? "Deck",
          }}
        />
        <FlatList
          data={cards}
          renderItem={renderCards}
          style={styles.cardsList}
          ItemSeparatorComponent={Separator}
        />
        <Link
          href={{
            pathname: "/cards/create",
            params: { deck: deckSlug },
          }}
          asChild
        >
          <Pressable style={styles.fab}>
            <Plus size={24} color="#fff" />
          </Pressable>
        </Link>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16 },
  cardsListItemId: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    lineHeight: 16,
    color: colors.fg,
  },
  cardsList: {
    width: "100%",
    paddingHorizontal: 16,
  },
  cardsListItem: {
    gap: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    width: "100%",
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000", // ou colors.fg, por exemplo
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});

const getTextStyle = (font: keyof typeof fonts, index: number) => {
  return {
    fontFamily: fonts[font],
    fontSize: 18 - index * 4,
    lineHeight: 24 - index * 4,
    color: colors.fg,
  };
};

function Separator() {
  return <View style={styles.separator} />;
}

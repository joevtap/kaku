import { colors } from "@/src/constants/colors";
import { fonts } from "@/src/constants/fonts";
import { DecksFileSystemHandler } from "@/src/infra/filesystem/DecksFileSystemHandler";
import { FlashCard, StaticDeck } from "@/src/types/Deck";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function DeckPage() {
  const { deck: deckSlug } = useLocalSearchParams();

  const [deck, setDeck] = useState<StaticDeck>();
  const [cards, setCards] = useState(deck?.cards ?? []);

  useFocusEffect(() => {
    async function fetchLocalDeck() {
      const decksFileSystemHandler = new DecksFileSystemHandler();
      const data = await decksFileSystemHandler.read(deckSlug as string);

      if (data) {
        setDeck(data);
        setCards(data.cards);
      }
    }

    fetchLocalDeck();
  });

  const renderCards = ({ item, index }: { item: FlashCard; index: number }) => {
    return (
      <View style={styles.cardsListItem}>
        <Text style={styles.cardsListItemId}>{index + 1}</Text>
        <View style={{ gap: 4 }}>
          {item.front.map((front, index) => {
            if (index <= 1) {
              return (
                <Text
                  style={getTextStyle(front.writingSystem, index)}
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

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: deck?.name ?? "Deck",
        }}
      />
      <FlatList
        data={cards}
        renderItem={renderCards}
        style={styles.cardsList}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
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

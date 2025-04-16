import { fonts } from "@/src/constants/fonts";
import { DeckSchema } from "@/src/types/DeckSchema";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function Decks() {
  const [decks, setDecks] = useState<DeckSchema[]>([]);

  useEffect(() => {
    // TODO: This is provisory, decks will be persisted in user's device's file system
    async function fetchLocalDecks() {
      const data = require("@assets/decks/yojijukugo.json");

      setDecks([data]);
    }

    fetchLocalDecks();
  }, []);

  const renderDecks = ({ item }: { item: DeckSchema }) => {
    const cardCount = item.cards.length;
    return (
      <Link
        href={{
          pathname: "/decks/[id]",
          params: { id: item.id },
        }}
        key={item.id}
      >
        <View style={styles.decksListItem}>
          <Text style={styles.decksListItemTitle}>{item.name}</Text>
          <Text
            style={styles.decksListItemCardCount}
          >{`${cardCount} card${cardCount > 1 ? "s" : ""}`}</Text>
        </View>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        renderItem={renderDecks}
        style={styles.decksList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  decksList: {
    width: "100%",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  decksListItem: {
    gap: 4,
  },
  decksListItemTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "Lato-Regular",
  },
  decksListItemCardCount: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: "Lato-Regular",
  },
});

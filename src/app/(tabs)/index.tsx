import { useDecksStore } from "@/src/stores/DecksStore";
import { DeckManifest } from "@/src/types/Manifest";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Decks() {
  const { decks, fetchDecks } = useDecksStore();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchDecks();
      };

      fetchData();
    }, []),
  );

  const renderDecks = ({ item }: { item: DeckManifest }) => {
    return (
      <Link
        href={{
          pathname: "/decks/[deck]",
          params: { deck: item.slug },
        }}
        key={item.slug}
      >
        <View style={styles.decksListItem}>
          <Text style={styles.decksListItemTitle}>{item.name}</Text>
          <Text
            style={styles.decksListItemCardCount}
          >{`${item.cardAmount} card${item.cardAmount > 1 ? "s" : ""}`}</Text>
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
  container: { flex: 1, padding: 16, gap: 16 },
  decksList: {
    width: "100%",
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

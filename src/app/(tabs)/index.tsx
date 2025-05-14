import { useDecksStore } from "@/src/stores/DecksStore";
import { DeckManifest } from "@/src/types/Manifest";
import { Plus } from "@icons";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

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
      <Link href="/decks/create" asChild>
        <Pressable style={styles.fab}>
          <Plus size={24} color="#fff" />
        </Pressable>
      </Link>
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

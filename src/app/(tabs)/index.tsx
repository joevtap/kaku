import { useFetchManifest } from "@/src/hooks/useFetchManifest";
import { DeckManifest } from "@/src/types/Manifest";
import { Plus } from "@icons";
import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function Decks() {
  const [manifest, error, loading] = useFetchManifest();

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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!error && manifest) {
    return (
      <View style={styles.container}>
        <FlatList
          data={manifest.decks}
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
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});

import { useDeleteDeck } from "@/src/hooks/useDeleteDeck";
import { useFetchManifest } from "@/src/hooks/useFetchManifest";
import { DeckManifest } from "@/src/types/Manifest";
import { Plus, Trash } from "@icons";
import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/src/constants/colors";

export default function Decks() {
  const [manifest, error, loading, refetch] = useFetchManifest();
  const { deleteDeck } = useDeleteDeck();

  const handleDeleteDeck = async (deckSlug: string) => {
    await deleteDeck(deckSlug);
    await refetch();
  };

  const renderDecks = ({
    item,
    index,
  }: {
    item: DeckManifest;
    index: number;
  }) => {
    return (
      <Link
        href={{
          pathname: "/decks/[deck]",
          params: { deck: item.slug },
        }}
        key={item.slug}
      >
        <View style={styles.decksListItem}>
          <View style={styles.deckListItemLeft}>
            <Text style={styles.decksListItemId}>{index + 1}</Text>
            <View style={{ gap: 4 }}>
              <Text style={styles.decksListItemTitle}>{item.name}</Text>
              <Text
                style={styles.decksListItemCardCount}
              >{`${item.cardAmount} card${item.cardAmount > 1 ? "s" : ""}`}</Text>
            </View>
          </View>
          <Pressable
            onPress={(e) => {
              e.preventDefault();
              handleDeleteDeck(item.slug);
            }}
          >
            <Trash size={24} color="#000" />
          </Pressable>
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
          ItemSeparatorComponent={Separator}
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
  container: { flex: 1, gap: 16 },
  decksList: {
    width: "100%",
    paddingHorizontal: 16,
  },
  decksListItem: {
    gap: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  deckListItemLeft: {
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  decksListItemId: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    lineHeight: 16,
    color: colors.fg,
  },
  decksListItemTitle: {
    fontFamily: "Lato-Regular",
    fontSize: 18,
    lineHeight: 24,
    color: colors.fg,
  },
  decksListItemCardCount: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 18,
    color: colors.fg,
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
    backgroundColor: colors.fg,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});

function Separator() {
  return <View style={styles.separator} />;
}

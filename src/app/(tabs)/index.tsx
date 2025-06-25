import { colors } from "@/src/constants/colors";
import { useDeleteDeck } from "@/src/hooks/useDeleteDeck";
import { useFetchManifest } from "@/src/hooks/useFetchManifest";
import { DeckManifest } from "@/src/types/Manifest";
import { Cached, Pencil, Plus, Trash } from "@icons";
import { Link, Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function Decks() {
  const [manifest, error, loading, refetch] = useFetchManifest();
  const { deleteDeck } = useDeleteDeck();
  const router = useRouter();

  const [selectedDecks, setSelectedDecks] = useState<string[]>([]);
  const selectionMode = selectedDecks.length > 0;

  const toggleSelection = (slug: string) => {
    setSelectedDecks((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const cancelSelection = () => setSelectedDecks([]);

  const handleDeleteSelected = async () => {
    Alert.alert("Excluir", `Deseja excluir ${selectedDecks.length} deck(s)?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            for (const slug of selectedDecks) {
              await deleteDeck(slug);
            }

            await refetch();
            cancelSelection();

            Toast.show({
              type: "success",
              text1: "Decks excluídos com sucesso!",
              position: "bottom",
            });
          } catch (error) {
            console.error("Erro ao excluir decks:", error);
            Toast.show({
              type: "error",
              text1: "Erro ao excluir decks",
              text2: "Tente novamente mais tarde.",
              position: "bottom",
            });
          }
        },
      },
    ]);
  };

  const handleDeckPress = (slug: string) => {
    if (selectionMode) {
      toggleSelection(slug);
    } else {
      router.push({ pathname: "/decks/[deck]", params: { deck: slug } });
    }
  };

  const handleDeckLongPress = (slug: string) => {
    if (!selectionMode) {
      toggleSelection(slug);
    }
  };

  const handleDeckUpdatePress = (slug: string) => {
    router.push({ pathname: "decks/update", params: { deck: slug } });
  };

  const handleDeckReviewPress = (slug: string) => {
    router.push({ pathname: "decks/review", params: { deck: slug } });
  };

  const renderDecks = ({
    item,
    index,
  }: {
    item: DeckManifest;
    index: number;
  }) => {
    const isSelected = selectedDecks.includes(item.slug);

    return (
      <Pressable
        key={item.slug}
        onPress={() => handleDeckPress(item.slug)}
        onLongPress={() => handleDeckLongPress(item.slug)}
        style={[styles.decksListItem, isSelected && styles.selectedItem]}
      >
        <View style={styles.deckListItemLeft}>
          <Text style={styles.decksListItemId}>{index + 1}</Text>
          <View style={{ gap: 4 }}>
            <Text style={styles.decksListItemTitle}>{item.name}</Text>
            <Text style={styles.decksListItemCardCount}>
              {`${item.cardAmount} card${item.cardAmount > 1 ? "s" : ""}`}
            </Text>
          </View>
        </View>
        {selectionMode && isSelected ? (
          <Text style={{ fontSize: 16, color: colors.fg }}>✓</Text>
        ) : (
          <View style={styles.deckActions}>
            <Pressable
              style={{ marginRight: 16 }}
              onPress={() => handleDeckReviewPress(item.slug)}
            >
              <Cached size={24} color="#000" />
            </Pressable>
            <Pressable
              style={{ marginRight: 16 }}
              onPress={() => handleDeckUpdatePress(item.slug)}
            >
              <Pencil size={24} color="#000" />
            </Pressable>
          </View>
        )}
      </Pressable>
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
        <Stack.Screen
          options={{
            title: selectionMode
              ? `Selecionado(s) ${selectedDecks.length}`
              : "Decks",
            headerRight: () =>
              selectionMode ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Pressable onPress={cancelSelection}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </Pressable>
                  <View style={{ width: 32 }} />
                  <Pressable
                    onPress={handleDeleteSelected}
                    style={{ marginRight: 10 }}
                  >
                    <Trash size={24} color="#000" />
                  </Pressable>
                </View>
              ) : null,
          }}
        />
        <FlatList
          data={manifest.decks}
          renderItem={renderDecks}
          keyExtractor={(item) => item.slug}
          style={styles.decksList}
          ItemSeparatorComponent={Separator}
        />
        {!selectionMode && (
          <Link href="/decks/create" asChild>
            <Pressable style={styles.fab}>
              <Plus size={24} color="#fff" />
            </Pressable>
          </Link>
        )}
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
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: "#e0e0e0",
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.fg,
    fontFamily: "Lato-Bold",
    paddingHorizontal: 8,
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
  deckActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});

function Separator() {
  return <View style={styles.separator} />;
}

import { colors } from "@/src/constants/colors";
import { fonts } from "@/src/constants/fonts";
import { useDecksStore } from "@/src/stores/DecksStore";
import { FlashCard } from "@/src/types/Deck";
import { Feather } from "@expo/vector-icons";
import { Link, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Button,
  Image,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Plus } from "@icons";

export default function DeckPage() {
  const { deck: deckSlug } = useLocalSearchParams();
  const { getDeck } = useDecksStore();

  const [screenTitle, setScreenTitle] = useState<string>();
  const [cards, setCards] = useState<FlashCard[]>();

  // Modal state for new card
  const [modalVisible, setModalVisible] = useState(false);
  const [linguagemPergunta, setLinguagemPergunta] = useState("jp");
  const [linguagemResposta, setLinguagemResposta] = useState("latin");
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [imagem, setImagem] = useState("");

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const data = await getDeck(deckSlug as string);

        if (data) {
          setCards(data.cards);
          setScreenTitle(data.name);
        }
      }

      fetchData();
    }, [deckSlug, getDeck]),
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
      <Link href="/cards/create" asChild>
        <Pressable style={styles.fab}>
          <Plus size={24} color="#fff" />
        </Pressable>
      </Link>
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

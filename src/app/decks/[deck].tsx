import { colors } from "@/src/constants/colors";
import { fonts } from "@/src/constants/fonts";
import { useDecksStore } from "@/src/stores/DecksStore";
import { FlashCard } from "@/src/types/Deck";
import { Feather } from "@expo/vector-icons";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
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
} from "react-native";
import { Picker } from "@react-native-picker/picker";

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

  // Add card handler (update this to save to your store if needed)
  const handleCreateCard = () => {
    const newCard: FlashCard = {
      id: (cards?.length ?? 0) + 1,
      front: [
        {
          type: "text",
          content: pergunta,
          writingSystem: linguagemPergunta as "jp" | "latin",
        },
      ],
      back: [
        {
          type: "text",
          content: resposta,
          writingSystem: linguagemResposta as "jp" | "latin",
        },
      ],
      ...(imagem ? { image: imagem } : {}),
    };
    setCards([...(cards ?? []), newCard]);
    setModalVisible(false);
    setLinguagemPergunta("jp");
    setPergunta("");
    setLinguagemResposta("jp");
    setResposta("");
    setImagem("");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: screenTitle ?? "Deck",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{ marginRight: 16 }}
              accessibilityLabel="Create new card"
            >
              <Feather name="plus" size={24} color={colors.fg} />
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        data={cards}
        renderItem={renderCards}
        style={styles.cardsList}
        ItemSeparatorComponent={Separator}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.content}>
            <Text style={modalStyles.label}>Linguagem da pergunta</Text>
            <Picker
              selectedValue={linguagemPergunta}
              onValueChange={setLinguagemPergunta}
              style={modalStyles.input}
            >
              <Picker.Item label="Japonês" value="jp" />
              <Picker.Item label="Latim" value="latin" />
            </Picker>
            <Text style={modalStyles.label}>Pergunta</Text>
            <TextInput
              style={modalStyles.input}
              value={pergunta}
              onChangeText={setPergunta}
              placeholder="Digite a pergunta"
            />
            <Text style={modalStyles.label}>Linguagem da resposta</Text>
            <Picker
              selectedValue={linguagemResposta}
              onValueChange={setLinguagemResposta}
              style={modalStyles.input}
            >
              <Picker.Item label="Japonês" value="jp" />
              <Picker.Item label="Latim" value="latin" />
            </Picker>
            <Text style={modalStyles.label}>Resposta</Text>
            <TextInput
              style={modalStyles.input}
              value={resposta}
              onChangeText={setResposta}
              placeholder="Digite a resposta"
            />
            <Text style={modalStyles.label}>Imagem (opcional)</Text>
            <TextInput
              style={modalStyles.input}
              value={imagem}
              onChangeText={setImagem}
              placeholder="URL da imagem (opcional)"
            />
            {imagem ? (
              <Image
                source={{ uri: imagem }}
                style={{
                  width: 80,
                  height: 80,
                  marginBottom: 8,
                  alignSelf: "center",
                }}
                resizeMode="contain"
              />
            ) : null}
            <View style={modalStyles.buttonRow}>
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                color="#888"
              />
              <Button title="Criar" onPress={handleCreateCard} />
            </View>
          </View>
        </View>
      </Modal>
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

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "85%",
    elevation: 4,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
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

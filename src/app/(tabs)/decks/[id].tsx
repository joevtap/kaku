import { colors } from "@/src/constants/colors";
import { fonts } from "@/src/constants/fonts";
import { DeckSchema } from "@/src/types/DeckSchema";
import Card from "@components/Card/Card";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function DeckPage() {
  const { id } = useLocalSearchParams();

  const [deck, setDeck] = useState<DeckSchema>();
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    // TODO: This is provisory, decks will be persisted in user's device's file system
    async function fetchLocalDeck() {
      const data = require("@assets/decks/yojijukugo.json");

      setDeck(data);
    }

    console.log("Deck ID: ", id);

    fetchLocalDeck();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.bg,
        padding: 20,
      }}
    >
      <Card
        showBack={showBack}
        front={
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 40,
                fontFamily:
                  fonts[deck?.cards[0].front[0].writingSystem ?? "latin"],
              }}
            >
              {deck?.cards[0].front[0].content}
            </Text>
          </View>
        }
        back={
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily:
                  fonts[deck?.cards[0].back[0].writingSystem ?? "latin"],
              }}
            >
              {deck?.cards[0].back[0].content}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        onPress={() => setShowBack(!showBack)}
        style={{
          backgroundColor: colors.fg,
          padding: 10,
          borderRadius: 5,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.bg }}>
          {showBack ? "View answer" : "Hide answer"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

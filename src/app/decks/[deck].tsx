import { colors } from "@/src/constants/colors";
import { fonts } from "@/src/constants/fonts";
import { DecksFileSystemHandler } from "@/src/infra/filesystem/DecksFileSystemHandler";
import { DeckSchema } from "@/src/types/DeckSchema";
import Card from "@components/Card/Card";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function DeckPage() {
  const { deck: deckSlug } = useLocalSearchParams();

  const [deck, setDeck] = useState<DeckSchema>();
  const [showBack, setShowBack] = useState(false);

  useFocusEffect(() => {
    async function fetchLocalDeck() {
      const decksFileSystemHandler = new DecksFileSystemHandler();
      const data = await decksFileSystemHandler.read(deckSlug as string);

      if (data) {
        setDeck(data);
      }
    }

    fetchLocalDeck();
  });

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
      <Stack.Screen
        options={{
          title: deck?.name ?? "Deck",
        }}
      />
      <Card
        showBack={showBack}
        front={
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 40,
                lineHeight: 48,
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
                fontSize: 24,
                lineHeight: 32,
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
          {showBack ? "Hide answer" : "View answer"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

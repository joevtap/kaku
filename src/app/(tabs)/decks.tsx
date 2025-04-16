import Card from "@components/Card/Card";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Decks() {
  const [showBack, setShowBack] = useState(false);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Card
        showBack={showBack}
        front={<Text>Front</Text>}
        back={<Text>Back</Text>}
      />

      <Pressable onPress={() => setShowBack((prev) => !prev)}>
        <Text>Toggle card</Text>
      </Pressable>
    </View>
  );
}

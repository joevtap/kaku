import { Text, View } from "react-native";
import Cards from "@icons/cards.svg";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Cards width={80} height={80} color={"rebeccapurple"} />
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

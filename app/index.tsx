import { StyleSheet, Text, View } from "react-native";
import Cards from "@icons/cards.svg";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons name="function" size={80} color="rebeccapurple" />
      <Cards width={80} height={80} color={"rebeccapurple"} />

      <Text style={styles.noFont}>Text without setting a font</Text>
      <Text style={styles.japanese}>日本語のテキスト</Text>
      <Text style={styles.customFont}>Text with custom font</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noFont: {
    fontSize: 24,
  },
  japanese: {
    fontSize: 24,
    fontFamily: "KleeOne-SemiBold",
  },
  customFont: {
    fontSize: 24,
    fontFamily: "Lato-Regular",
  },
});

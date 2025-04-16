import { fonts } from "@/constants/fonts";
import { Cards } from "@icons";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Cards size={100} color="#000" />
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
    fontFamily: fonts.jp,
  },
  customFont: {
    fontSize: 24,
    fontFamily: fonts.latin,
  },
});

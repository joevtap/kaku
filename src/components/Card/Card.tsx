import { colors } from "@/src/constants/colors";
import { ReactNode } from "react";
import { View } from "react-native";

interface CardProps {
  showBack: boolean;
  front: ReactNode;
  back: ReactNode;
}

export default function Card(props: CardProps) {
  const { showBack, front, back } = props;

  if (!showBack) {
    return <>{front}</>;
  }

  return (
    <View style={{ width: "100%", gap: 8 }}>
      {front}
      {showBack && <Divider />}
      {back}
    </View>
  );
}

function Divider() {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: colors.fg,
        marginVertical: 10,
      }}
    ></View>
  );
}

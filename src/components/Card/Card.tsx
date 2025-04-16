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
    <>
      {front}
      <Divider />
      {back}
    </>
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

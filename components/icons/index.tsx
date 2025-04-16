import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export interface IconProps {
  size?: number;
  color?: string;
}

const Cards = (props: IconProps) => (
  <MaterialCommunityIcons name="cards" size={props.size} color={props.color} />
);

export { Cards };

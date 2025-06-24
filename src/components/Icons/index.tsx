import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export interface IconProps {
  size?: number;
  color?: string;
}

const Cards = (props: IconProps) => (
  <MaterialCommunityIcons name="cards" size={props.size} color={props.color} />
);

const Home = (props: IconProps) => (
  <MaterialCommunityIcons name="home" size={props.size} color={props.color} />
);

const Plus = (props: IconProps) => (
  <MaterialCommunityIcons name="plus" size={props.size} color={props.color} />
);

const Trash = (props: IconProps) => (
  <MaterialCommunityIcons name="delete" size={props.size} color={props.color} />
);

const Pencil = (props: IconProps) => (
  <MaterialCommunityIcons name="pencil" size={props.size} color={props.color} />
);

const Cached = (props: IconProps) => (
  <MaterialCommunityIcons name="cached" size={props.size} color={props.color} />
);

export { Cards, Home, Plus, Trash, Pencil, Cached };

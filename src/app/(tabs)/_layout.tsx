import { Tabs } from "expo-router";
import { Cards, Cached } from "@icons";
import { colors } from "@/src/constants/colors";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.fg,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Decks",
            tabBarIcon: ({ color }) => <Cards size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="review"
          options={{
            title: "Revisão",
            tabBarIcon: ({ color }) => <Cached size={28} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}

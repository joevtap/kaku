import { Tabs } from "expo-router";
import { Cards, Home } from "@icons";
import { colors } from "@/src/constants/colors";

export default function TabLayout() {
  return (
    // Custom tab bar
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: colors.fg,
    //     tabBarInactiveTintColor: "#888",
    //   }}
    //   tabBar={(props) => <TabBar {...props} />}
    // >
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
    </Tabs>
  );
}

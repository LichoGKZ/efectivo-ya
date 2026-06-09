import { View, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";

export default function BottomNavigation() {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,

        flexDirection: "row",
        justifyContent: "space-around",

        backgroundColor: "#fff",

        borderTopWidth: 1,
        borderColor: "#E5E7EB",

        paddingVertical: 15,
      }}
    >
      <TouchableOpacity onPress={() => router.push("/home")}>
        <Text>🏠</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/request")}>
        <Text>💸</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/history")}>
        <Text>📄</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/profile")}>
        <Text>👤</Text>
      </TouchableOpacity>
    </View>
  );
}
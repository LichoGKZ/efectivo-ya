import { Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import Screen from "../components/Screen";

export default function HomeScreen() {
  const Item = ({
    title,
    route,
  }: {
    title: string;
    route: string;
  }) => (
    <TouchableOpacity
      onPress={() => router.push(route as any)}
      style={{
        backgroundColor: "#F5F5F5",
        padding: 20,
        borderRadius: 16,
        marginBottom: 15,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 30,
        }}
      >
        Hola 👋
      </Text>

      <Item
        title="Retirar en mi domicilio"
        route="/request"
      />

      <Item
        title="Entregar en una dirección"
        route="/request"
      />

      <Item
        title="Transferir efectivo"
        route="/request"
      />

      <Item
        title="Historial"
        route="/history"
      />

      <TouchableOpacity
        onPress={() => router.push("/dev")}
        style={{
          marginTop: 20,
          backgroundColor: "#EF4444",
          padding: 12,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          DEV PANEL
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}
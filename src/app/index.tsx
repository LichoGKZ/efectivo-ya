import { View, Text } from "react-native";
import { router } from "expo-router";

import Button from "../components/Button";
import Screen from "../components/Screen";

export default function WelcomeScreen() {
  return (
    <Screen>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 42,
            fontWeight: "bold",
            color: "#22C55E",
            textAlign: "center",
          }}
        >
          Efectivo Ya
        </Text>

        <Text
          style={{
            textAlign: "center",
            marginTop: 10,
            marginBottom: 50,
          }}
        >
          Tu dinero, al instante.
        </Text>

        <Button
          title="Iniciar Sesión"
          onPress={() => router.push("/login")}
        />

        <View style={{ height: 12 }} />

        <Button
          title="Crear Cuenta"
          onPress={() => router.push("/register")}
        />
      </View>
    </Screen>
  );
}
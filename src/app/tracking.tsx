import { View, Text } from "react-native";

import Screen from "../components/Screen";
import Card from "../components/Card";

export default function TrackingScreen() {
  return (
    <Screen>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Operación en curso
      </Text>

      <Card>
        <Text>✅ Retiro confirmado</Text>
      </Card>

      <Card>
        <Text>🚗 Dinero en camino</Text>
      </Card>

      <Card>
        <Text>⏳ Entrega pendiente</Text>
      </Card>
    </Screen>
  );
}
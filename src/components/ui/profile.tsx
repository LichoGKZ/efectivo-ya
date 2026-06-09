import { Text } from "react-native";

import Screen from "../components/Screen";
import Card from "../components/Card";

export default function ProfileScreen() {
  return (
    <Screen>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Mi Perfil
      </Text>

      <Card>
        <Text>Juan Pérez</Text>
        <Text>juan@email.com</Text>
      </Card>

      <Card>
        <Text>✅ DNI validado</Text>
      </Card>

      <Card>
        <Text>✅ Teléfono validado</Text>
      </Card>
    </Screen>
  );
}
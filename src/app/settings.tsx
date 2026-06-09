import { Text } from "react-native";

import Screen from "../components/Screen";
import Card from "../components/Card";

export default function SettingsScreen() {
  return (
    <Screen>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Configuración
      </Text>

      <Card>
        <Text>🔒 Seguridad</Text>
      </Card>

      <Card>
        <Text>🌎 Idioma</Text>
      </Card>

      <Card>
        <Text>🔔 Notificaciones</Text>
      </Card>

      <Card>
        <Text>🚪 Cerrar sesión</Text>
      </Card>
    </Screen>
  );
}
import { View, Text } from "react-native";

import Screen from "../components/Screen";
import Button from "../components/Button";
import { saveData, getData } from "../services/storage";
import { router } from "expo-router";

export default function RequestScreen() {
  return (
    <Screen>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 25,
        }}
      >
        Confirmar solicitud
      </Text>

      <View
        style={{
          backgroundColor: "#F3F4F6",
          height: 250,
          borderRadius: 20,
          marginBottom: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Mapa (próximamente)</Text>
      </View>

      <Text>Origen: Av. Colón 1234</Text>

      <Text style={{ marginTop: 10 }}>
        Destino: San Martín 2450
      </Text>

      <Text style={{ marginTop: 10 }}>
        Monto: $150.000
      </Text>

      <View style={{ marginTop: 25 }}>
        <Button
          title="Confirmar solicitud"
          onPress={() => router.push("/tracking")}
        />
      </View>
    </Screen>
  );
}

const createRequest = async () => {
  const oldRequests =
    (await getData("requests")) || [];

  const newRequest = {
    id: Date.now(),
    amount: 150000,
    address: "Av. Colón 1234",
    status: "Pendiente",
    date: new Date().toLocaleString(),
  };

  await saveData(
    "requests",
    [...oldRequests, newRequest]
  );

  router.push("/tracking");
};
<Button
  title="Confirmar solicitud"
  onPress={createRequest}
/>
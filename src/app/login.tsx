import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import Screen from "../components/Screen";
import Input from "../components/Input";
import Button from "../components/Button";

export default function LoginScreen() {
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
            fontSize: 32,
            fontWeight: "bold",
          }}
        >
          Iniciar sesión
        </Text>

        <Text
          style={{
            marginBottom: 30,
            color: "#666",
          }}
        >
          Bienvenido nuevamente
        </Text>

        <Input placeholder="Correo o teléfono" />

        <Input
          placeholder="Contraseña"
          secureTextEntry
        />

        <Button
          title="Iniciar sesión"
          onPress={() => router.replace("/home")}
        />

        <View style={{ height: 12 }} />

        <Button
          title="Crear cuenta"
          onPress={() => router.push("/register")}
        />

        <View style={{ height: 20 }} />

        <TouchableOpacity
          onPress={() => router.push("/dev")}
          style={{
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
      </View>
    </Screen>
  );
}
import { View } from "react-native";
import { router } from "expo-router";

import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";

export default function RegisterScreen() {
  return (
    <View
      style={{
        flex: 1,
        padding: 24,
      }}
    >
      <Header title="Registro" />

      <Input placeholder="Nombre" />

      <Input placeholder="Email" />

      <Input
        placeholder="Contraseña"
        secureTextEntry
      />

      <Button
        title="Crear Cuenta"
        onPress={() => router.replace("/home")}
      />
    </View>
  );
}
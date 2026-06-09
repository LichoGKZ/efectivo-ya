import { View, Button } from "react-native";
import { router } from "expo-router";

import { removeData } from "../services/storage";

export default function DevScreen() {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        gap: 10,
      }}
    >
      <Button
        title="Home"
        onPress={() => router.push("/home")}
      />

      <Button
        title="Request"
        onPress={() => router.push("/request")}
      />

      <Button
        title="Tracking"
        onPress={() => router.push("/tracking")}
      />

      <Button
        title="History"
        onPress={() => router.push("/history")}
      />

      <Button
        title="Profile"
        onPress={() => router.push("/profile")}
      />

      <Button
        title="Settings"
        onPress={() => router.push("/settings")}
      />

      <Button
        title="Limpiar Historial"
        onPress={() => removeData("requests")}
      />
    </View>
  );
}
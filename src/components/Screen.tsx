import { View } from "react-native";
import { THEME } from "../constants/theme";

export default function Screen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: THEME.colors.background,
        padding: THEME.spacing.lg,
      }}
    >
      {children}
    </View>
  );
}
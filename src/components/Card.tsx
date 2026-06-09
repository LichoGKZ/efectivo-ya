import { View } from "react-native";
import { COLORS } from "../constants/colors";

export default function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        padding: 20,
        borderRadius: 16,
        marginBottom: 15,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,

        elevation: 3,
      }}
    >
      {children}
    </View>
  );
}
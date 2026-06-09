import { TouchableOpacity, Text } from "react-native";
import { COLORS } from "../constants/colors";

type Props = {
  title: string;
  onPress: () => void;
};

export default function Button({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
      }}
    >
      <Text
        style={{
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
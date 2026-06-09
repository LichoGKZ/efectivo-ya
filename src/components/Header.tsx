import { Text, View } from "react-native";
import { COLORS } from "../constants/colors";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <View
      style={{
        marginBottom: 25,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          color: COLORS.text,
        }}
      >
        {title}
      </Text>
    </View>
  );
}
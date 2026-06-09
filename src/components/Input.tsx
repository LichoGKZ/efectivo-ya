import { TextInput } from "react-native";
import { COLORS } from "../constants/colors";

type Props = {
  placeholder: string;
  secureTextEntry?: boolean;
};

export default function Input({
  placeholder,
  secureTextEntry = false,
}: Props) {
  return (
    <TextInput
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={{
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
      }}
    />
  );
}
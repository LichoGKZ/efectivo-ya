// src/components/Card.tsx
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
  noPadding?: boolean;
};

export default function Card({ children, onPress, style, noPadding }: Props) {
  const content = (
    <View style={[styles.card, noPadding && styles.noPadding, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  noPadding: {
    padding: 0,
  },
});

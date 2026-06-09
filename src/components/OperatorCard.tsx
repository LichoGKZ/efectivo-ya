// src/components/OperatorCard.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
  eta?: string;
  onMessage?: () => void;
  onCall?: () => void;
  onContact?: () => void;
  compact?: boolean;
};

export default function OperatorCard({
  name,
  rating,
  vehicle,
  plate,
  eta,
  onMessage,
  onCall,
  onContact,
  compact = false,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Avatar placeholder */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0)}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.vehicle}>{vehicle}</Text>
          <Text style={styles.plate}>{plate}</Text>
        </View>

        {eta && (
          <View style={styles.etaBox}>
            <Text style={styles.etaLabel}>Llega en</Text>
            <Text style={styles.etaValue}>{eta}</Text>
          </View>
        )}
      </View>

      {!compact && (onMessage || onCall) && (
        <View style={styles.actions}>
          {onMessage && (
            <TouchableOpacity style={styles.actionBtn} onPress={onMessage}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionLabel}>Mensaje</Text>
            </TouchableOpacity>
          )}
          {onCall && (
            <TouchableOpacity style={styles.actionBtn} onPress={onCall}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionLabel}>Llamar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {onContact && compact && (
        <TouchableOpacity style={styles.contactBtn} onPress={onContact}>
          <Text style={styles.contactLabel}>Contactar operador</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: {
    fontSize: 12,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  vehicle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  plate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  etaBox: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  etaLabel: {
    fontSize: 10,
    color: COLORS.primaryDark,
  },
  etaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
  },
  actionIcon: {
    fontSize: 15,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  contactBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

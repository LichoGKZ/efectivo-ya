// src/app/tracking.tsx  — Pantalla 8: Operación en curso
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import StatusTimeline from '../components/StatusTimeline';
import OperatorCard from '../components/OperatorCard';
import Button from '../components/Button';
import { COLORS } from '../constants/colors';

const STEPS = [
  {
    label: 'Retiro confirmado',
    detail: 'El operador retiró el dinero.',
    done: true,
  },
  {
    label: 'Dinero en poder del operador',
    detail: 'En camino al destino.',
    done: true,
  },
  {
    label: 'En camino al destino',
    detail: 'Llegada estimada: 10:15 AM',
    done: false,
    active: true,
  },
  {
    label: 'Entrega pendiente',
    detail: 'El operador entregará el dinero.',
    done: false,
  },
];

export default function TrackingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.topBar}>
          <Header title="Operación en curso" showBack />
        </View>

        <View style={styles.statusBanner}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Tu operación está en progreso</Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineCard}>
          <StatusTimeline steps={STEPS} />
        </View>

        {/* Operador */}
        <OperatorCard
          name="Juan Pérez"
          rating={4.9}
          vehicle="Toyota Etios – Blanco"
          plate="ABC123"
          onContact={() => {}}
          compact
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Operación entregada"
          onPress={() => router.replace('/rate')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 120,
  },
  topBar: { marginBottom: 4 },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  timelineCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 32,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

// src/app/operator-assigned.tsx  — Pantalla 7: Operador asignado
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import OperatorCard from '../components/OperatorCard';
import { COLORS } from '../constants/colors';

export default function OperatorAssignedScreen() {
  return (
    <View style={styles.container}>
      {/* Mapa */}
      <View style={styles.mapArea}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapLabel}>🗺️ Ruta del operador</Text>
        </View>

        {/* Pill superior */}
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Tu operador está en camino</Text>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={styles.bottomSheet}>
        <OperatorCard
          name="Juan Pérez"
          rating={4.9}
          vehicle="Toyota Etios – Blanco"
          plate="ABC123"
          eta="8 min"
          onMessage={() => {}}
          onCall={() => {}}
        />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => {}}>
            <Text style={styles.secondaryText}>🔗 Compartir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.replace('/home')}
          >
            <Text style={styles.cancelText}>Cancelar operación</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mapArea: {
    flex: 1,
    backgroundColor: COLORS.mapPlaceholder,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: { alignItems: 'center' },
  mapLabel: { fontSize: 15, color: COLORS.primaryDark },
  statusPill: {
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  bottomSheet: {
    padding: 20,
    paddingBottom: 36,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.error,
  },
});

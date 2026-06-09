// src/app/service-select.tsx  — Pantalla 5: Categorías de servicio
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import Button from '../components/Button';
import { COLORS } from '../constants/colors';
import { getData, saveData } from '../services/storage';
import type { ServiceCategory } from '../types';

const SERVICES = [
  {
    id: 'moto' as ServiceCategory,
    icon: '🏍️',
    name: 'Moto Express',
    desc: 'Hasta $50.000',
    time: '15 min',
  },
  {
    id: 'auto_estandar' as ServiceCategory,
    icon: '🚗',
    name: 'Auto Estándar',
    desc: '$50.000 – $300.000',
    time: '20 min',
  },
  {
    id: 'auto_seguro' as ServiceCategory,
    icon: '🚙',
    name: 'Auto Seguro',
    desc: '$300.000 – $1.000.000',
    time: '25 min',
  },
  {
    id: 'especializado' as ServiceCategory,
    icon: '🚐',
    name: 'Operador Especializado',
    desc: 'Más de $1.000.000',
    time: '30 min',
  },
];

export default function ServiceSelectScreen() {
  const handleContinue = async () => {
    router.push('/searching');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header title="Seleccionar servicio" showBack />

        <Text style={styles.hint}>
          El servicio se asigna según el monto de tu operación.
        </Text>

        {SERVICES.map((s) => (
          <View key={s.id} style={styles.serviceRow}>
            <View style={styles.serviceIcon}>
              <Text style={{ fontSize: 22 }}>{s.icon}</Text>
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{s.name}</Text>
              <Text style={styles.serviceDesc}>{s.desc}</Text>
            </View>
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>{s.time}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.autoNote}>
          La asignación del operador será automática para tu seguridad.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continuar" onPress={handleContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 100,
  },
  hint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: { flex: 1 },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  serviceDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  timeBadge: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  autoNote: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 18,
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

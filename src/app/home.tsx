// src/app/home.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { getCurrentProfile } from '../services/auth';
import { COLORS } from '../constants/colors';

const OPERATIONS = [
  {
    id: 'retiro_domicilio',
    icon: '🏠',
    title: 'Retirar en mi domicilio',
    description: 'Un operador retira el dinero en tu ubicación',
  },
  {
    id: 'entrega_direccion',
    icon: '📍',
    title: 'Entregar en una dirección',
    description: 'Un operador entrega a otra persona',
  },
  {
    id: 'transferencia',
    icon: '🔄',
    title: 'Transferir efectivo',
    description: 'Entrega de dinero a un tercero',
  },
  {
    id: 'frecuentes',
    icon: '⭐',
    title: 'Direcciones frecuentes',
    description: 'Accedé a tus direcciones guardadas',
  },
];

export default function HomeScreen() {
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Usuario';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header saludo */}
        <View style={styles.topBar}>
          <View>
            {loading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <>
                <Text style={styles.greeting}>Hola, {firstName} 👋</Text>
                <Text style={styles.subtitle}>¿Qué operación deseás realizar?</Text>
              </>
            )}
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Opciones de operación */}
        {OPERATIONS.map((op) => (
          <TouchableOpacity
            key={op.id}
            style={styles.opCard}
            onPress={() => router.push({ pathname: '/request', params: { type: op.id } })}
            activeOpacity={0.85}
          >
            <View style={styles.opIcon}>
              <Text style={styles.opIconText}>{op.icon}</Text>
            </View>
            <View style={styles.opContent}>
              <Text style={styles.opTitle}>{op.title}</Text>
              <Text style={styles.opDesc}>{op.description}</Text>
            </View>
            <Text style={styles.opArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notifIcon: { fontSize: 18 },
  opCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  opIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opIconText: { fontSize: 22 },
  opContent: { flex: 1, gap: 2 },
  opTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  opDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 16 },
  opArrow: { fontSize: 20, color: COLORS.textMuted, fontWeight: '300' },
});
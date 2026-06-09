// src/app/home.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { getCurrentProfile } from '../services/auth';
import { COLORS } from '../constants/colors';
import { supabase } from '../services/supabase';
import { Ionicons } from '@expo/vector-icons';

const OPERATIONS = [
  {
    id: 'retiro_domicilio',
    icon: 'home',
    title: 'Retirar en mi domicilio',
    description: 'Un operador retira el dinero en tu ubicación',
  },
  {
    id: 'entrega_direccion',
    icon: 'location',
    title: 'Entregar en una dirección',
    description: 'Un operador entrega a otra persona',
  },
  {
    id: 'transferencia',
    icon: 'swap-horizontal',
    title: 'Transferir efectivo',
    description: 'Entrega de dinero a un tercero',
  },
  {
    id: 'frecuentes',
    icon: 'star',
    title: 'Direcciones frecuentes',
    description: 'Accedé a tus direcciones guardadas',
  },
];

export default function HomeScreen() {
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await getCurrentProfile();
        // Si no hay perfil todavía, intentar leer el nombre desde auth metadata
        if (!p) {
          const { data: { user } } = await supabase.auth.getUser();
          const metaName = user?.user_metadata?.full_name ?? null;
          setProfile({ full_name: metaName });
        } else {
          setProfile(p);
        }
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    load();
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
            <Ionicons
              name="notifications-outline"
              size={20}
              color={COLORS.text}
            />
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
              <Ionicons
                name={op.icon as any}
                size={24}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.opContent}>
              <Text style={styles.opTitle}>{op.title}</Text>
              <Text style={styles.opDesc}>{op.description}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

        {__DEV__ && (
        <TouchableOpacity
            style={{ position: 'absolute', top: 82, right: 68, padding: 8 }}
            onPress={() => router.push('/dev')}
        >
            <Ionicons
              name="construct"
              size={18}
              color={COLORS.text}
            />
        </TouchableOpacity>
        )}

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
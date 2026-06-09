// src/app/searching.tsx
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import MapViewComponent, { MapMarker } from '../components/MapViewComponent';
import { useCurrentLocation } from '../hooks/useLocation';
import { supabase } from '../services/supabase';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function SearchingScreen() {
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;
  const [operationId, setOperationId] = useState<string | null>(null);

  const { current: userLocation } = useCurrentLocation();

  useEffect(() => {
    startPulse();
    loadAndSubscribe();
  }, []);

  const startPulse = () => {
    const createPulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 2.5, duration: 1200, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      );
    createPulse(pulse1, 0).start();
    createPulse(pulse2, 400).start();
    createPulse(pulse3, 800).start();
  };

  const loadAndSubscribe = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('operations')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('status', 'buscando_operador')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!data) return;
    setOperationId(data.id);

    supabase
      .channel(`searching-${data.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'operations', filter: `id=eq.${data.id}` },
        (payload) => {
          const updated = payload.new as { status: string };
          if (updated.status === 'operador_asignado') router.replace('/operator-assigned');
          if (updated.status === 'cancelado') router.replace('/home');
        }
      )
      .subscribe();
  };

  const handleCancel = async () => {
    if (operationId) {
      await supabase.from('operations').update({ status: 'cancelado' }).eq('id', operationId);
    }
    router.replace('/home');
  };

  const markers: MapMarker[] = userLocation
    ? [{ coordinate: userLocation, type: 'origin', title: 'Tu ubicación' }]
    : [];

  return (
    <View style={styles.container}>
      {/* Mapa real como fondo */}
      <View style={styles.mapArea}>
        {userLocation ? (
          <MapViewComponent
            markers={markers}
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              ...userLocation,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, styles.mapFallback]} />
        )}

        {/* Pulso superpuesto sobre el mapa */}
        <View style={styles.pulseContainer}>
          {[pulse1, pulse2, pulse3].map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: anim }],
                  opacity: anim.interpolate({ inputRange: [1, 2.5], outputRange: [0.6, 0] }),
                },
              ]}
            />
          ))}
          <View style={styles.centerDot} />
        </View>
      </View>

      {/* Bottom info */}
      <View style={styles.infoBox}>
        <Text style={styles.title}>Buscando operador disponible...</Text>
        <Text style={styles.subtitle}>
          Estamos asignando un operador cercano para gestionar tu solicitud.
        </Text>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mapArea: {
    flex: 1,
    backgroundColor: COLORS.mapPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapFallback: { backgroundColor: COLORS.mapPlaceholder },
  pulseContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  centerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    zIndex: 1,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  infoBox: {
    padding: 28,
    paddingBottom: 48,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  cancelBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  cancelText: { fontSize: 15, fontWeight: '600', color: COLORS.text },
});

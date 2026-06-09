// src/app/operator-assigned.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import OperatorCard from '../components/OperatorCard';
import MapViewComponent, { LatLng, MapMarker } from '../components/MapViewComponent';
import { useCurrentLocation } from '../hooks/useLocation';
import { supabase } from '../services/supabase';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

// Posición simulada del operador (en el futuro vendrá de la DB en tiempo real)
const SIMULATED_OPERATOR: LatLng = {
  latitude: -34.5985,
  longitude: -58.3896,
};

export default function OperatorAssignedScreen() {
  const { current: userLocation } = useCurrentLocation();
  const [operatorLocation, setOperatorLocation] = useState<LatLng>(SIMULATED_OPERATOR);

  // En el futuro: suscribirse a cambios de location del operador desde Supabase
  // Por ahora usamos posición simulada

  const markers: MapMarker[] = [
    ...(userLocation
      ? [{ coordinate: userLocation, type: 'origin' as const, title: 'Tu ubicación' }]
      : []),
    { coordinate: operatorLocation, type: 'operator' as const, title: 'Operador' },
  ];

  return (
    <View style={styles.container}>
      {/* Mapa con ubicación del operador */}
      <View style={styles.mapArea}>
        <MapViewComponent
          markers={markers}
          showRoute
          style={StyleSheet.absoluteFillObject}
          initialRegion={
            userLocation
              ? {
                  latitude: (userLocation.latitude + operatorLocation.latitude) / 2,
                  longitude: (userLocation.longitude + operatorLocation.longitude) / 2,
                  latitudeDelta: 0.04,
                  longitudeDelta: 0.04,
                }
              : {
                  ...operatorLocation,
                  latitudeDelta: 0.03,
                  longitudeDelta: 0.03,
                }
          }
        />

        {/* Pill de estado flotante */}
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
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.replace('/home')}>
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
  },
  statusPill: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  statusText: { fontSize: 13, fontWeight: '600', color: COLORS.text },
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
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  secondaryText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: { fontSize: 14, fontWeight: '600', color: COLORS.error },
});

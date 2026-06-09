// src/app/request.tsx
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Header from '../components/Header';
import Button from '../components/Button';
import { supabase } from '../services/supabase';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

// Importamos el mapa y el hook de forma lazy para no crashear si no están instalados
let MapViewComponent: any = null;
let useCurrentLocation: any = null;
let geocodeAddress: any = null;

try {
  MapViewComponent = require('../components/MapViewComponent').default;
  const loc = require('../hooks/useLocation');
  useCurrentLocation = loc.useCurrentLocation;
  geocodeAddress = loc.geocodeAddress;
} catch (e) {
  // react-native-maps o expo-location no están instalados todavía
}

const TYPE_LABELS: Record<string, string> = {
  retiro_domicilio: 'Retiro en domicilio',
  entrega_direccion: 'Entrega en dirección',
  transferencia: 'Transferencia de efectivo',
  frecuentes: 'Dirección frecuente',
};

const AMOUNT = 150000;
const COMMISSION = 3000;
const TOTAL = AMOUNT + COMMISSION;
const DESTINATION_ADDRESS = 'San Martín 2450, Buenos Aires, Argentina';

type LatLng = { latitude: number; longitude: number };

export default function RequestScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const opLabel = TYPE_LABELS[type ?? ''] ?? 'Entrega de efectivo';

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [destCoord, setDestCoord] = useState<LatLng | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapsAvailable] = useState(() => !!MapViewComponent && !!useCurrentLocation);

  useEffect(() => {
    if (!mapsAvailable) return;

    // Obtener ubicación actual
    const getLocation = async () => {
      try {
        const Location = require('expo-location');
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }
      } catch (e) {
        console.warn('[request] No se pudo obtener ubicación:', e);
      }
    };

    // Geocodificar destino
    const getDestination = async () => {
      if (!geocodeAddress) return;
      try {
        const coord = await geocodeAddress(DESTINATION_ADDRESS);
        if (coord) setDestCoord(coord);
      } catch (e) {
        // Sin key configurada, ignorar
      }
    };

    Promise.all([getLocation(), getDestination()]).finally(() => setMapReady(true));
  }, [mapsAvailable]);

  const handleConfirm = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('operations').insert({
      user_id: user.id,
      type: type ?? 'entrega_direccion',
      status: 'buscando_operador',
      amount: AMOUNT,
      origin: 'Tu ubicación actual',
      destination: DESTINATION_ADDRESS,
      service_category: 'auto_estandar',
      commission: COMMISSION,
      total: TOTAL,
    });

    router.push('/service-select');
  };

  const markers = [
    ...(userLocation ? [{ coordinate: userLocation, type: 'origin' as const, title: 'Tu ubicación' }] : []),
    ...(destCoord ? [{ coordinate: destCoord, type: 'destination' as const, title: 'Destino' }] : []),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header title="Confirmar solicitud" showBack />

        {/* Mapa */}
        <View style={styles.mapContainer}>
          {!mapsAvailable ? (
            // Placeholder si react-native-maps no está instalado
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapLabel}>🗺️ Mapa (instalá react-native-maps)</Text>
            </View>
          ) : !mapReady ? (
            <View style={styles.mapPlaceholder}>
              <ActivityIndicator color={COLORS.primary} />
              <Text style={styles.mapLoadingText}>Cargando mapa...</Text>
            </View>
          ) : (
            <MapViewComponent
              markers={markers}
              showRoute={markers.length >= 2}
              style={styles.map}
            />
          )}
        </View>

        <View style={styles.infoSection}>
          <InfoRow icon="🟢" label="Ubicación de retiro" value="Tu ubicación actual" />
          <InfoRow icon="🔴" label="Destino" value="San Martín 2450, CABA" />
          <InfoRow icon="📋" label="Tipo de operación" value={opLabel} />
          <InfoRow icon="💰" label="Monto a enviar" value={`$${AMOUNT.toLocaleString('es-AR')}`} />
          <InfoRow icon="💸" label="Comisión" value={`$${COMMISSION.toLocaleString('es-AR')}`} />
          <InfoRow icon="🧾" label="Total" value={`$${TOTAL.toLocaleString('es-AR')}`} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Confirmar solicitud" onPress={handleConfirm} />
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 100 },
  mapContainer: {
    height: 220, borderRadius: 20, overflow: 'hidden',
    marginBottom: 20, borderWidth: 1, borderColor: COLORS.primaryBorder,
  },
  map: { flex: 1 },
  mapPlaceholder: {
    flex: 1, backgroundColor: COLORS.mapPlaceholder,
    alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  mapLabel: { fontSize: 15, color: COLORS.primaryDark },
  mapLoadingText: { fontSize: 13, color: COLORS.primaryDark },
  infoSection: {
    backgroundColor: COLORS.background, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  infoIcon: { fontSize: 16 },
  infoText: { flex: 1 },
  infoLabel: {
    fontSize: 11, color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 1,
  },
  infoValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 32,
    backgroundColor: COLORS.background,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
});

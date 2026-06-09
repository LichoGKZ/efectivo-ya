// src/app/tracking.tsx
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import Header from '../components/Header';
import StatusTimeline from '../components/StatusTimeline';
import OperatorCard from '../components/OperatorCard';
import Button from '../components/Button';
import MapViewComponent, { LatLng, MapMarker } from '../components/MapViewComponent';
import { useCurrentLocation, geocodeAddress } from '../hooks/useLocation';
import { supabase } from '../services/supabase';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type Operation = {
  id: string;
  status: string;
  type: string;
  amount: number;
  origin: string;
  destination: string;
};

const STATUS_STEPS = [
  { key: 'buscando_operador',  label: 'Buscando operador',            detail: 'Estamos asignando un operador.' },
  { key: 'operador_asignado',  label: 'Operador asignado',            detail: 'El operador confirmó la solicitud.' },
  { key: 'en_camino',          label: 'En camino al retiro',          detail: 'El operador va a buscar el dinero.' },
  { key: 'dinero_en_poder',    label: 'Dinero en poder del operador', detail: 'En camino al destino.' },
  { key: 'entregado',          label: 'Entregado',                    detail: 'Operación completada.' },
];

// Posición simulada del operador (en el futuro: realtime desde Supabase)
const SIMULATED_OPERATOR: LatLng = {
  latitude: -34.5985,
  longitude: -58.3896,
};

function buildSteps(currentStatus: string) {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatus);
  return STATUS_STEPS.map((s, i) => ({
    label: s.label,
    detail: s.detail,
    done: i < currentIndex,
    active: i === currentIndex,
  }));
}

export default function TrackingScreen() {
  const [operation, setOperation] = useState<Operation | null>(null);
  const [loading, setLoading] = useState(true);
  const [destCoord, setDestCoord] = useState<LatLng | null>(null);

  const { current: userLocation } = useCurrentLocation();

  useEffect(() => {
    loadCurrentOperation();
  }, []);

  const loadCurrentOperation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('operations')
      .select('*')
      .eq('user_id', user.id)
      .not('status', 'in', '("entregado","cancelado")')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      setOperation(data);
      subscribeToOperation(data.id);

      // Geocodificar destino de forma segura
      if (data.destination) {
        geocodeAddress(data.destination)
          .then((coord) => { if (coord) setDestCoord(coord); })
          .catch(() => {});
      }
    }
    setLoading(false);
  };

  const subscribeToOperation = (operationId: string) => {
    const channel = supabase
      .channel(`operation-${operationId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'operations', filter: `id=eq.${operationId}` },
        (payload) => {
          const updated = payload.new as Operation;
          setOperation(updated);
          if (updated.status === 'entregado') router.replace('/rate');
          if (updated.status === 'cancelado') router.replace('/home');
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  // Construir marcadores según el estado de la operación
  const buildMarkers = (): MapMarker[] => {
    if (!operation) return [];
    const markers: MapMarker[] = [];

    // Origen: ubicación del usuario
    if (userLocation) {
      markers.push({ coordinate: userLocation, type: 'origin', title: 'Origen' });
    }

    // Destino: coordenada geocodificada
    if (destCoord) {
      markers.push({ coordinate: destCoord, type: 'destination', title: 'Destino' });
    }

    // Operador visible si ya fue asignado
    if (['operador_asignado', 'en_camino', 'dinero_en_poder'].includes(operation.status)) {
      markers.push({ coordinate: SIMULATED_OPERATOR, type: 'operator', title: 'Operador' });
    }

    return markers;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (!operation) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No hay operación activa</Text>
      </View>
    );
  }

  const steps = buildSteps(operation.status);
  const markers = buildMarkers();
  const showOperator = ['operador_asignado', 'en_camino', 'dinero_en_poder'].includes(operation.status);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header title="Operación en curso" showBack />

        {/* Mapa con ruta */}
        <View style={styles.mapContainer}>
          <MapViewComponent
            markers={markers}
            showRoute={markers.length >= 2}
            style={styles.map}
          />
        </View>

        <View style={styles.statusBanner}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Tu operación está en progreso</Text>
        </View>

        {/* Monto */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Monto de la operación</Text>
          <Text style={styles.amountValue}>
            ${operation.amount.toLocaleString('es-AR')}
          </Text>
          <Text style={styles.amountRoute}>
            {operation.origin} → {operation.destination}
          </Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineCard}>
          <StatusTimeline steps={steps} />
        </View>

        {/* Operador — solo visible si ya fue asignado */}
        {showOperator && (
          <OperatorCard
            name="Juan Pérez"
            rating={4.9}
            vehicle="Toyota Etios – Blanco"
            plate="ABC123"
            onContact={() => {}}
            compact
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Operación entregada" onPress={() => router.replace('/rate')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 15, color: COLORS.textMuted },
  scroll: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 120 },
  mapContainer: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  map: { flex: 1 },
  statusBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primaryLight, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.primaryBorder,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  statusText: { fontSize: 14, fontWeight: '600', color: COLORS.primaryDark },
  amountCard: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, alignItems: 'center',
  },
  amountLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 4 },
  amountValue: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  amountRoute: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  timelineCard: {
    backgroundColor: COLORS.background, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 32,
    backgroundColor: COLORS.background,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
});

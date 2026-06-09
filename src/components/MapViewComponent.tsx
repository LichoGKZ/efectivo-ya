// src/components/MapViewComponent.tsx
// Componente reutilizable de mapa para todas las pantallas de EfectivoYa
import { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { COLORS } from '../constants/colors';

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type MapMarker = {
  coordinate: LatLng;
  type: 'origin' | 'destination' | 'operator';
  title?: string;
};

type Props = {
  markers?: MapMarker[];
  showRoute?: boolean;
  initialRegion?: Region;
  style?: object;
  onMapReady?: () => void;
};

// Región por defecto: Mar del Plata / CABA como fallback
const DEFAULT_REGION: Region = {
  latitude: -34.6037,
  longitude: -58.3816,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Emojis como marcadores nativos (sin SVG externo)
const MARKER_EMOJI: Record<MapMarker['type'], string> = {
  origin:      '🟢',
  destination: '🔴',
  operator:    '🚗',
};

export default function MapViewComponent({
  markers = [],
  showRoute = false,
  initialRegion,
  style,
  onMapReady,
}: Props) {
  const mapRef = useRef<MapView>(null);

  // Ajusta la cámara para mostrar todos los marcadores cuando cambian
  useEffect(() => {
    if (markers.length >= 2 && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          markers.map((m) => m.coordinate),
          {
            edgePadding: { top: 80, right: 60, bottom: 80, left: 60 },
            animated: true,
          }
        );
      }, 500);
    }
  }, [markers]);

  const routeCoords = showRoute ? markers.map((m) => m.coordinate) : [];

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={initialRegion ?? DEFAULT_REGION}
        onMapReady={onMapReady}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {markers.map((marker, i) => (
          <Marker
            key={i}
            coordinate={marker.coordinate}
            title={marker.title}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.markerWrapper}>
              <Text style={styles.markerEmoji}>{MARKER_EMOJI[marker.type]}</Text>
            </View>
          </Marker>
        ))}

        {showRoute && routeCoords.length >= 2 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={COLORS.primary}
            strokeWidth={3}
            lineDashPattern={[8, 4]}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: COLORS.mapPlaceholder,
  },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerEmoji: {
    fontSize: 28,
  },
});

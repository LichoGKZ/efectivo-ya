// src/hooks/useLocation.ts
// Hook reutilizable para obtener ubicación actual y geocodificar direcciones
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { LatLng } from '../components/MapViewComponent';

const MAPS_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY ?? '';

type LocationState = {
  current: LatLng | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
};

export function useCurrentLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    current: null,
    loading: true,
    error: null,
    permissionGranted: false,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState((s) => ({ ...s, loading: false, error: 'Permiso de ubicación denegado', permissionGranted: false }));
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setState({
          current: { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
          loading: false,
          error: null,
          permissionGranted: true,
        });
      } catch (e) {
        setState((s) => ({ ...s, loading: false, error: 'No se pudo obtener la ubicación' }));
      }
    })();
  }, []);

  return state;
}

/**
 * Convierte una dirección de texto a coordenadas usando Google Geocoding API.
 * Retorna null si falla o no hay key.
 */
export async function geocodeAddress(address: string): Promise<LatLng | null> {
  if (!MAPS_KEY) {
    console.warn('[useLocation] EXPO_PUBLIC_GOOGLE_MAPS_KEY no está configurada');
    return null;
  }

  try {
    const encoded = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${MAPS_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.status === 'OK' && json.results.length > 0) {
      const { lat, lng } = json.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }
    return null;
  } catch {
    return null;
  }
}
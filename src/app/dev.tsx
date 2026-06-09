// src/app/dev.tsx
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../services/supabase';
import { COLORS } from '../constants/colors';

const SCREENS = [
  { label: '1. Bienvenida',        route: '/' },
  { label: '2. Login',             route: '/login' },
  { label: '3. Home',              route: '/home' },
  { label: '4. Confirmar solicitud', route: '/request' },
  { label: '5. Seleccionar servicio', route: '/service-select' },
  { label: '6. Buscando operador', route: '/searching' },
  { label: '7. Operador asignado', route: '/operator-assigned' },
  { label: '8. Operación en curso', route: '/tracking' },
  { label: '11. Calificar',        route: '/rate' },
  { label: '12. Historial',        route: '/history' },
  { label: '14. Perfil',           route: '/profile' },
  { label: '16. Ayuda',            route: '/help' },
  { label: '18. Configuración',    route: '/settings' },
];

const STATUSES = [
  { label: '🔍 Buscando operador',          value: 'buscando_operador' },
  { label: '✅ Operador asignado',           value: 'operador_asignado' },
  { label: '🚗 En camino al retiro',         value: 'en_camino' },
  { label: '💰 Dinero en poder operador',    value: 'dinero_en_poder' },
  { label: '📦 Entregado',                   value: 'entregado' },
  { label: '❌ Cancelado',                   value: 'cancelado' },
];

export default function DevScreen() {
  const [loading, setLoading] = useState(false);
  const [currentOpId, setCurrentOpId] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);

  const loadCurrentOperation = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from('operations')
      .select('id, status')
      .eq('user_id', user.id)
      .not('status', 'in', '("entregado","cancelado")')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setCurrentOpId(data.id);
      setCurrentStatus(data.status);
    } else {
      Alert.alert('Sin operación activa', 'Creá una operación desde Home primero.');
    }
    setLoading(false);
  };

  const updateStatus = async (newStatus: string) => {
    if (!currentOpId) {
      Alert.alert('Primero cargá la operación activa');
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('operations')
      .update({ status: newStatus })
      .eq('id', currentOpId);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setCurrentStatus(newStatus);
      Alert.alert('✅ Status actualizado', `Nuevo estado: ${newStatus}`);
    }
    setLoading(false);
  };

  const clearAllOperations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('operations').delete().eq('user_id', user.id);
    setCurrentOpId(null);
    setCurrentStatus(null);
    Alert.alert('🗑 Operaciones eliminadas');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠 Dev Panel</Text>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Navegación rápida */}
        <Text style={styles.sectionTitle}>NAVEGACIÓN</Text>
        {SCREENS.map((s) => (
          <TouchableOpacity
            key={s.route}
            style={styles.btn}
            onPress={() => router.push(s.route as any)}
          >
            <Text style={styles.btnText}>{s.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Simulador de operador */}
        <Text style={styles.sectionTitle}>SIMULAR OPERADOR</Text>

        <TouchableOpacity
          style={[styles.btn, styles.btnAccent]}
          onPress={loadCurrentOperation}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.btnText}>📡 Cargar operación activa</Text>
          }
        </TouchableOpacity>

        {currentOpId && (
          <View style={styles.opInfo}>
            <Text style={styles.opInfoText}>ID: {currentOpId.slice(0, 8)}...</Text>
            <Text style={styles.opInfoText}>Status actual: <Text style={{ color: '#a0e0b0' }}>{currentStatus}</Text></Text>
          </View>
        )}

        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s.value}
            style={[
              styles.btn,
              styles.btnStatus,
              currentStatus === s.value && styles.btnStatusActive,
            ]}
            onPress={() => updateStatus(s.value)}
            disabled={loading}
          >
            <Text style={[
              styles.btnText,
              currentStatus === s.value && { color: '#fff' }
            ]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Danger zone */}
        <Text style={styles.sectionTitle}>DANGER ZONE</Text>
        <TouchableOpacity
          style={[styles.btn, styles.btnDanger]}
          onPress={clearAllOperations}
        >
          <Text style={[styles.btnText, { color: COLORS.error }]}>
            🗑 Eliminar todas las operaciones
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 20, paddingTop: 60 },
  title: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 20 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: '#666', letterSpacing: 1,
    marginTop: 24, marginBottom: 8,
  },
  btn: {
    backgroundColor: '#2d2d44', padding: 14,
    borderRadius: 10, marginBottom: 8,
  },
  btnAccent: { backgroundColor: '#1a3a2a' },
  btnStatus: { backgroundColor: '#2a2a3a' },
  btnStatusActive: { backgroundColor: COLORS.primary },
  btnDanger: { backgroundColor: '#2d1a1a', marginTop: 4 },
  btnText: { color: '#a0e0b0', fontWeight: '600', fontSize: 14 },
  opInfo: {
    backgroundColor: '#12122a', borderRadius: 8, padding: 12, marginBottom: 8,
  },
  opInfoText: { color: '#888', fontSize: 12, marginBottom: 2 },
});
// src/app/service-select.tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import Header from '../components/Header';
import Button from '../components/Button';
import { supabase } from '../services/supabase';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type ServiceCategory = 'moto' | 'auto_estandar' | 'auto_seguro' | 'especializado';

const SERVICES: {
  id: ServiceCategory;
  icon: string;
  name: string;
  desc: string;
  time: string;
  maxAmount: number;
}[] = [
  {
    id: 'moto',
    icon: '🏍️',
    name: 'Moto Express',
    desc: 'Hasta $50.000',
    time: '15 min',
    maxAmount: 50000,
  },
  {
    id: 'auto_estandar',
    icon: '🚗',
    name: 'Auto Estándar',
    desc: '$50.000 – $300.000',
    time: '20 min',
    maxAmount: 300000,
  },
  {
    id: 'auto_seguro',
    icon: '🚙',
    name: 'Auto Seguro',
    desc: '$300.000 – $1.000.000',
    time: '25 min',
    maxAmount: 1000000,
  },
  {
    id: 'especializado',
    icon: '🚐',
    name: 'Operador Especializado',
    desc: 'Más de $1.000.000',
    time: '30 min',
    maxAmount: Infinity,
  },
];

export default function ServiceSelectScreen() {
  const [selected, setSelected] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) {
      Alert.alert('Seleccioná un servicio para continuar');
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Actualizar la operación más reciente con la categoría elegida
    const { error } = await supabase
      .from('operations')
      .update({ service_category: selected })
      .eq('user_id', user.id)
      .eq('status', 'buscando_operador')
      .order('created_at', { ascending: false })
      .limit(1);

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'No se pudo actualizar el servicio. Intentá de nuevo.');
      return;
    }

    router.push('/searching');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header title="Seleccionar servicio" showBack />

        <Text style={styles.hint}>
          Elegí el servicio según el monto de tu operación.
        </Text>

        {SERVICES.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.serviceRow,
              selected === s.id && styles.serviceRowActive,
            ]}
            onPress={() => setSelected(s.id)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.serviceIcon,
              selected === s.id && styles.serviceIconActive,
            ]}>
              <Text style={{ fontSize: 22 }}>{s.icon}</Text>
            </View>

            <View style={styles.serviceInfo}>
              <Text style={[
                styles.serviceName,
                selected === s.id && styles.serviceNameActive,
              ]}>
                {s.name}
              </Text>
              <Text style={styles.serviceDesc}>{s.desc}</Text>
            </View>

            <View style={styles.serviceRight}>
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>{s.time}</Text>
              </View>
              {selected === s.id && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.autoNote}>
          La asignación del operador será automática para tu seguridad.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continuar"
          onPress={handleContinue}
          loading={loading}
          disabled={!selected}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 100,
  },
  hint: {
    fontSize: 14, color: COLORS.textSecondary, marginBottom: 20, lineHeight: 20,
  },
  serviceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.background, borderWidth: 1.5,
    borderColor: COLORS.border, borderRadius: 14,
    padding: 14, marginBottom: 10,
  },
  serviceRowActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  serviceIcon: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  serviceIconActive: {
    backgroundColor: COLORS.primary,
  },
  serviceInfo: { flex: 1 },
  serviceName: {
    fontSize: 14, fontWeight: '700', color: COLORS.text,
  },
  serviceNameActive: {
    color: COLORS.primaryDark,
  },
  serviceDesc: {
    fontSize: 12, color: COLORS.textSecondary, marginTop: 2,
  },
  serviceRight: {
    alignItems: 'center', gap: 4,
  },
  timeBadge: {
    backgroundColor: COLORS.surface, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: COLORS.border,
  },
  timeText: {
    fontSize: 12, fontWeight: '600', color: COLORS.textSecondary,
  },
  checkmark: {
    fontSize: 16, fontWeight: '800', color: COLORS.primary,
  },
  autoNote: {
    fontSize: 12, color: COLORS.textMuted, textAlign: 'center',
    marginTop: 8, paddingHorizontal: 20, lineHeight: 18,
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 32,
    backgroundColor: COLORS.background,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
});
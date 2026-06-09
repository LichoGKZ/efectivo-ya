// src/app/request.tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Header from '../components/Header';
import Button from '../components/Button';
import { supabase } from '../services/supabase';
import { COLORS } from '../constants/colors';

const TYPE_LABELS: Record<string, string> = {
  retiro_domicilio: 'Retiro en domicilio',
  entrega_direccion: 'Entrega en dirección',
  transferencia: 'Transferencia de efectivo',
  frecuentes: 'Dirección frecuente',
};

const AMOUNT = 150000;
const COMMISSION = 3000;
const TOTAL = AMOUNT + COMMISSION;

export default function RequestScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const opLabel = TYPE_LABELS[type ?? ''] ?? 'Entrega de efectivo';

  const handleConfirm = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('operations')
      .insert({
        user_id: user.id,
        type: type ?? 'entrega_direccion',
        status: 'buscando_operador',
        amount: AMOUNT,
        origin: 'Av. Colón 1234, CABA',
        destination: 'San Martín 2450, CABA',
        service_category: 'auto_estandar',
        commission: COMMISSION,
        total: TOTAL,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creando operación:', error);
      return;
    }

    router.push('/service-select');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header title="Confirmar solicitud" showBack />

        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapLabel}>🗺️ Mapa (próximamente)</Text>
        </View>

        <View style={styles.infoSection}>
          <InfoRow icon="🟢" label="Ubicación de retiro" value="Av. Colón 1234, CABA" />
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
  mapPlaceholder: {
    height: 200, borderRadius: 20, backgroundColor: COLORS.mapPlaceholder,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.primaryBorder,
  },
  mapLabel: { fontSize: 15, color: COLORS.primaryDark },
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
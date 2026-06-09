// src/app/history.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { supabase } from '../services/supabase';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type Operation = {
  id: string;
  type: string;
  status: string;
  amount: number;
  origin: string;
  destination: string;
  service_category: string;
  commission: number;
  total: number;
  created_at: string;
};

const TYPE_ICON: Record<string, string> = {
  retiro_domicilio: '🏠',
  entrega_direccion: '📍',
  transferencia: '🔄',
  frecuentes: '⭐',
};

const TYPE_LABEL: Record<string, string> = {
  retiro_domicilio: 'Retiro en domicilio',
  entrega_direccion: 'Entrega en dirección',
  transferencia: 'Transferencia',
  frecuentes: 'Dirección frecuente',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function HistoryScreen() {
  const [tab, setTab] = useState<'completadas' | 'canceladas'>('completadas');
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);

  // Recarga cada vez que la pantalla toma foco
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('operations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setOperations(data);
    setLoading(false);
  };

  const completadas = operations.filter((o) => o.status === 'entregado');
  const canceladas = operations.filter((o) => o.status === 'cancelado');
  const displayData = tab === 'completadas' ? completadas : canceladas;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Historial de operaciones</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['completadas', 'canceladas'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : displayData.length === 0 ? (
          <Text style={styles.emptyText}>
            {tab === 'completadas'
              ? 'No hay operaciones completadas todavía'
              : 'No hay operaciones canceladas'}
          </Text>
        ) : (
          displayData.map((op) => (
            <View key={op.id} style={styles.opItem}>
              <View style={styles.opIcon}>
                <Text style={{ fontSize: 20 }}>{TYPE_ICON[op.type] ?? '💸'}</Text>
              </View>
              <View style={styles.opInfo}>
                <Text style={styles.opLabel}>{TYPE_LABEL[op.type] ?? 'Operación'}</Text>
                <Text style={styles.opDate}>{formatDate(op.created_at)}</Text>
              </View>
              <Text style={styles.opAmount}>
                ${op.amount.toLocaleString('es-AR')}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 100 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 20 },
  tabs: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    borderRadius: 12, padding: 4, marginBottom: 20,
  },
  tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  tabBtnActive: {
    backgroundColor: COLORS.background,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  tabLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  tabLabelActive: { color: COLORS.text },
  opItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  opIcon: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  opInfo: { flex: 1 },
  opLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  opDate: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  opAmount: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  emptyText: { textAlign: 'center', color: COLORS.textMuted, marginTop: 40, fontSize: 14 },
});
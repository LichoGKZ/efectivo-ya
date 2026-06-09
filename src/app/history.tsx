// src/app/history.tsx  — Pantalla 12: Historial de operaciones
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { getData } from '../services/storage';
import { COLORS } from '../constants/colors';
import type { Operation } from '../types';

const TYPE_ICON: Record<string, string> = {
  retiro_domicilio: '🏠',
  entrega_direccion: '📍',
  transferencia: '🔄',
  frecuentes: '⭐',
};

const TYPE_LABEL: Record<string, string> = {
  retiro_domicilio: 'Entrega de efectivo',
  entrega_direccion: 'Retiro de efectivo',
  transferencia: 'Transferencia',
  frecuentes: 'Dirección frecuente',
};

export default function HistoryScreen() {
  const [tab, setTab] = useState<'completadas' | 'canceladas'>('completadas');
  const [operations, setOperations] = useState<Operation[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = (await getData<Operation[]>('requests')) || [];
    setOperations(data.reverse());
  };

  // Mock data para demostración
  const MOCK: Operation[] = [
    {
      id: '1', type: 'entrega_direccion', status: 'entregado',
      amount: 150000, origin: 'Av. Colón', destination: 'San Martín',
      serviceCategory: 'auto_estandar', commission: 3000, total: 153000,
      date: 'Hoy, 10:15 AM',
    },
    {
      id: '2', type: 'retiro_domicilio', status: 'entregado',
      amount: 80000, origin: 'Belgrano', destination: 'Palermo',
      serviceCategory: 'moto', commission: 1500, total: 81500,
      date: 'Ayer, 4:30 PM',
    },
    {
      id: '3', type: 'transferencia', status: 'entregado',
      amount: 25000, origin: 'Recoleta', destination: 'Caballito',
      serviceCategory: 'moto', commission: 800, total: 25800,
      date: '23 May, 2:10 PM',
    },
  ];

  const displayData = operations.length > 0 ? operations : MOCK;

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

        {/* Items */}
        {tab === 'canceladas' ? (
          <Text style={styles.emptyText}>No hay operaciones canceladas</Text>
        ) : (
          displayData.map((op) => (
            <View key={op.id} style={styles.opItem}>
              <View style={styles.opIcon}>
                <Text style={{ fontSize: 20 }}>{TYPE_ICON[op.type] ?? '💸'}</Text>
              </View>
              <View style={styles.opInfo}>
                <Text style={styles.opLabel}>{TYPE_LABEL[op.type] ?? 'Operación'}</Text>
                <Text style={styles.opDate}>{op.date}</Text>
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
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.text,
  },
  opItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  opIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opInfo: { flex: 1 },
  opLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  opDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  opAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 40,
    fontSize: 14,
  },
});

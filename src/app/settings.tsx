// src/app/settings.tsx  — Pantalla 18: Configuración
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import Header from '../components/Header';
import { COLORS } from '../constants/colors';
import { signOut } from '../services/auth';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [biometric, setBiometric] = useState(true);
  const [opPin, setOpPin] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header title="Configuración" showBack />

        <SectionTitle label="Seguridad" />
        <View style={styles.section}>
          <ToggleRow
            label="Autenticación biométrica"
            value={biometric}
            onChange={setBiometric}
          />
          <ToggleRow
            label="PIN de operaciones"
            value={opPin}
            onChange={setOpPin}
          />
          <ToggleRow
            label="Verificación en dos pasos"
            value={twoFactor}
            onChange={setTwoFactor}
          />
        </View>

        <SectionTitle label="Notificaciones" />
        <View style={styles.section}>
          <LinkRow label="Notificaciones" value="Activadas" />
        </View>

        <SectionTitle label="Preferencias" />
        <View style={styles.section}>
          <LinkRow label="Idioma" value="Español" />
          <LinkRow label="Privacidad" value="" />
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => await signOut()}
        >
          <Text style={styles.logoutText}>🚪  Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <Text style={styles.sectionTitle}>{label}</Text>
  );
}

function ToggleRow({ label, value, onChange }: {
  label: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: COLORS.primary, false: COLORS.border }}
        thumbColor="#fff"
      />
    </View>
  );
}

function LinkRow({ label, value }: { label: string; value: string }) {
  return (
    <TouchableOpacity style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Text style={styles.rowArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 2,
  },
  section: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  rowArrow: {
    fontSize: 18,
    color: COLORS.textMuted,
  },
  logoutBtn: {
    marginTop: 32,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    backgroundColor: '#FFF5F5',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.error,
  },
});

// src/app/profile.tsx  — Pantalla 14: Perfil de usuario
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import BottomNavigation from '../components/BottomNavigation';
import { COLORS } from '../constants/colors';

const MENU_ITEMS = [
  { icon: '👤', label: 'Información personal', route: null },
  { icon: '📍', label: 'Direcciones guardadas', route: null },
  { icon: '🔒', label: 'Preferencias de seguridad', route: null },
];

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Mi perfil</Text>

        {/* Card de perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Juan Pérez</Text>
            <Text style={styles.email}>juan.perez@email.com</Text>
            <TouchableOpacity>
              <Text style={styles.editLink}>Ver y editar perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Verificaciones */}
        <Text style={styles.sectionTitle}>Verificación de identidad</Text>
        <View style={styles.verifyCard}>
          <VerifyRow label="DNI validado" done />
          <VerifyRow label="Selfie validada" done />
          <VerifyRow label="Teléfono validado" detail="+54 9 1234 5678" done />
        </View>

        {/* Menú */}
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuRow}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Cerrar sesión */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.logoutText}>🚪  Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}

function VerifyRow({ label, detail, done }: { label: string; detail?: string; done: boolean }) {
  return (
    <View style={styles.verifyRow}>
      <View style={styles.verifyLeft}>
        <Text style={styles.verifyLabel}>{label}</Text>
        {detail && <Text style={styles.verifyDetail}>{detail}</Text>}
      </View>
      <Text style={done ? styles.checkDone : styles.checkPending}>
        {done ? '✅' : '⏳'}
      </Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  profileInfo: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  email: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  editLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  verifyCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
  verifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  verifyLeft: { flex: 1 },
  verifyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  verifyDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  checkDone: { fontSize: 18 },
  checkPending: { fontSize: 18 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  menuIcon: { fontSize: 18, width: 26, textAlign: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.text },
  menuArrow: { fontSize: 20, color: COLORS.textMuted },
  logoutBtn: {
    marginTop: 28,
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

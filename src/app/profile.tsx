// src/app/profile.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import BottomNavigation from '../components/BottomNavigation';
import { supabase } from '../services/supabase';
import { getCurrentProfile, signOut } from '../services/auth';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const p = await getCurrentProfile();
    if (p) {
      setProfile(p);
      setName(p.full_name ?? '');
      setPhone(p.phone ?? '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name, phone })
      .eq('id', profile.id);
    setSaving(false);
    if (error) {
      Alert.alert('Error', 'No se pudo guardar. Intentá de nuevo.');
      return;
    }
    setProfile({ ...profile, full_name: name, phone });
    setEditing(false);
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Mi perfil</Text>

        {/* Card perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile?.full_name ?? 'Sin nombre'}</Text>
            <Text style={styles.phone}>{profile?.phone ?? 'Sin teléfono'}</Text>
            <TouchableOpacity onPress={() => setEditing(!editing)}>
              <Text style={styles.editLink}>{editing ? 'Cancelar edición' : 'Editar perfil'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Formulario de edición */}
        {editing && (
          <View style={styles.editCard}>
            <Text style={styles.editLabel}>Nombre completo</Text>
            <TextInput
              style={styles.editInput}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre y apellido"
              placeholderTextColor={COLORS.textMuted}
            />
            <Text style={styles.editLabel}>Teléfono</Text>
            <TextInput
              style={styles.editInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="+54 9 ..."
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.saveBtnText}>Guardar cambios</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {/* Verificaciones */}
        <Text style={styles.sectionTitle}>Verificación de identidad</Text>
        <View style={styles.verifyCard}>
          <VerifyRow label="DNI validado" done />
          <VerifyRow label="Selfie validada" done />
          <VerifyRow label="Teléfono validado" detail={profile?.phone ?? ''} done={!!profile?.phone} />
        </View>

        {/* Menú */}
        {[
          { icon: '👤', label: 'Información personal' },
          { icon: '📍', label: 'Direcciones guardadas' },
          { icon: '🔒', label: 'Preferencias de seguridad' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuRow}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={async () => await signOut()}>
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
        {detail ? <Text style={styles.verifyDetail}>{detail}</Text> : null}
      </View>
      <Text style={{ fontSize: 18 }}>{done ? '✅' : '⏳'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 100 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 20 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.background, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: COLORS.primaryDark },
  profileInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  phone: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  editLink: { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginTop: 4 },
  editCard: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
  },
  editLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, marginBottom: 6, marginTop: 8 },
  editInput: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 15,
    color: COLORS.text, backgroundColor: COLORS.background,
  },
  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 13, alignItems: 'center', marginTop: 16,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sectionTitle: {
    fontSize: 12, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
  },
  verifyCard: {
    backgroundColor: COLORS.background, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 24, overflow: 'hidden',
  },
  verifyRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  verifyLeft: { flex: 1 },
  verifyLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  verifyDetail: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  menuIcon: { fontSize: 18, width: 26, textAlign: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.text },
  menuArrow: { fontSize: 20, color: COLORS.textMuted },
  logoutBtn: {
    marginTop: 28, paddingVertical: 14, alignItems: 'center',
    borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.error, backgroundColor: '#FFF5F5',
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: COLORS.error },
});
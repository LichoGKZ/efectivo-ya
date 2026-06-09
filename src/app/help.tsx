// src/app/help.tsx  — Pantalla 16: Ayuda
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import { COLORS } from '../constants/colors';

const HELP_TOPICS = [
  { icon: '💸', label: 'Operaciones y tarifas' },
  { icon: '🔒', label: 'Seguridad' },
  { icon: '💳', label: 'Límites de dinero' },
  { icon: '📦', label: 'Problemas con una entrega' },
  { icon: '✅', label: 'Verificación de identidad' },
  { icon: '📄', label: 'Términos y condiciones' },
];

const CONTACT = [
  { icon: '💬', label: 'Chat en vivo', detail: 'Hablá con nuestro equipo' },
  { icon: '📞', label: 'Llamar', detail: '+52 55 1234 5678' },
  { icon: '✉️', label: 'Email', detail: 'soporte@efectivoya.com' },
  { icon: '🚨', label: 'Emergencias 24/7', detail: 'Operaciones urgentes' },
  { icon: '❓', label: 'Preguntas frecuentes', detail: 'Encontrá respuestas' },
];

export default function HelpScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Ayuda</Text>
        <Text style={styles.subtitle}>¿En qué podemos ayudarte?</Text>

        {/* Temas */}
        <View style={styles.section}>
          {HELP_TOPICS.map((item, i) => (
            <TouchableOpacity key={i} style={styles.row}>
              <Text style={styles.rowIcon}>{item.icon}</Text>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contacto */}
        <Text style={styles.sectionTitle}>Estamos para ayudarte</Text>
        <View style={styles.section}>
          {CONTACT.map((c, i) => (
            <TouchableOpacity key={i} style={styles.contactRow}>
              <View style={styles.contactIcon}>
                <Text style={{ fontSize: 20 }}>{c.icon}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{c.label}</Text>
                <Text style={styles.contactDetail}>{c.detail}</Text>
              </View>
              <Text style={styles.rowArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginTop: 24,
    marginBottom: 10,
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowIcon: { fontSize: 18, width: 30 },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.text },
  rowArrow: { fontSize: 18, color: COLORS.textMuted },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  contactDetail: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
});

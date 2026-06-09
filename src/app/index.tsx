// src/app/index.tsx  — Pantalla 1: Bienvenida
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Screen from '../components/Screen';
import Button from '../components/Button';
import { COLORS } from '../constants/colors';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        {/* Logo área */}
        <View style={styles.heroArea}>
          <View style={styles.logoBox}>
            <Svg width={52} height={52} viewBox="0 0 52 52">
              <Circle cx="26" cy="26" r="26" fill="#22C55E" />
              <SvgText
                x="26"
                y="35"
                textAnchor="middle"
                fontSize="30"
                fontWeight="bold"
                fill="white"
              >
                $
              </SvgText>
            </Svg>
          </View>
          <Text style={styles.appName}>Efectivo Ya</Text>
          <Text style={styles.tagline}>Tu dinero, al instante.</Text>
        </View>

        {/* Acciones */}
        <View style={styles.actions}>
          <Button
            title="Iniciar sesión"
            onPress={() => router.push('/login')}
          />

          <View style={styles.spacer} />

          <Button
            title="Crear cuenta"
            onPress={() => router.push('/register')}
            variant="outline"
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O continuá con</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons
                name="logo-google"
                size={24}
                color={COLORS.text}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons
                name="logo-apple"
                size={24}
                color={COLORS.text}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons
                name="call-outline"
                size={22}
                color={COLORS.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  heroArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logoBox: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  logoSymbol: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.textOnPrimary,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  actions: {
    gap: 0,
  },
  spacer: { height: 12 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
});

// src/app/forgot-password.tsx
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { supabase } from '../services/supabase';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Ingresá tu correo electrónico');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: 'efectivoya://reset-password',
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <Screen>
        <Header title="Recuperar contraseña" showBack />
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>📧</Text>
          <Text style={styles.successTitle}>Revisá tu correo</Text>
          <Text style={styles.successText}>
            Te enviamos un link a <Text style={styles.emailHighlight}>{email}</Text> para
            restablecer tu contraseña.
          </Text>
          <Text style={styles.successHint}>
            Si no lo ves, revisá tu carpeta de spam.
          </Text>
          <Button
            title="Volver al inicio"
            onPress={() => router.replace('/login')}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Recuperar contraseña" showBack />
      <View style={styles.container}>
        <Text style={styles.description}>
          Ingresá tu correo y te enviamos un link para restablecer tu contraseña.
        </Text>
        <Input
          label="Correo electrónico"
          placeholder="tu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={{ marginTop: 8 }}>
          <Button
            title="Enviar link"
            onPress={handleSend}
            loading={loading}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  description: {
    fontSize: 14, color: COLORS.textSecondary,
    lineHeight: 20, marginBottom: 24,
  },
  successContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 8,
  },
  successIcon: { fontSize: 56, marginBottom: 20 },
  successTitle: {
    fontSize: 22, fontWeight: '800', color: COLORS.text,
    marginBottom: 12, textAlign: 'center',
  },
  successText: {
    fontSize: 15, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 22, marginBottom: 8,
  },
  emailHighlight: { color: COLORS.primary, fontWeight: '600' },
  successHint: {
    fontSize: 13, color: COLORS.textMuted,
    textAlign: 'center', marginBottom: 32,
  },
});
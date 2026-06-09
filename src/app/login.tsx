// src/app/login.tsx
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import Screen from '../components/Screen';
import Input from '../components/Input';
import Button from '../components/Button';
import { supabase } from '../services/supabase';
import { COLORS } from '../constants/colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    const newErrors = { email: '', password: '' };
    let valid = true;
    if (!email.trim()) { newErrors.email = 'Ingresá tu correo'; valid = false; }
    if (!password.trim()) { newErrors.password = 'Ingresá tu contraseña'; valid = false; }
    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos'
        : error.message
      );
      return;
    }
    router.replace('/home');
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Bienvenido de nuevo</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Correo electrónico"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Input
            label="Contraseña"
            placeholder="Tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 8 }}>
            <Button title="Iniciar sesión" onPress={handleLogin} loading={loading} />
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerRow}>
          <Text style={styles.registerText}>
            ¿No tenés cuenta? <Text style={styles.registerLink}>Crear cuenta</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  topSection: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary },
  form: { gap: 0 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -8, marginBottom: 16 },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  registerRow: { alignItems: 'center', marginTop: 24 },
  registerText: { fontSize: 14, color: COLORS.textSecondary },
  registerLink: { color: COLORS.primary, fontWeight: '700' },
});
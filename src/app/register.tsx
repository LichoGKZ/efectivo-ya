// src/app/register.tsx
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import Screen from '../components/Screen';
import Input from '../components/Input';
import Button from '../components/Button';
import Header from '../components/Header';
import { supabase } from '../services/supabase';
import { COLORS } from '../constants/colors';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Completá todos los campos obligatorios');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone },
      },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    // Supabase manda email de confirmación — podés desactivarlo en Auth settings
    router.replace('/home');
  };

  return (
    <Screen scroll>
      <Header title="Crear cuenta" showBack />
      <View style={styles.form}>
        <Input label="Nombre completo" placeholder="Tu nombre y apellido" value={name} onChangeText={setName} />
        <Input label="Correo electrónico" placeholder="tu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Input label="Teléfono" placeholder="+54 9 ..." value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Input label="Contraseña" placeholder="Mínimo 8 caracteres" value={password} onChangeText={setPassword} secureTextEntry />
        <View style={{ marginTop: 8 }}>
          <Button title="Crear cuenta" onPress={handleRegister} loading={loading} />
        </View>
      </View>
      <TouchableOpacity onPress={() => router.back()} style={styles.loginRow}>
        <Text style={styles.loginText}>
          ¿Ya tenés cuenta? <Text style={styles.loginLink}>Iniciar sesión</Text>
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 8 },
  loginRow: { alignItems: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: COLORS.textSecondary },
  loginLink: { color: COLORS.primary, fontWeight: '700' },
});
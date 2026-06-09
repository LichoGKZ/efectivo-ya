// src/app/register.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import Screen from '../components/Screen';
import Input from '../components/Input';
import Button from '../components/Button';
import Header from '../components/Header';
import { COLORS } from '../constants/colors';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    // TODO: backend
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.replace('/home');
  };

  return (
    <Screen scroll>
      <Header title="Crear cuenta" showBack />

      <View style={styles.form}>
        <Input
          label="Nombre completo"
          placeholder="Tu nombre y apellido"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Correo electrónico"
          placeholder="tu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Teléfono"
          placeholder="+54 9 ..."
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Input
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={{ marginTop: 8 }}>
          <Button
            title="Crear cuenta"
            onPress={handleRegister}
            loading={loading}
          />
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

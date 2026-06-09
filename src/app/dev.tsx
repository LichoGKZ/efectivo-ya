// src/app/dev.tsx — Panel de desarrollo (solo en debug)
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { removeData } from '../services/storage';
import { COLORS } from '../constants/colors';

const SCREENS = [
  { label: '1. Bienvenida', route: '/' },
  { label: '2. Login', route: '/login' },
  { label: '3. Home', route: '/home' },
  { label: '4. Confirmar solicitud', route: '/request' },
  { label: '5. Seleccionar servicio', route: '/service-select' },
  { label: '6. Buscando operador', route: '/searching' },
  { label: '7. Operador asignado', route: '/operator-assigned' },
  { label: '8. Operación en curso', route: '/tracking' },
  { label: '11. Calificar', route: '/rate' },
  { label: '12. Historial', route: '/history' },
  { label: '14. Perfil', route: '/profile' },
  { label: '16. Ayuda', route: '/help' },
  { label: '18. Configuración', route: '/settings' },
];

export default function DevScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠 Dev Panel</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {SCREENS.map((s) => (
          <TouchableOpacity
            key={s.route}
            style={styles.btn}
            onPress={() => router.push(s.route as any)}
          >
            <Text style={styles.btnText}>{s.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.btn, styles.btnDanger]}
          onPress={async () => {
            await removeData('requests');
            await removeData('current_operation');
            alert('Storage limpiado');
          }}
        >
          <Text style={[styles.btnText, { color: COLORS.error }]}>
            🗑 Limpiar Storage
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 20, paddingTop: 60 },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#2d2d44',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  btnDanger: {
    backgroundColor: '#2d1a1a',
    marginTop: 12,
  },
  btnText: {
    color: '#a0e0b0',
    fontWeight: '600',
    fontSize: 14,
  },
});

// src/app/rate.tsx  — Pantalla 11: Calificar servicio
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import Button from '../components/Button';
import { COLORS } from '../constants/colors';

export default function RateScreen() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo fue tu operación?</Text>

      {/* Avatar operador */}
      <View style={styles.avatarBox}>
        <Text style={styles.avatarText}>J</Text>
      </View>
      <Text style={styles.operatorName}>Juan Pérez</Text>

      {/* Estrellas */}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.star, rating >= star && styles.starActive]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Comentario */}
      <TextInput
        placeholder="Agregá un comentario (opcional)"
        placeholderTextColor={COLORS.textMuted}
        value={comment}
        onChangeText={setComment}
        multiline
        style={styles.textArea}
      />

      <Button
        title="Enviar calificación"
        onPress={handleSubmit}
        loading={loading}
        disabled={rating === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 28,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 28,
    textAlign: 'center',
  },
  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  operatorName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  star: {
    fontSize: 40,
    color: COLORS.starInactive,
  },
  starActive: {
    color: COLORS.starActive,
  },
  textArea: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: COLORS.text,
    minHeight: 90,
    marginBottom: 24,
    textAlignVertical: 'top',
    backgroundColor: COLORS.surface,
  },
});

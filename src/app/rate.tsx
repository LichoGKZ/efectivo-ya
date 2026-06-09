// src/app/rate.tsx
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Alert, ActivityIndicator
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import Button from '../components/Button';
import { supabase } from '../services/supabase';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function RateScreen() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);

  useEffect(() => {
    loadLastOperation();
  }, []);

  const loadLastOperation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Busca la última operación entregada sin calificación
    const { data } = await supabase
      .from('operations')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'entregado')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) setOperationId(data.id);
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !operationId) {
      setLoading(false);
      router.replace('/home');
      return;
    }

    const { error } = await supabase.from('ratings').insert({
      operation_id: operationId,
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'No se pudo guardar la calificación. Intentá de nuevo.');
      return;
    }

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
          <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
            <Text style={[styles.star, rating >= star && styles.starActive]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>

      {rating > 0 && (
        <Text style={styles.ratingLabel}>
          {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][rating]}
        </Text>
      )}

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

      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => router.replace('/home')}
      >
        <Text style={styles.skipText}>Omitir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: COLORS.background,
    paddingHorizontal: 28, paddingTop: 80, alignItems: 'center',
  },
  title: {
    fontSize: 22, fontWeight: '800', color: COLORS.text,
    marginBottom: 28, textAlign: 'center',
  },
  avatarBox: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: COLORS.primaryDark },
  operatorName: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 20 },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  star: { fontSize: 44, color: COLORS.starInactive },
  starActive: { color: COLORS.starActive },
  ratingLabel: {
    fontSize: 14, fontWeight: '600', color: COLORS.textSecondary,
    marginBottom: 20,
  },
  textArea: {
    width: '100%', borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 12, padding: 14, fontSize: 14, color: COLORS.text,
    minHeight: 90, marginBottom: 24, textAlignVertical: 'top',
    backgroundColor: COLORS.surface,
  },
  skipBtn: { marginTop: 12, padding: 8 },
  skipText: { fontSize: 14, color: COLORS.textMuted, fontWeight: '500' },
});
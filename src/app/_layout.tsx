// src/app/_layout.tsx
import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { supabase } from '../services/supabase';

export default function Layout() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/home');
      }
      setChecked(true);
    });

    // Escuchar cambios de sesión en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/home');
      } else {
        router.replace('/');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!checked) return null; // Splash mientras verifica sesión

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
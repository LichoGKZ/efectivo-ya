// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://yekyumjgdcfvcnumatzk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlla3l1bWpnZGNmdmNudW1hdHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NjU5NzQsImV4cCI6MjA5NjU0MTk3NH0.-FUPgg6W-CogKfdbz0AMiFDnUD7tzaz98WzF88OwNkY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 
// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveData(key: string, value: any): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('[storage] saveData error:', error);
  }
}

export async function getData<T = any>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) return JSON.parse(value) as T;
    return null;
  } catch (error) {
    console.error('[storage] getData error:', error);
    return null;
  }
}

export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('[storage] removeData error:', error);
  }
}

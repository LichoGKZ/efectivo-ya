import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveData(
  key: string,
  value: any
) {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.log(error);
  }
}

export async function getData(
  key: string
) {
  try {
    const value =
      await AsyncStorage.getItem(key);

    if (value !== null) {
      return JSON.parse(value);
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function removeData(
  key: string
) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
}
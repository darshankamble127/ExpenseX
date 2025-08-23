import AsyncStorage from "@react-native-async-storage/async-storage";

// Save
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log("Error storing data", e);
  }
};

// Get
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.log("Error getting data", e);
    return null;
  }
};

// Remove
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log("Error removing data", e);
  }
};

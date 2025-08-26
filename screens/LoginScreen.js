import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { storeData } from "../utils/storage";

const StartScreen = ({ navigation }) => {
  const [name, setName] = useState("");

  // Generate unique key (name + random string)
  const generateUniqueKey = (name) => {
    const randomStr = Math.random().toString(36).substring(2, 8); // random letters/numbers
    const randomNum = Date.now().toString().slice(-4); // last 4 digits of timestamp
    return `${name}_${randomStr}${randomNum}`;
  };

  const handleGetStarted = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    const uniqueKey = generateUniqueKey(name);
    await storeData("uniqueKey", uniqueKey);
    await storeData("name", name);

    navigation.reset({
      index: 0,
      routes: [{ name: "LoaderScreen" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Enter your name to get started</Text>

      <TextInput
        placeholder="Your Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    width: "100%",
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

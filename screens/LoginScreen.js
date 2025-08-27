import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { storeData } from "../utils/storage";

const StartScreen = ({ navigation }) => {
  const [name, setName] = useState("");

  // Generate unique ID (all lowercase, no spaces, short length)
  const generateUniqueKey = (name) => {
    const cleanName = name.toLowerCase().replace(/\s+/g, "");
    const randomStr = Math.random().toString(36).substring(2, 6);
    return `${cleanName}${randomStr}`;
  };

  const handleGetStarted = async () => {
    if (!name.trim()) {
      Alert.alert("Oops!", "Please enter your name to continue.");
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome to ExpenseX</Text>
        <Text style={styles.subtitle}>
          Track your expenses, stay in control of your money
        </Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter your full name</Text>
        <TextInput
          placeholder="e.g. John Doe"
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoFocus
        />
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started →</Text>
      </TouchableOpacity>

      {/* Footer Info */}
      <Text style={styles.footer}>
        🔒 Your data stays private on this device only.
      </Text>
    </KeyboardAvoidingView>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    marginBottom: 50,
    alignItems: "center",
  },
  welcome: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1.2,
    borderColor: "#ddd",
    padding: 14,
    fontSize: 16,
    // borderRadius: 10,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 16,
    // borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    marginTop: 25,
    fontSize: 13,
    textAlign: "center",
    color: "#777",
  },
});

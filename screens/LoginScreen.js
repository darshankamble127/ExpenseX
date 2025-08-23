import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { storeData } from "../utils/storage";

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  // Generate unique key (username + random string)
  const generateUniqueKey = (username) => {
    const randomStr = Math.random().toString(36).substring(2, 8); // random letters/numbers
    const randomNum = Date.now().toString().slice(-4); // last 4 digits of timestamp
    return `${username}_${randomStr}${randomNum}`;
  };

  // Register logic
  const handleRegister = async () => {
    if (!name || !username) {
      Alert.alert("Error", "Please enter both Name and Username");
      return;
    }
    const uniqueKey = generateUniqueKey(username);
    await storeData("uniqueKey", uniqueKey);
    await storeData("name", name);
    await storeData("username", username);

    // redirect to LoaderScreen
    navigation.reset({
      index: 0,
      routes: [{ name: "LoaderScreen" }],
    });
  };

  // Login logic (DB connection will be added later)
  const handleLogin = async () => {
    Alert.alert("Todo", "Login with DB connection will be implemented later");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Enter Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Enter Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <Button title="Register" onPress={handleRegister} />

      <View style={{ marginTop: 40 }} />
      <Text style={styles.title}>Login</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
});

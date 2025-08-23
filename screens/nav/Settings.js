import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { getData, removeData } from "../../utils/storage";

const Settings = ({ navigation }) => {
  const [uniqueKey, setUniqueKey] = useState("");

  useEffect(() => {
    const fetchKey = async () => {
      const key = await getData("uniqueKey");
      setUniqueKey(key || "No key found");
    };
    fetchKey();
  }, []);

  const handleClearKey = async () => {
    await removeData("uniqueKey");
    navigation.reset({
      index: 0,
      routes: [{ name: "LoaderScreen" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.keyText}>Unique Key: {uniqueKey}</Text>
      <Button title="Clear Key & Logout" onPress={handleClearKey} />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  keyText: { fontSize: 16, marginBottom: 20 },
});

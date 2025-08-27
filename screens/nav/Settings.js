import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getData } from "../../utils/storage";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = ({ navigation }) => {
  const [uniqueKey, setUniqueKey] = useState("");
  const [userName, setUserName] = useState("John Doe");

  useEffect(() => {
    const fetchKey = async () => {
      const key = await getData("uniqueKey");
      const name = await getData("name");

      setUniqueKey(key || "no-id");
      setUserName(name || "No Name");
    };
    fetchKey();
  }, []);

  const handleDeleteAndReset = () => {
    Alert.alert(
      "Confirm Reset",
      "Are you sure you want to delete all data and restart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              console.log("All data deleted ✅");
              navigation.reset({
                index: 0,
                routes: [{ name: "LoaderScreen" }],
              });
            } catch (error) {
              console.log("Error clearing data", error);
            }
          },
        },
      ]
    );
  };

  const handleProVersion = () =>
    Alert.alert("Pro version coming soon!");
  const handleLikeApp = () =>
    Alert.alert("Thanks for liking the app!");
  const handleHelp = () =>
    Alert.alert("Help section not ready yet.");
  const handleFeedback = () =>
    Alert.alert("Feedback option not ready yet.");

  return (
    <View style={styles.container}>
      {/* Top black section */}
      <View style={styles.topBox}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* User Info */}
      <View style={styles.userBox}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userId}>ID: {uniqueKey}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsBox}>
        <OptionItem
          icon="trash-bin"
          text="Delete & Reset"
          onPress={handleDeleteAndReset}
        />
        <OptionItem
          icon="star"
          text="Pro Version"
          onPress={handleProVersion}
        />
        <OptionItem
          icon="heart"
          text="Like this App"
          onPress={handleLikeApp}
        />
        <OptionItem
          icon="help-circle"
          text="Help"
          onPress={handleHelp}
        />
        <OptionItem
          icon="chatbox"
          text="Feedback"
          onPress={handleFeedback}
        />
      </View>
    </View>
  );
};

const OptionItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Ionicons
      name={icon}
      size={22}
      color="black"
      style={{ marginRight: 10 }}
    />
    <Text style={styles.optionText}>{text}</Text>
  </TouchableOpacity>
);

export default Settings;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  topBox: {
    height: "25%",
    backgroundColor: "black",
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "white" },

  userBox: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  userName: { fontSize: 18, fontWeight: "600" },
  userId: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },

  optionsBox: { paddingHorizontal: 20 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: { fontSize: 16 },
});

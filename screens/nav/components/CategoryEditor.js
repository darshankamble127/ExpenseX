import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CategoryEditor({
  modalVisible,
  setModalVisible,
  imageUrl,
  title,
  STORAGE_KEY,
}) {
  const [categoriesData, setCategoriesData] = useState({ income: [], expense: [] });
  const [newTitle, setNewTitle] = useState(title);
  const [selectedIcon, setSelectedIcon] = useState(imageUrl);

  const iconsList = [
    "https://notebook-covers.s3.us-west-2.amazonaws.com/d7b60dc582c57e0ba5043bd4be90a158",
    "https://notebook-covers.s3.us-west-2.amazonaws.com/05447a975db2b5bb4397386c5c2fdc29",
    "https://notebook-covers.s3.us-west-2.amazonaws.com/39b121b3665570fde815cc5b003dfd85",
    "https://notebook-covers.s3.us-west-2.amazonaws.com/92f17ac11682913ee5640c2c8c8b1dfc",
  ];

  // Load categories
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCategoriesData(JSON.parse(stored));
        }
      } catch (err) {
        console.log("Error:", err);
      }
    };
    load();
  }, []);

  // Update category
  const handleUpdate = async () => {
    let updated = { ...categoriesData };
    let found = false;

    ["income", "expense"].forEach((type) => {
      updated[type] = updated[type].map((item) => {
        if (item.title === title && item.imageUrl === imageUrl) {
          found = true;
          return {
            ...item,
            title: newTitle || item.title,
            imageUrl: selectedIcon || item.imageUrl,
          };
        }
        return item;
      });
    });

    if (!found) {
      Alert.alert("Category not found!");
      return;
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setCategoriesData(updated);
      Alert.alert("Updated successfully!");
      setModalVisible(false);
    } catch (err) {
      console.log("Error saving:", err);
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.header}>Edit Category</Text>

          <TextInput
            placeholder="New title"
            value={newTitle}
            onChangeText={setNewTitle}
            style={styles.input}
          />

          <View style={{ flexDirection: "row", marginVertical: 10, flexWrap: "wrap" }}>
            {iconsList.map((url, i) => (
              <TouchableOpacity key={i} onPress={() => setSelectedIcon(url)}>
                <Image
                  source={{ uri: url }}
                  style={[
                    styles.icon,
                    selectedIcon === url && { borderColor: "blue", borderWidth: 2 },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={{ color: "#fff" }}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "gray", marginTop: 10 }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "#fff" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "black",
    padding: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginBottom: 10,
  },
});

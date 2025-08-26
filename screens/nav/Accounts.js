import React, { useEffect, useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  Keyboard,
} from "react-native";
import Card from "./components/AccountCard";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const STORAGE_KEY = "@accounts_data";
const { height } = Dimensions.get("window");

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newBalance, setNewBalance] = useState("");
  const inputRef = useRef(null);

  const loadAccounts = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAccounts(JSON.parse(stored));
      } else {
        const defaultAccounts = [
          {
            name: "Card",
            balance: 0,
            imageUrl:
              "https://notebook-covers.s3.us-west-2.amazonaws.com/d7b60dc582c57e0ba5043bd4be90a158",
          },
          {
            name: "Cash",
            balance: 0,
            imageUrl:
              "https://notebook-covers.s3.us-west-2.amazonaws.com/05447a975db2b5bb4397386c5c2fdc29",
          },
          {
            name: "Savings",
            balance: 0,
            imageUrl:
              "https://notebook-covers.s3.us-west-2.amazonaws.com/39b121b3665570fde815cc5b003dfd85",
          },
        ];
        setAccounts(defaultAccounts);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAccounts));
      }
    } catch (err) {
      console.log("Error loading accounts:", err);
    }
  };

  const handleSaveBalance = async () => {
    if (newBalance === "" || isNaN(newBalance)) {
      Alert.alert("Error", "Please enter a valid number");
      return;
    }

    const updatedAccounts = accounts.map((acc) =>
      acc.name === selectedAccount.name
        ? { ...acc, balance: parseFloat(newBalance) }
        : acc
    );

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
      setAccounts(updatedAccounts);
      setSelectedAccount(null);
      setNewBalance("");
    } catch (err) {
      console.log("Error saving:", err);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Focus + Select input when modal opens
  useEffect(() => {
    if (selectedAccount) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelection?.(0, newBalance.length); // select all text
        }
      }, 300);
    }
  }, [selectedAccount]);

  useEffect(() => {
    loadAccounts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Black Box - 25% of screen */}
      <View style={styles.overallContainer}>
        <Text style={styles.overallText}>Total Balance</Text>
        <Text style={styles.balance}>
          {totalBalance > 0
            ? `₹${totalBalance}`
            : `-₹${Math.abs(totalBalance)}`}
        </Text>
      </View>

      {/* Accounts List */}
      <Text style={styles.header}>Accounts</Text>
      <View style={styles.CardContainer}>
        {accounts.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedAccount(item);
              setNewBalance(item.balance.toString());
            }}
          >
            <Card
              title={item.name}
              value={item.balance.toFixed(2)}
              imageUrl={item.imageUrl}
            />
          </TouchableOpacity>
        ))}
        {/* <View style={styles.card}>
          <TouchableOpacity style={styles.tab}>
            <MaterialIcons
              name="add-circle-outline"
              size={24}
              color="#212224"
            />
            <Text style={{ marginLeft: 10 }}>Add New Account</Text>
          </TouchableOpacity>
        </View> */}
      </View>

      {/* Modal */}
      <Modal visible={!!selectedAccount} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Edit {selectedAccount?.name} Balance
            </Text>
            <TextInput
              ref={inputRef}
              value={newBalance}
              onChangeText={setNewBalance}
              keyboardType="numeric"
              style={styles.input}
              selectTextOnFocus // makes sure text is selected
            />

            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { borderColor: "#ccc", borderWidth: 1, marginRight: 10 },
                ]}
                onPress={() => setSelectedAccount(null)}
              >
                <Text style={{ color: "#000000ff" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "black" }]}
                onPress={handleSaveBalance}
              >
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overallContainer: {
    height: height * 0.25,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingTop: 50,
    alignItems: "center",
  },
  overallText: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 0,
    fontWeight: "bold",
  },
  balance: {
    fontSize: 22,
    color: "#107503",
    fontWeight: "bold",
  },
  header: {
    fontSize: 19,
    marginVertical: 10,
    paddingHorizontal: 8,
  },
  CardContainer: {
    paddingHorizontal: 8,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    marginBottom: 100,
    padding: 8,
    borderWidth: 1.3,
    borderColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
});

import React, { useEffect, useCallback, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import Card from "./components/AccountCard";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const STORAGE_KEY = "@accounts_data";

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);

    const loadAccounts = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setAccounts(JSON.parse(stored));
                // console.log("Loaded accounts from storage.", JSON.parse(stored));
            } else {
                // If no accounts in storage, preload with default
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

    // Add new account (for now a dummy, later you can open modal with input)
    const handleAddAccount = async () => {
        // const newAccount = {
        //   name: "New Account",
        //   balance: 0,
        //   imageUrl:
        //     "https://notebook-covers.s3.us-west-2.amazonaws.com/92f17ac11682913ee5640c2c8c8b1dfc",
        // };
        // const updated = [...accounts, newAccount];
        // setAccounts(updated);
        // try {
        //   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        // } catch (err) {
        //   console.log("Error saving account:", err);
        // }
        // Alert.alert("Added", "New account added successfully!");
    };

    // Total calculation
    //   const totalIncome = 5000; // you can calculate later from transactions
    //   const totalExpense = 800;
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);


    // Load accounts from storage
    useEffect(() => {
        loadAccounts();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadAccounts();
        }, [])
    );



    //   accounts!=AsyncStorage.getItem(STORAGE_KEY))

    return (
        <ScrollView vertical={true} style={styles.container}>
            <Text style={styles.header}>Overall</Text>
            <View style={styles.soFarTotal}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        // borderBottomWidth: 1,
                        borderBottomColor: "#212224",
                        marginHorizontal: 30,
                        alignItems: "center",
                    }}
                >
                    {/* <View style={styles.incomeContainer}>
            <Text style={styles.title}>INCOME SO FAR</Text>
            <Text style={styles.income}>RS {totalIncome}</Text>
          </View>
          <Text>-</Text>
          <View style={styles.expensesContainer}>
            <Text style={styles.title}>EXPENSE SO FAR</Text>
            <Text style={styles.expenses}>RS {totalExpense}</Text>
          </View> */}
                </View>
                <View style={styles.balanceContainer}>
                    <View>
                        <Text style={styles.title}>TOTAL BALANCE</Text>
                        <Text style={styles.balance}>RS {totalBalance}</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.header}>Accounts</Text>
            <View style={styles.CardContainer}>
                {accounts.map((item, index) => (
                    <Card
                        key={index}
                        title={item.name}
                        value={item.balance.toFixed(2)}
                        imageUrl={item.imageUrl}
                    />
                ))}
                <View style={styles.card}>
                    <TouchableOpacity style={styles.tab} onPress={handleAddAccount}>
                        <MaterialIcons
                            name="add-circle-outline"
                            size={24}
                            color="#212224"
                        />
                        <Text style={{ marginLeft: 10 }}>Add New Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        flex: 1,
        paddingTop: 50,
        backgroundColor: "#fff",
    },
    CardContainer: {
        display: "flex",
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
        borderColor: "#212224",
    },
    header: {
        fontSize: 17,
        marginBottom: 5,
    },
    soFarTotal: {
        width: "100%",
        borderColor: "#212224",
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
    },
    expensesContainer: {
        marginBottom: 10,
    },
    incomeContainer: {
        marginBottom: 10,
    },
    balanceContainer: {
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 17,
    },
    balance: {
        fontSize: 17,
        color: "#006b00",
    },
    income: {
        fontSize: 17,
        color: "#006b00",
    },
    expenses: {
        fontSize: 17,
        color: "#c60000",
    },
});

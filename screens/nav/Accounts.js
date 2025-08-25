import React, { useEffect, useCallback, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import Card from "./components/AccountCard";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const STORAGE_KEY = "@accounts_data";
const { height } = Dimensions.get("window");

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);

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
                await AsyncStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(defaultAccounts)
                );
            }
        } catch (err) {
            console.log("Error loading accounts:", err);
        }
    };

    const handleAddAccount = async () => {
        // Add account logic later
    };

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

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
                <Text style={styles.balance}>  {totalBalance>0?`₹${totalBalance}`:`-₹${Math.abs(totalBalance)}`}</Text>
            </View>

            {/* Accounts List */}
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
                {/* <View style={styles.card}>
                    <TouchableOpacity style={styles.tab} onPress={handleAddAccount}>
                        <MaterialIcons
                            name="add-circle-outline"
                            size={24}
                            color="#212224"
                        />
                        <Text style={{ marginLeft: 10 }}>Add New Account</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overallContainer: {
        height: height * 0.25, // 25% of screen height
        backgroundColor: "#000000ff",
        justifyContent: "center",
        paddingTop: 50,
        alignItems: "center",
    },
    overallText: {
        fontSize: 24,
        color: "#ffffffff",
        marginBottom: 0,
        fontWeight: "bold",
    },
    balance: {
        fontSize: 22,
        color: "#107503ff",
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
});

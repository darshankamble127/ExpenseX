import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "transactions";

export default function TransactionModal({ modalVisible, setModalVisible, onSave }) {
    const [type, setType] = useState("expense");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [account, setAccount] = useState("");
    const [notes, setNotes] = useState(""); // New notes field
    const [isIncludedInTotal, setIsIncludedInTotal] = useState(true);

    const handleSave = async () => {
        const now = new Date();
        const dateKey = now.toLocaleDateString();
        const newTransaction = {
            type,
            category,
            amount: parseFloat(amount),
            account,
            notes, 
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
            isIncludedInTotal,
            imageUrl: "https://notebook-covers.s3.us-west-2.amazonaws.com/d7b60dc582c57e0ba5043bd4be90a158", // example image
        };

        // Read existing data
        let data = {};
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                data = JSON.parse(stored);
            }
        } catch (err) {
            console.log("Error reading AsyncStorage:", err);
        }

        // Update transactions for the date
        const existing = data[dateKey] || { transactions: [], total: 0 };
        const updatedTransactions = [...existing.transactions, newTransaction];
        const total = updatedTransactions.reduce(
            (sum, tx) => sum + (tx.isIncludedInTotal ? (tx.type === "expense" ? -tx.amount : tx.amount) : 0),
            0
        );
        data[dateKey] = { transactions: updatedTransactions, total };
        console.log("Updated data:", data);
        // Write back to AsyncStorage
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (err) {
            console.log("Error writing AsyncStorage:", err);
        }

        setModalVisible(false);
        // Reset form
        setCategory("");
        setAmount("");
        setAccount("");
        setNotes(""); // Reset notes
        setType("expense");
        setIsIncludedInTotal(true);
    };

    return (
        <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Add Transaction</Text>

                    {/* Type */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Type:</Text>
                        <TouchableOpacity
                            style={[styles.chip, type === "expense" && styles.chipActive]}
                            onPress={() => setType("expense")}
                        >
                            <Text style={type === "expense" ? styles.chipTextActive : styles.chipText}>
                                Expense
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.chip, type === "income" && styles.chipActive]}
                            onPress={() => setType("income")}
                        >
                            <Text style={type === "income" ? styles.chipTextActive : styles.chipText}>
                                Income
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Category */}
                    <TextInput
                        placeholder="Category (e.g. Food)"
                        value={category}
                        onChangeText={setCategory}
                        style={styles.input}
                    />

                    {/* Amount */}
                    <TextInput
                        placeholder="Amount"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    {/* Account */}
                    <TextInput
                        placeholder="Account (e.g. Card)"
                        value={account}
                        onChangeText={setAccount}
                        style={styles.input}
                    />

                    {/* Notes */}
                    <TextInput
                        placeholder="Notes"
                        value={notes}
                        onChangeText={setNotes}
                        style={styles.input}
                    />

                    {/* Include in total */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Include in Total:</Text>
                        <Switch
                            value={isIncludedInTotal}
                            onValueChange={setIsIncludedInTotal}
                        />
                    </View>

                    {/* Buttons */}
                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                            <Text style={{ color: "#fff" }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={{ color: "#fff" }}>Save</Text>
                        </TouchableOpacity>
                    </View>
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
    modalContent: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        elevation: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    label: {
        fontSize: 15,
        marginRight: 10,
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 8,
    },
    chipActive: {
        backgroundColor: "#000",
        borderColor: "#000",
    },
    chipText: {
        color: "#000",
    },
    chipTextActive: {
        color: "#fff",
    },
    btnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    closeBtn: {
        backgroundColor: "gray",
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 5,
        alignItems: "center",
    },
    saveBtn: {
        backgroundColor: "black",
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 5,
        alignItems: "center",
    },
});

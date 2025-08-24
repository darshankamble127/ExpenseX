import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Switch, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { applyTxToAccounts } from "./applyTxToAccounts";
import TMCategoris from "./TMCategoris";

const STORAGE_KEY = "transactions";

export default function TransactionModal({ modalVisible, setModalVisible, onSave }) {
    const [type, setType] = useState("expense");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [account, setAccount] = useState("Card");
    const [accounts, setAccounts] = useState([]);
    const [notes, setNotes] = useState(""); // New notes field
    const [isIncludedInTotal, setIsIncludedInTotal] = useState(true);
    const [imageUrl, setImageUrl] = useState("https://notebook-covers.s3.us-west-2.amazonaws.com/d7b60dc582c57e0ba5043bd4be90a158");

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
            imageUrl,
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
        // console.log("Updated data:", data);
        // Write back to AsyncStorage
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            // if it is stored successfully then add to account balance
            await applyTxToAccounts(newTransaction); // <-- add this line

        } catch (err) {
            console.log("Error writing AsyncStorage:", err);
        }

        setModalVisible(false);
        // Reset form
        setCategory("");
        setAmount("");
        setAccount("Card");
        setNotes(""); // Reset notes
        setType("expense");
        setIsIncludedInTotal(true);
    };
    const accCall = async () => {
        const stored = await AsyncStorage.getItem("@accounts_data");
        if (stored)
            setAccounts(JSON.parse(stored));
    }

    const inputRef = useRef(null);

    useEffect(() => {
        if (modalVisible) {
            // Give a small delay so modal is fully mounted
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    // Keyboard.dismiss(); // ensure no other keyboard instance
                    // Keyboard.scheduleLayoutAnimation?.();
                }
            }, 300);
        }
    }, [modalVisible]);

    useEffect(() => {
        accCall();
    }, [])


    return (
        <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Add Transaction</Text>

                    {/* Type */}
                    <View style={styles.row}>
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

                    {/* Amount at bottom */}
                    {/* Amount Input */}
                    <View style={styles.amountBox}>
                        <Text style={styles.currency}>₹</Text>
                        <TextInput
                            ref={inputRef}
                            placeholder="0"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            style={styles.amountInput}
                        />
                    </View>




                    {/* Category with image */}
                    {/* <View style={styles.inputRow}>
                        <View style={styles.lls}>
                            <Image
                                source={{ uri: "https://notebook-covers.s3.us-west-2.amazonaws.com/d7b60dc582c57e0ba5043bd4be90a158" }}
                                style={styles.icon}
                            />
                        </View>
                        <TextInput
                            placeholder="Category (e.g. Food)"
                            value={category}
                            onChangeText={setCategory}
                            style={[styles.input, { flex: 1 }]}
                        />
                    </View> */}

                    <TMCategoris setCategory={setCategory} category={category} type={type} imageUrl={imageUrl} setImageUrl={setImageUrl} />


                    {/* Account chips with image */}
                    <Text style={styles.label}>Account:</Text>
                    <View style={styles.row}>
                        {accounts.map((acc, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.chip2,
                                    account === acc.name && styles.chipActive,
                                    { flexDirection: "row", alignItems: "center" },
                                ]}
                                onPress={() => setAccount(acc.name)}
                            >
                                <View style={styles.lls2}>
                                    <Image
                                        source={{ uri: acc.imageUrl }}
                                        style={styles.iconSmall}
                                    />
                                </View>
                                <Text
                                    style={account === acc.name ? styles.chipTextActive : styles.chipText}
                                >
                                    {acc.name}
                                </Text>
                            </TouchableOpacity>
                        ))}

                    </View>

                    {/* Notes textarea */}
                    <TextInput
                        placeholder="Notes"
                        value={notes}
                        onChangeText={setNotes}
                        style={[styles.inputbox, { height: 90 }]}
                        multiline={true}
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
                            <Text style={{ color: "#000000ff" }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={{ color: "#ffffffff" }}>Save</Text>
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
        // borderRadius: 12,
        padding: 20,
        // borderColor: "#000000ff",
        // borderWidth: 1,
        elevation: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        // textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        // borderRadius: 8,
        padding: 10,
        // marginBottom: 12,
    },
    inputbox: {
        borderWidth: 1,
        borderColor: "#ccc",
        // borderRadius: 8,
        padding: 10,
        textAlignVertical: "top",
        // marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        flexWrap: "wrap",
        // justifyContent: "space-between",
    },
    label: {
        fontSize: 15,
        marginRight: 10,
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        // borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 8,
    },
    chip2: {
        // paddingVertical: 6,
        // paddingHorizontal: 12,
        paddingRight: 12,
        // minWidth: 88,
        // borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 8,
        marginBottom: 8,

    },
    chipActive: {
        backgroundColor: "#ededed8f",
        borderColor: "#000",
        // borderWidth: 2,
    },
    chipText: {
        color: "#000",
    },
    chipTextActive: {
        // color: "#fff",
    },
    btnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    closeBtn: {
        // backgroundColor: "gray",
        borderColor:"#ccc",
        borderWidth:1,
        padding: 12,
        // borderRadius: 8,
        flex: 1,
        marginRight: 5,
        alignItems: "center",
    },
    saveBtn: {
        borderColor:"#000000ff",
        borderWidth:1,
        backgroundColor: "#000000ff",
        padding: 12,
        // borderRadius: 8,
        flex: 1,
        marginLeft: 5,
        alignItems: "center",
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    lls: {
        // padding: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        // width: 30,
        // height: 30,
        // marginRight: 10,
        padding: 4.8,
        borderRightWidth: 0,
    },
    lls2: {
        // padding: 5,
        borderRightWidth: 1,
        borderColor: "#ccc",
        // width: 30,
        // height: 30,
        marginRight: 10,
        padding: 4.5,
    },
    icon: {
        width: 30,
        height: 30,
        // marginRight: 10,
        // borderWidth: 1,
        // borderColor: "#ccc",
        // borderRadius: 8,
        // padding: 20,
        // paddingHorizontal: 40,
        // marginBottom: 12,

        // flex: 1,
    },
    iconSmall: {
        width: 25,
        height: 25,
        // borderRadius: 6,
    },
    amountBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#f9f9f9",
        paddingHorizontal: 12,
        // paddingVertical: 8,
        marginBottom: 16,

    },
    currency: {
        fontSize: 20,
        fontWeight: "bold",
        marginRight: 8,
        color: "#000",
    },

    amountInput: {
        flex: 1,
        fontSize: 22,
        fontWeight: "bold",
        color: "#000",
    },

});

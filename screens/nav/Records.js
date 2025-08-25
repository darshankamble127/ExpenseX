import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DayTransactions from "./components/DayTransactions";
import TransactionModal from "./components/TransactionModal";
import { Ionicons } from "@expo/vector-icons";


const STORAGE_KEY = "transactions";
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Records() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState({});

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // First day of month (0=Sunday, 1=Monday,...)
    const firstDay = new Date(year, month, 1).getDay();

    // Create array for dates
    const dates = [];
    for (let i = 0; i < firstDay; i++) {
        dates.push(null); // empty slots
    }
    for (let i = 1; i <= daysInMonth; i++) {
        dates.push(i);
    }

    // Default select today's date if in this month
    useEffect(() => {
        const today = new Date();
        if (today.getMonth() === month && today.getFullYear() === year) {
            setSelectedDate(today.getDate());
        } else {
            setSelectedDate(null);
        }
    }, [month, year]);

    // Load transactions from AsyncStorage
    useEffect(() => {
        const loadData = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setData(JSON.parse(stored));
                } else {
                    setData({});
                }
            } catch (err) {
                console.log("Error loading transactions:", err);
            }
        };
        loadData();
    }, [modalVisible, month, year]); // reload when modal closes or month/year changes

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        // setSelectedDate(1);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        // setSelectedDate(1);
    };

    // Helper to get full date string
    const getFullDateString = (date) => {
        if (!date) return null;
        return `${date}/${month + 1}/${year}`;
    };

    const selectedDateKey = getFullDateString(selectedDate);
    const selectedDayData = data[selectedDateKey];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={prevMonth}>
                    <Text style={styles.arrow}>{"<"}</Text>
                </TouchableOpacity>
                <Text style={styles.monthText}>
                    {currentDate.toLocaleString("default", { month: "long" })} {year}
                </Text>
                <TouchableOpacity onPress={nextMonth}>
                    <Text style={styles.arrow}>{">"}</Text>
                </TouchableOpacity>
            </View>

            {/* Days of week */}
            <View style={styles.weekRow}>
                {daysOfWeek.map((day) => (
                    <Text key={day} style={styles.weekDay}>
                        {day}
                    </Text>
                ))}
            </View>

            {/* Dates grid */}
            <View style={styles.datesGrid}>
                {dates.map((date, index) => {
                    const isSelected = date === selectedDate;
                    const fullDateKey = getFullDateString(date);
                    const hasData = !!data[fullDateKey]; // FIXED: show dot only if data exists
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dateBox,
                                !date && { borderWidth: 0 }, // no border for empty slots
                                isSelected && styles.selectedBox,
                            ]}
                            
                            onPress={() => date && setSelectedDate(date)}
                            activeOpacity={0.7}
                        >
                            {date && (
                                <Text
                                    style={[
                                        styles.dateText,
                                        isSelected && styles.selectedText,
                                    ]}
                                >
                                    {date}
                                </Text>
                            )}
                            {/* Show dot if there are transactions */}
                            {/* {hasData ? <Text style={{ fontSize: 10, color: "green" }}>●</Text> : null} */}
                            {/* Show total for the day */}
                            {hasData ? (
                                <Text style={{ fontSize: 13,textAlign:"center",paddingTop:4, color: data[fullDateKey].total >= 0 ? "green" : "#be1515ff" }}>
                                    {data[fullDateKey].total>=0?`₹${data[fullDateKey].total}`:`-₹${Math.abs(data[fullDateKey].total)}`}
                                </Text>
                            ) : null}
                        </TouchableOpacity>
                    );
                })}
            </View>
            {/* print selected date like MONDAY, 22 AUG  */}
            <View style={styles.rcHeader}>
                {selectedDate ? (
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>
                        {(() => {
                            const dateObj = new Date(year, month, selectedDate);
                            const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
                            const day = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
                            const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                            return `${weekday}, ${day} ${monthStr}`;
                        })()}
                    </Text>
                ) : (
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>No date selected</Text>
                )}
                <Text style={{ fontSize: 15, fontWeight: '600'}}>TOTAL:
                <Text style={{ fontSize: 15, fontWeight: '600', color: selectedDayData ? (selectedDayData.total >= 0 ? "green" : "#be1515ff") : "#000" }}>
                     {selectedDayData ? selectedDayData.total>0?` ₹${selectedDayData.total}`:` -₹${Math.abs(selectedDayData.total)}` : 0}
                </Text>
                </Text>
            </View>
            <ScrollView vertical={true} style={styles.menuContainer}>
                {selectedDayData && selectedDayData.transactions && selectedDayData.transactions.length > 0 ? (
                    <DayTransactions transactions={selectedDayData.transactions} />
                ) : (
                    <Text style={{ margin: 20, color: "#888" }}>No transactions for this date.</Text>
                )}
            </ScrollView>
            {/* add transaction btn here */}

            <TouchableOpacity
                style={{
                    position: "absolute",
                    bottom: 18,
                    right: 10,
                    backgroundColor: "#000",
                    borderRadius: 30,
                    width: 60,
                    height: 60,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 6,
                }}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add-sharp" size={25} color="#fff" />
            </TouchableOpacity>    
            
            {/* TransactionModal usage should be controlled by state, example below */}
            <TransactionModal modalVisible={modalVisible} setModalVisible={setModalVisible}  />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        alignItems: "center",
    },
    arrow: {
        fontSize: 24,
        fontWeight: "bold",
    },
    monthText: {
        fontSize: 20,
        fontWeight: "600",
    },
    weekRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 15,
        paddingHorizontal: 8,
    },
    weekDay: {
        fontSize: 15,
        fontWeight: "500",
        width: 40,
        textAlign: "center",
    },
    datesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        paddingHorizontal: 8,
    },
    dateBox: {
        width: `${92 / 7}%`,
        height: 50,
        paddingLeft: 5,
        backgroundColor: "#ffffffff",
        borderWidth: 1,
        borderColor: "#b7b7b7ff",
        margin: 2,

    },
    dateText: {
        fontSize: 14,
        color: "#000",
    },
    selectedBox: {
        backgroundColor: "#000000ff",
          elevation: 6,              //  hides the top header box
        borderColor: "#000",
    },
    selectedText: {
        color: "#fff",
        fontWeight: "bold",
    },

    rcHeader: {
        borderBottomWidth: 2.5,
        borderBottomColor: "#000000ff",
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10,
        paddingBottom: 2,
    },
});

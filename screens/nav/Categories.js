import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
} from "react-native";
import Card from "./components/CategoryCard";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "CATEGORIES_DATA";

export default function Categories() {
    const [selectedType, setSelectedType] = useState("expense"); // default: expense
    const [search, setSearch] = useState("");
    const [showIcons, setShowIcons] = useState(false); // toggle icons section
    const [selectedIcon, setSelectedIcon] = useState(null); // selected image
    const [categoriesData, setCategoriesData] = useState({ income: [], expense: [] });

    const iconsList = [
        "https://notebook-covers.s3.us-west-2.amazonaws.com/d7b60dc582c57e0ba5043bd4be90a158",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/05447a975db2b5bb4397386c5c2fdc29",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/39b121b3665570fde815cc5b003dfd85",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/92f17ac11682913ee5640c2c8c8b1dfc",
    ];

    const defaultIncome = [
        { title: "Awards", imageUrl: iconsList[0] },
        { title: "Grants", imageUrl: iconsList[2] },
        { title: "Refunds", imageUrl: iconsList[1] },
        { title: "Rental", imageUrl: iconsList[2] },
        { title: "Salary", imageUrl: iconsList[3] },
        { title: "Sale", imageUrl: iconsList[0] },
    ];

    const defaultExpense = [
        { title: "Beauty", imageUrl: iconsList[0] },
        { title: "Bills", imageUrl: iconsList[2] },
        { title: "Education", imageUrl: iconsList[2] },
        { title: "Food", imageUrl: iconsList[2] },
        { title: "Shopping", imageUrl: iconsList[1] },
        { title: "Drink", imageUrl: iconsList[2] },
        { title: "Transportation", imageUrl: iconsList[2] },
    ];

    // --- Load data from AsyncStorage
    useEffect(() => {
        const loadData = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setCategoriesData(JSON.parse(stored));
                } else {
                    // save defaults if no data
                    const defaults = { income: defaultIncome, expense: defaultExpense };
                    setCategoriesData(defaults);
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
                }
            } catch (err) {
                console.log("Error reading categories:", err);
            }
        };
        loadData();
    }, []);

    // --- Save new category
    const handleAddCategory = async () => {
        if (!search.trim()) {
            Alert.alert("Enter a name for the category");
            return;
        }
        if (!selectedIcon) {
            Alert.alert("Pick an icon for the category");
            return;
        }

        const newCategory = { title: search.trim(), imageUrl: selectedIcon };
        const updated = { ...categoriesData };
        updated[selectedType] = [...updated[selectedType], newCategory];

        setCategoriesData(updated);
        setSearch("");
        setSelectedIcon(null);

        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            Alert.alert("Category saved!");
        } catch (err) {
            console.log("Error saving category:", err);
        }
    };

    // Filter based on selected type and search
    const categories = categoriesData[selectedType] || [];
    const filteredCategories = categories.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Toggle Buttons */}
            <View style={styles.toggleRow}>
                <TouchableOpacity
                    style={[
                        styles.toggleBtn,
                        selectedType === "income" && styles.toggleActive,
                    ]}
                    onPress={() => setSelectedType("income")}
                >
                    <Text
                        style={
                            selectedType === "income" ? styles.toggleTextActive : styles.toggleText
                        }
                    >
                        Income
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.toggleBtn,
                        selectedType === "expense" && styles.toggleActive,
                    ]}
                    onPress={() => setSelectedType("expense")}
                >
                    <Text
                        style={
                            selectedType === "expense" ? styles.toggleTextActive : styles.toggleText
                        }
                    >
                        Expense
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Search + Add */}
            <View style={styles.searchRow}>
                {/* Image button */}
                <TouchableOpacity
                    style={styles.lls}
                    onPress={() => setShowIcons(!showIcons)}
                >
                    <Image
                        source={{
                            uri:
                                selectedIcon ||
                                "https://notebook-covers.s3.us-west-2.amazonaws.com/d7b60dc582c57e0ba5043bd4be90a158",
                        }}
                        style={styles.icon}
                    />
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Enter category name..."
                    value={search}
                    onChangeText={setSearch}
                />
                <TouchableOpacity style={styles.addBtn} onPress={handleAddCategory}>
                    <MaterialIcons name="add-circle-outline" size={30} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Show icons row if clicked */}
            {showIcons && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.iconsRow}
                >
                    {iconsList.map((url, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setSelectedIcon(url);
                                setShowIcons(false); // hide after selection
                            }}
                        >
                            <Image
                                source={{ uri: url }}
                                style={[
                                    styles.iconOption,
                                    selectedIcon === url && styles.iconSelected,
                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Categories List */}
            <ScrollView>
                <View style={styles.CardContainer}>
                    {filteredCategories.map((item, index) => (
                        // <Card key={index} title={item.title} imageUrl={item.imageUrl} />
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.chip2,
                                // account === acc && styles.chipActive,
                                { flexDirection: "row", alignItems: "center" }
                            ]}
                            onPress={() => setAccount(acc)}
                        >
                            <View style={styles.lls2}>
                                <Image
                                    source={{ uri: item.imageUrl }}
                                    style={styles.iconSmall}
                                />
                            </View>
                            <Text style={styles.chipText}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 50,
        backgroundColor: "#fff",
    },
    toggleRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 15,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#000",
        // borderRadius: 8,
        marginHorizontal: 5,
        alignItems: "center",
    },
    toggleActive: {
        backgroundColor: "#000",
    },
    toggleText: {
        fontSize: 16,
        color: "#000",
    },
    toggleTextActive: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginRight: 10,
    },
    addBtn: {
        justifyContent: "center",
        alignItems: "center",
    },
    CardContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
    lls: {
        borderWidth: 1,
        borderColor: "#ccc",
        marginLeft: 5,
        padding: 4.5,
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
     iconSmall: {
        width: 25,
        height: 25,
        // borderRadius: 6,
    },
    icon: {
        width: 30,
        height: 30,
    },
    iconsRow: {
        marginBottom: 15,
    },
    iconOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: "transparent",
    },
    iconSelected: {
        borderColor: "blue",
    },
    chip2: {
        // paddingVertical: 6,
        // paddingHorizontal: 12,
        paddingRight: 12,
        minWidth: 106,
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
});

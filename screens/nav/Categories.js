import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CategoryEditor from "./components/CategoryEditor";

const STORAGE_KEY = "CATEGORIES_DATA";
const { height } = Dimensions.get("window");

export default function Categories() {
    const [selectedType, setSelectedType] = useState("expense");
    const [search, setSearch] = useState("");
    const [showIcons, setShowIcons] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [categoriesData, setCategoriesData] = useState({ income: [], expense: [] });
    const [modalVisible, setModalVisible] = useState(false);


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

    // Load categories
    useEffect(() => {
        const loadData = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setCategoriesData(JSON.parse(stored));
                } else {
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

    // Add new category
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

    const categories = categoriesData[selectedType] || [];
    const filteredCategories = categories.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Black Header 25% of screen */}
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>
                    Add / Edit Categories
                </Text>
            </View>


            {/* Search + Add */}
            <View style={styles.searchRow}>
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




            {/* Icons List */}
            {showIcons && (
                <View style={styles.iconsRow}>
                    {iconsList.map((url, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setSelectedIcon(url);
                                setShowIcons(false);
                            }}
                            style={[
                                styles.showIconsTouchable,
                                selectedIcon === url && styles.iconSelected,
                            ]}
                        >
                            <Image source={{ uri: url }} style={styles.iconOption} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            {/* Toggle Buttons */}
            <View style={styles.toggleRow}>
                {["income", "expense"].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.toggleBtn,
                            selectedType === type && styles.toggleActive,
                            type === "income" && { marginRight: 5 },
                        ]}
                        onPress={() => setSelectedType(type)}
                    >
                        <Text
                            style={
                                selectedType === type
                                    ? styles.toggleTextActive
                                    : styles.toggleText
                            }
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Categories List */}
            <View style={styles.CardContainer}>
                {filteredCategories.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setModalVisible(true)}
                        style={[
                            styles.chip2,
                            { flexDirection: "row", alignItems: "center" },
                        ]}
                    >
                        <View style={styles.lls2}>
                            <Image
                                source={{ uri: item.imageUrl }}
                                style={styles.iconSmall}
                            />
                        </View>
                        <Text style={styles.chipText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
                {/* <CategoryEditor modalVisible={modalVisible} setModalVisible={setModalVisible} imageUrl={item.imageUrl} title={item.title} STORAGE_KEY={STORAGE_KEY} /> */}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerBox: {
        height: height * 0.25,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 50,

    },
    headerText: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "bold",
    },
    toggleRow: {
        flexDirection: "row",
        // justifyContent: "center",
        // marginVertical: 15,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    toggleBtn: {
        // flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        marginRight: 8,
    },
    toggleActive: {
        backgroundColor: "#000000ff",
        borderColor: "#000",
    },
    toggleText: {
        // fontSize: 16,
        color: "#000",
    },
    toggleTextActive: {
        // fontSize: 16,
        color: "#fff",
        // fontWeight: "bold",
    },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 10,
        paddingHorizontal: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginRight: 10,
        height: 47,
    },
    addBtn: {
        justifyContent: "center",
        alignItems: "center",
    },
    CardContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        paddingHorizontal: 8,
    },
    lls: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 5,
        borderRightWidth: 0,
    },
    lls2: {
        borderRightWidth: 1,
        borderColor: "#ccc",
        marginRight: 10,
        padding: 4.5,
    },
    iconSmall: {
        width: 35,
        height: 35,
    },
    icon: {
        width: 35,
        height: 35,
    },
    iconsRow: {
        marginBottom: 15,
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 8,
    },
    iconOption: {
        width: 35,
        height: 35,
    },
    iconSelected: {
        borderColor: "black",
    },
    showIconsTouchable: {
        marginRight: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 5,
        marginBottom: 10,
    },
    chip2: {
        paddingRight: 12,
        minWidth: 115,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        color: "#000",
    },
});

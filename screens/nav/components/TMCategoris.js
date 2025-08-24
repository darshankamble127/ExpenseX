import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function TMCategoris({ category, setCategory, imageUrl, type, setImageUrl }) {
    const [categoriesData, setCategoriesData] = useState([]);
    const [showCategoryPanel, setShowCategoryPanel] = useState(false);
    const [showIcons, setShowIcons] = useState(false);
    const [search, setSearch] = useState("");

    // Default icons list
    const iconsList = [
        "https://notebook-covers.s3.us-west-2.amazonaws.com/d7b60dc582c57e0ba5043bd4be90a158",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/05447a975db2b5bb4397386c5c2fdc29",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/39b121b3665570fde815cc5b003dfd85",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/92f17ac11682913ee5640c2c8c8b1dfc",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/d7b60dc582c57e0ba5043bd4be90a158",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/05447a975db2b5bb4397386c5c2fdc29",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/39b121b3665570fde815cc5b003dfd85",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/92f17ac11682913ee5640c2c8c8b1dfc",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/d7b60dc582c57e0ba5043bd4be90a158",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/05447a975db2b5bb4397386c5c2fdc29",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/39b121b3665570fde815cc5b003dfd85",
        "https://notebook-covers.s3.us-west-2.amazonaws.com/92f17ac11682913ee5640c2c8c8b1dfc",
    ];

    // Fetch categories from storage
    const loadCategories = async () => {
        try {
            const stored = await AsyncStorage.getItem("CATEGORIES_DATA");
            if (stored) {
                setCategoriesData(JSON.parse(stored));
            }
        } catch (err) {
            console.log("Error loading categories", err);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // Filter categories (search + expense only)
    const filteredCategories =type==="expense"?
        categoriesData?.expense?.filter((item) =>
            item.title.toLowerCase().includes(search.toLowerCase())
        ) || []:
        categoriesData?.income?.filter((item) =>
            item.title.toLowerCase().includes(search.toLowerCase())
        ) || [];

    return (
        <View style={{ marginBottom: 0 }}>
            {/* Category Input Row */}
            <View style={styles.inputRow}>
                {/* Tap image to pick another icon */}
                <TouchableOpacity
                    style={styles.lls}
                    onPress={() => setShowIcons(!showIcons)}
                >
                    <Image
                        source={{
                            uri:
                                imageUrl ||
                                "https://notebook-covers.s3.us-west-2.amazonaws.com/d7b60dc582c57e0ba5043bd4be90a158",
                        }}
                        style={styles.icon}
                    />
                </TouchableOpacity>

                <TextInput
                    placeholder="Category (e.g. Food)"
                    value={category}
                    onFocus={() => setShowCategoryPanel(true)}
                    onChangeText={(text) => {
                        setCategory(text);
                        setSearch(text);
                    }}
                    style={[styles.input, { flex: 1 }]}
                />
            </View>

            {/* Icon Picker */}
            {showIcons && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {iconsList.map((url, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => {
                                setImageUrl(url);
                                setShowIcons(false);
                            }}
                            style={[styles.showIconsTouchable, imageUrl === url && styles.iconSelected]}
                        >
                            <Image
                                source={{ uri: url }}
                                style={[
                                    styles.iconOption,

                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Category Panel */}
            {showCategoryPanel && (
                <View style={styles.panel}>
                    <ScrollView
                        contentContainerStyle={styles.panelContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {filteredCategories.length > 0 ? (
                            filteredCategories.slice(0, 9).map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.chip2}
                                    onPress={() => {
                                        setCategory(item.title);
                                        setImageUrl(item.imageUrl);
                                        setShowCategoryPanel(false);
                                    }}
                                >
                                    <View style={styles.lls2}>

                                        <Image
                                            source={{ uri: item.imageUrl }}
                                            style={styles.iconSmall}
                                        />
                                    </View>
                                    <Text style={styles.chipText}>{item.title}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={{ textAlign: "center", color: "gray" }}>
                                It’ll be added automatically once you save.
                            </Text>
                        )}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

export default TMCategoris;

const styles = StyleSheet.create({
   
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 0,
    },
    lls: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 5,
        borderRightWidth: 0,
    },
    lls2: {
        // padding: 5,
        borderRightWidth: 1,
        borderColor: "#ccc",
        // width: 30,
        // height: 30,
        // marginRight: 5,
        padding: 2,
    },
    icon: {
        width: 30,
        height: 30,
    },
    showIconsTouchable: {
        marginRight: 10,
        // padding: 5,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 5,
        marginBottom: 10,
    },
    panel: {
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        padding: 10,
        marginTop: 0,
        // borderRadius: 8,
        marginBottom: 10,
    },
    panelContent: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    chip2: {
        borderWidth: 1,
        borderColor: "#ccc",
        paddingRight: 12,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        marginLeft: 5,
    },
    iconSmall: {
        width: 25,
        height: 25,
    },
    iconOption: {
        width: 30,
        height: 30,
        // borderRadius: 25,
        // margin: 5,
        // borderWidth: 2,
        // borderColor: "transparent",
    },
    iconSelected: {
        borderColor: "black",
    },
});

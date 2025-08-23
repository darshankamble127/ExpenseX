import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import Card from "./components/AccountCard";
import { MaterialIcons } from "@expo/vector-icons";

export default function Accounts() {
    const data = [
        {
            title: "Card",
            value: "20000.00",
            imageUrl:
                "https://notebook-covers.s3.us-west-2.amazonaws.com/d7b60dc582c57e0ba5043bd4be90a158",
        },
        {
            title: "Cash",
            value: "500.00",
            imageUrl:
                "https://notebook-covers.s3.us-west-2.amazonaws.com/05447a975db2b5bb4397386c5c2fdc29",
        },
        {
            title: "Savings",
            value: "3500.00",
            imageUrl:
                "https://notebook-covers.s3.us-west-2.amazonaws.com/39b121b3665570fde815cc5b003dfd85",
        },
        {
            title: "Transfer",
            value: "4190.00",
            imageUrl:
                "https://notebook-covers.s3.us-west-2.amazonaws.com/92f17ac11682913ee5640c2c8c8b1dfc",
        },
        // Add more data as needed
    ];

    return (
        <ScrollView vertical={true} style={styles.container}>
            <Text style={styles.header}>Overall</Text>
            <View style={styles.soFarTotal}>
                <View
                    style={[
                        {
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderBottomWidth: 1,
                            borderBottomColor: "#212224",
                            marginHorizontal: 30,
                            alignItems: "center",
                        },
                    ]}
                >
                    <View style={styles.incomeContainer}>
                        <Text style={styles.title}>INCOME SO FAR</Text>
                        <Text style={styles.income}>RS 5000.00</Text>
                    </View>
                    <Text>-</Text>
                    <View style={styles.expensesContainer}>
                        <Text style={styles.title}>EXPENSE SO FAR</Text>
                        <Text style={styles.expenses}>RS 800.00</Text>
                    </View>
                </View>
                <View style={styles.balanceContainer}>
                    <View>
                        <Text style={styles.title}>TOTAL BALANCE</Text>
                        <Text style={styles.balance}>RS 4190.00</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.header}>Accounts</Text>
            <View horizontal={true} style={styles.CardContainer}>
                {data.map((item, index) => (
                    <Card
                        key={index}
                        title={item.title}
                        value={item.value}
                        imageUrl={item.imageUrl}
                    />
                ))}
                <View style={styles.card}>
                    <TouchableOpacity style={[styles.tab]}>
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
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        // paddingVertical: 10,
        flex: 1,
        paddingTop: 50,
        backgroundColor: "#fff",
    },
    CardContainer: {
        display: "flex",
    },
    card: {
        display: "flex",
        // flexDirection: "row",
        // // height: 65,
        // width:"50%",
        // marginBottom: 10,
        // borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        // padding: 14,
        // borderWidth: 1,
        // borderColor: "#212224",
        // // borderStyle:"dashed"
    },
    tab: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        // height: 65,
        width: "50%",
        marginBottom: 100,
        // borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        borderWidth: 1.3,
        borderColor: "#212224",
        // borderStyle:"dashed"
    },
    header: {
        fontSize: 17,
        marginBottom: 5,
    },
    soFarTotal: {
        // backgroundColor: "white",
        display: "flex",
        width: "100%",
        // justifyContent:"center",
        // alignItems:"center",
        borderColor: "#212224",
        borderWidth: 1,
        borderRadius: 0,
        padding: 10,
        marginBottom: 15,
    },
    expensesContainer: {
        marginBottom: 10,
        // borderColor:"#212224",
        // borderWidth:1,
    },
    incomeContainer: {
        marginBottom: 10,
    },
    balanceContainer: {
        display: "flex",
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 17,
        // fontWeight: "bold",
    },
    balance: {
        fontSize: 17,
        // fontWeight: "bold",
        color: "#006b00",
    },
    income: {
        fontSize: 17,
        // fontWeight: "bold",
        color: "#006b00",
    },
    expenses: {
        fontSize: 17,
        // fontWeight: "bold",
        color: "#c60000",
    },
});

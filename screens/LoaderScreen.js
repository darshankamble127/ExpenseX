import React, { useCallback, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useFocusEffect } from "@react-navigation/native";

export default function LoaderScreen({ navigation }) {

  const loadAccounts = async () => {
    try {
      const stored = await AsyncStorage.getItem("@accounts_data");
      if (stored) {
        // setAccounts(JSON.parse(stored));
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
          {
            name: "Transfer",
            balance: 0,
            imageUrl:
              "https://notebook-covers.s3.us-west-2.amazonaws.com/92f17ac11682913ee5640c2c8c8b1dfc",
          },
        ];
        // setAccounts(defaultAccounts);
        await AsyncStorage.setItem("@accounts_data", JSON.stringify(defaultAccounts));
      }
    } catch (err) {
      console.log("Error loading accounts:", err);
    }
  };

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
  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem("CATEGORIES_DATA");
      if (stored) {
        // setCategoriesData(JSON.parse(stored));
      } else {
        const defaults = { income: defaultIncome, expense: defaultExpense };
        // setCategoriesData(defaults);
        await AsyncStorage.setItem("CATEGORIES_DATA", JSON.stringify(defaults));
      }
    } catch (err) {
      console.log("Error reading categories:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
      loadData();
    }, [])
  );

  useEffect(() => {
    const checkKey = async () => {
      const uniqueKey = await AsyncStorage.getItem("uniqueKey");

      if (uniqueKey) {
        // If key exists → go to Dashboard
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
          })
        );
      } else {
        // If no key → go to Login
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
          })
        );
      }
    };

    checkKey();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="black" />
      {/* <Text>Loading...</Text> */}
    </View>
  );
}

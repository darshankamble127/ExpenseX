import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

export default function LoaderScreen({ navigation }) {
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
      <ActivityIndicator size="large" color="blue" />
      <Text>Loading...</Text>
    </View>
  );
}

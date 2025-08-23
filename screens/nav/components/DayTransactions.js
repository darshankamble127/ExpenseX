import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Card from "./Card";

export default function DayTransactions({ transactions = [] }) {
  if (!transactions.length) {
    return (
      <View style={styles.CardContainer}>
        <Text style={{ color: "#888", margin: 20 }}>No transactions for this date.</Text>
      </View>
    );
  }

  return (
    <View style={styles.CardContainer}>
      {transactions.map((item, index) => (
        <Card
          key={index}
          title={item.category || item.title}
          debitFrom={item.account || item.debitFrom}
          imageUrl={item.imageUrl}
          cost={item.amount || item.cost}
          notes={item.notes}
          type={item.type}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  CardContainer: {
    display: "flex",
    paddingHorizontal: 10,
    marginBottom: 100,
  },
});
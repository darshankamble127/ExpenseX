import { MaterialIcons } from "@expo/vector-icons";
import React, { use, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Card({ title, debitFrom, cost, imageUrl, type, notes}) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    console.log("Card props:", { title, debitFrom, cost, imageUrl, type, notes });
  }, [])
  

  return (
    <View style={styles.card}>
      <View style={styles.leftSide}>
        <View style={styles.lls}>
          {imageError ? (
            <Text style={styles.errorText}>Image failed to load</Text>
          ) : (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              onError={handleImageError}
            />
          )}
        </View>
        <View style={styles.lrs}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{type=="income"?`Credited to ${debitFrom}`:`Debited from ${debitFrom}`}</Text>
        </View>
      </View>
      <View style={styles.rightSide}>
        {/* <TouchableOpacity style={[styles.tab]}>
          <MaterialIcons name="edit" size={24} color="#212224" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab]}>
          <MaterialIcons name="delete-outline" size={24} color="#212224" />
        </TouchableOpacity> */}

        <View style={[styles.tab]}>
          <Text style={type == "income" ? styles.income : styles.expenses}>
            {type == "income" ? `+₹${cost}` : `-₹${Math.abs(cost)}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "row",
    // height: 65,
    // marginBottom: 10,
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1df",
  },
  leftSide: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  rightSide: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  tab: {
    // height: 50,
    // marginBottom: 10,
    borderRadius: 10,
    justifyContent: "center",
    // alignItems: "left",
    paddingLeft: 10,
  },
  title: {
    fontSize: 17,
  },
  value: {
    fontSize: 14,
    color: "#555",
  },
  lls: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#000000ff",
    marginRight: 10,
    borderRadius: 0, // 25 Make it round
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
  image: {
    width: 40,
    height: 40,
  },
  errorText: {
    fontSize: 14,
    color: "red",
  },
  expenses: {
    fontSize: 15,
    // fontWeight: "bold",
    color: "#bb0303ff",
    fontWeight: '600'
  },
  income: {
    fontSize: 15,
    // fontWeight: "bold",
    color: "#107503ff",
    fontWeight: '600'
  },
});

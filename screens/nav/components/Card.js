import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

 export default function  Card  ({ title, debitFrom, cost, imageUrl }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

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
          <Text style={styles.value}>Debited from {debitFrom}</Text>
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
          <Text style={styles.expenses}>{cost}</Text>
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
    padding: 5,
    borderWidth: 1,
    borderColor: "#212224",
    marginRight: 10,
    borderRadius: 0, // 25 Make it round
  },
  image: {
    width: 30,
    height: 30,
  },
  errorText: {
    fontSize: 14,
    color: "red",
  },
  expenses: {
    fontSize: 17,
    // fontWeight: "bold",
    color: "#c60000",
  },
});

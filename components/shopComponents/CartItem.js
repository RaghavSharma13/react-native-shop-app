import React from "react";
import {
  Text,
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const CartItem = ({ qty, title, amount, onRemoveItem, deleteable }) => {
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android") {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{qty} </Text>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.amount}>${amount}</Text>
        {deleteable && (
          <TouchableCmp onPress={onRemoveItem} style={styles.btnDelete}>
            <Ionicons
              name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
              size={23}
              color={"red"}
            />
          </TouchableCmp>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontFamily: "openSans",
    color: "#888",
    fontSize: 16,
  },
  title: {
    fontFamily: "openSansBold",
    fontSize: 16,
    width: "60%",
  },
  amount: {
    fontFamily: "openSansBold",
    fontSize: 16,
    marginRight: 10,
  },
});

export default CartItem;

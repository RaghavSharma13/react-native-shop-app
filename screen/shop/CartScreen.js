import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CartItem from "../../components/shopComponents/CartItem";
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cartActions";
import * as orderActions from "../../store/actions/orderActions";

const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { totalAmount } = useSelector((root) => root.cartReducer);
  const cartList = useSelector((root) => {
    const transformedList = [];
    for (const key in root.cartReducer.items) {
      transformedList.push({
        id: key,
        title: root.cartReducer.items[key].title,
        qty: root.cartReducer.items[key].qty,
        price: root.cartReducer.items[key].price,
        sum: root.cartReducer.items[key].sum,
      });
    }
    return transformedList.sort((a, b) => (a.id > b.id ? 1 : -1));
  });

  const orderNowClicked = async () => {
    setIsLoading(true);
    try {
      await dispatch(orderActions.addOrder(cartList, totalAmount));
    } catch (err) {
      Alert.alert("Try Again", "Failed to complete the Transaction.", [
        { text: "Ok" },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.screem}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total: <Text style={styles.amount}>${totalAmount.toFixed(2)}</Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator color={Colors.primaryColor} size={"small"} />
        ) : (
          <Button
            color={Colors.secondaryColor}
            title="Order Now"
            disabled={cartList.length === 0}
            onPress={orderNowClicked}
          />
        )}
      </View>
      <FlatList
        data={cartList}
        renderItem={(itemData) => (
          <CartItem
            qty={itemData.item.qty}
            title={itemData.item.title}
            amount={itemData.item.sum}
            onRemoveItem={() => {
              dispatch(cartActions.removeFromCart(itemData.item.id));
            }}
            deleteable={true}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screem: {
    margin: 10,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  summaryText: {
    fontFamily: "openSansBold",
    fontSize: 18,
  },
  amount: {
    color: Colors.primaryColor,
  },
});

export default CartScreen;

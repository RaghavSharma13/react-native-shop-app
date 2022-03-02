import React, { useLayoutEffect } from "react";
import {
  FlatList,
  Button,
  Platform,
  Alert,
  StyleSheet,
  View,
  Text,
} from "react-native";
import {
  HeaderButton,
  HeaderButtons,
  Item,
} from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ProductItem from "../../components/shopComponents/ProductItem";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import Colors from "../../constants/Colors";
import * as productActions from "../../store/actions/productActions";

const UserProductScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
            iconSize={23}
            color="white"
            onPress={() => navigation.toggleDrawer()}
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
            iconSize={23}
            onPress={() => onEditProduct("Add Product")}
          />
        </HeaderButtons>
      ),
    });
  });

  const userProducts = useSelector((root) => root.productReducer.userProducts);

  const dispatch = useDispatch();
  const onEditProduct = (title = "", id) => {
    navigation.navigate("EditProductScreen", {
      productId: id,
      productTitle: title,
    });
  };

  const onDeletePressed = (id) => {
    Alert.alert(
      "Delete!",
      "Do you want to delete this product.",
      [
        {
          text: "No",
          style: "default",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(productActions.removeProduct(id));
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  if (userProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.fallbackText}>
          No Products Found. Start creating some.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userProducts}
      renderItem={(itemData) => (
        <ProductItem
          id={itemData.item.id}
          imageUrl={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelected={() =>
            onEditProduct(itemData.item.title, itemData.item.id)
          }
        >
          <Button
            color={Colors.primaryColor}
            title="Edit"
            onPress={() => onEditProduct(itemData.item.id)}
          />
          <Button
            color={Colors.primaryColor}
            title="Delete"
            onPress={() => onDeletePressed(itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontFamily: "openSansBold",
    fontSize: 20,
    color: Colors.primaryColor,
    textAlign: "center",
  },
});

export default UserProductScreen;

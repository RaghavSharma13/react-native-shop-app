import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  Button,
  FlatList,
  Text,
  Platform,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ProductItem from "../../components/shopComponents/ProductItem";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cartActions";
import * as productActions from "../../store/actions/productActions";

const ProductsOverviewScreen = ({ navigation }) => {
  const products = useSelector((root) => root.productReducer.availableProducts);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadProducts = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await dispatch(productActions.setProducts());
    } catch (error) {
      // console.log(error);
      setError(error.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => setIsLoading(false));
  }, [loadProducts, setIsLoading]);

  useEffect(() => {
    const subscription = navigation.addListener("focus", loadProducts);
    return subscription;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Cart"
            iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
            onPress={() => {
              navigation.navigate("CartScreen");
            }}
          />
        </HeaderButtons>
      ),
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Drawer"
            iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
            onPress={() => {
              navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const viewDetails = (title, id) => {
    navigation.navigate("ProductDetailScreen", {
      productTitle: title,
      productId: id,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.fallbackText}>An Error Occurred.</Text>
        <Button
          title="Try Again"
          onPress={loadProducts}
          color={Colors.primaryColor}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primaryColor} size={"large"} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.fallbackText}>No Products Found!!!</Text>
      </View>
    );
  }

  return (
    <FlatList
      refreshing={isRefreshing}
      onRefresh={loadProducts}
      data={products}
      renderItem={(itemData) => (
        <ProductItem
          id={itemData.item.id}
          title={itemData.item.title}
          price={itemData.item.price}
          imageUrl={itemData.item.imageUrl}
          onViewDetailsPressed={() => {}}
          onAddToCartPressed={() => {}}
          onSelected={() => viewDetails(itemData.item.title, itemData.item.id)}
        >
          <Button
            color={Colors.primaryColor}
            title="View Details"
            onPress={() => viewDetails(itemData.item.title, itemData.item.id)}
          />
          <Button
            color={Colors.primaryColor}
            title="Add to Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
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
    fontSize: 22,
    color: Colors.primaryColor,
    marginBottom: 10,
  },
});

export default ProductsOverviewScreen;

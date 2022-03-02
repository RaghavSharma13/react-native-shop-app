import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cartActions";

const ProductDetailScreen = ({ navigation, route }) => {
  const productId = route.params.productId;
  const dispatch = useDispatch();
  const product = useSelector((root) =>
    root.productReducer.availableProducts.find((prod) => prod.id === productId)
  );
  return (
    <View>
      <Image style={styles.image} source={{ uri: product.imageUrl }} />
      <View style={styles.actions}>
        <Button
          color={Colors.primaryColor}
          title="Add to Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(product));
          }}
        />
      </View>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.content}>{product.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  actions: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "openSans",
  },
  content: {
    fontSize: 14,
    marginHorizontal: 20,
    textAlign: "center",
    fontFamily: "openSans",
  },
});

export default ProductDetailScreen;

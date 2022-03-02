import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScreenOptions from "../constants/ScreenOptions";
import CartScreen from "../screen/shop/CartScreen";
import ProductDetailScreen from "../screen/shop/ProductDetailScreen";
import ProductsOverviewScreen from "../screen/shop/ProductsOverviewScreen";

const ShopNavigator = createNativeStackNavigator();

const ShopNavigation = () => {
  return (
    <ShopNavigator.Navigator screenOptions={ScreenOptions}>
      <ShopNavigator.Screen
        name="ProductsOverviewScreen"
        component={ProductsOverviewScreen}
        options={{
          title: "All Products",
        }}
      />
      <ShopNavigator.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
        options={({ route }) => ({
          title: route.params.productTitle,
        })}
      />
      <ShopNavigator.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          title: "Cart",
        }}
      />
    </ShopNavigator.Navigator>
  );
};

export default ShopNavigation;

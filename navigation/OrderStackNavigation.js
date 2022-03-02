import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScreenOptions from "../constants/ScreenOptions";

import OrdersScreen from "../screen/shop/OrdersScreen";

const OrderStackNavigator = createNativeStackNavigator();

const OrderStackNavigation = () => {
  return (
    <OrderStackNavigator.Navigator screenOptions={ScreenOptions}>
      <OrderStackNavigator.Screen
        name="OrderScreen"
        component={OrdersScreen}
        options={{
          title: "Orders",
        }}
      />
    </OrderStackNavigator.Navigator>
  );
};

export default OrderStackNavigation;

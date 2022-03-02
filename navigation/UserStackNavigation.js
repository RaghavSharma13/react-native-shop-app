import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScreenOptions from "../constants/ScreenOptions";
import EditProductsScreen from "../screen/user/EditProductsScreen";
import UserProductScreen from "../screen/user/UserProductScreen";

const UserStackNavigator = createNativeStackNavigator();

const UserStackNavigation = () => {
  return (
    <UserStackNavigator.Navigator screenOptions={ScreenOptions}>
      <UserStackNavigator.Screen
        name="UserProductScreen"
        component={UserProductScreen}
        options={{
          title: "Your Products",
        }}
      />
      <UserStackNavigator.Screen
        name="EditProductScreen"
        component={EditProductsScreen}
        options={({ route }) => ({
          title: route.params.productTitle,
        })}
      />
    </UserStackNavigator.Navigator>
  );
};

export default UserStackNavigation;

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../screen/user/AuthScreen";
import ShopDrawerNavigation from "./ShopDrawerNavigation";
import ScreenOptions from "../constants/ScreenOptions";
import { useSelector } from "react-redux";
const AppNavigator = createNativeStackNavigator();

const AppNavigation = () => {
  const user = useSelector((state) => {
    if (state.authReducer.userId) return true;
    return false;
  });

  return (
    <AppNavigator.Navigator screenOptions={ScreenOptions}>
      {user ? (
        <AppNavigator.Screen
          name="Shop"
          component={ShopDrawerNavigation}
          options={{ headerShown: false }}
        />
      ) : (
        <AppNavigator.Screen
          name="AuthScreen"
          component={AuthScreen}
          options={{ title: "Authenticate" }}
        />
      )}
    </AppNavigator.Navigator>
  );
};

export default AppNavigation;

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import ScreenOptions from "../constants/ScreenOptions";
import SplashScreen from "../screen/SplashScreen";
import AppNavigation from "./AppNavigation";

const SplashNavigator = createNativeStackNavigator();

const SplashNavigation = () => {
  return (
    <SplashNavigator.Navigator screenOptions={ScreenOptions}>
      <SplashNavigator.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <SplashNavigator.Screen
        name="App"
        component={AppNavigation}
        options={{ headerShown: false }}
      />
    </SplashNavigator.Navigator>
  );
};

export default SplashNavigation;

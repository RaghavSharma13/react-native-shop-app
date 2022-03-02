import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import ScreenOptions from "../constants/ScreenOptions";
import OrderStackNavigation from "./OrderStackNavigation";
import ShopStackNavigation from "./ShopStackNavigation";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import Colors from "../constants/Colors";
import UserStackNavigation from "./UserStackNavigation";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/authActions";
const ShopDrawerNavigator = createDrawerNavigator();

const ShopDrawerNavigation = () => {
  const dispatch = useDispatch();

  return (
    <ShopDrawerNavigator.Navigator
      screenOptions={{
        ...ScreenOptions,
        ...{ headerShown: false, drawerActiveTintColor: Colors.primaryColor },
      }}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label={"Logout"}
              onPress={() => {
                dispatch(authActions.logout());
              }}
              style={{
                backgroundColor:
                  Platform.OS === "android" ? Colors.primaryColor : "",
              }}
              labelStyle={{
                color:
                  Platform.OS === "android" ? "white" : Colors.primaryColor,
                fontSize: 20,
                marginLeft: "40%",
              }}
            />
          </DrawerContentScrollView>
        );
      }}
    >
      <ShopDrawerNavigator.Screen
        name="Products"
        component={ShopStackNavigation}
        options={{
          title: "Products",
          drawerIcon: ({ color, focused, size }) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              color={color}
              size={23}
            />
          ),
        }}
      />
      <ShopDrawerNavigator.Screen
        name="OrderNavigation"
        component={OrderStackNavigation}
        options={{
          title: "Orders",
          drawerIcon: ({ color, focused, size }) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-list" : "ios-list"}
              color={color}
              size={23}
            />
          ),
        }}
      />
      <ShopDrawerNavigator.Screen
        name="UserNavigation"
        component={UserStackNavigation}
        options={{
          title: "Admin",
          drawerIcon: ({ color }) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-create" : "ios-create"}
              color={color}
              size={23}
            />
          ),
        }}
      />
    </ShopDrawerNavigator.Navigator>
  );
};

export default ShopDrawerNavigation;

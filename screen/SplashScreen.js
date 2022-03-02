import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Colors from "../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/authActions";

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        navigation.replace("App");
        return;
      }

      const transformedData = JSON.parse(userData);

      const { userId, token, expiryDate } = transformedData;

      if (new Date(expiryDate) <= new Date() || !userId || !token) {
        navigation.replace("App");
        return;
      }
      dispatch(authActions.setUserData(userId, token));
      navigation.replace("App");
    };
    loadUserData();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size={"large"} color={Colors.primaryColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SplashScreen;

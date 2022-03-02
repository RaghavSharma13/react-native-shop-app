import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/authActions";
import Colors from "../../constants/Colors";

const UPDATE_FORM_ACTION = "UpdateFormAction";

const formReducer = (state, action) => {
  if (action.type === UPDATE_FORM_ACTION) {
    // check everything and return new state
    const updatedValues = {
      ...state.inputValues,
      [action.inputType]: action.value,
    };
    const updatedValidties = {
      ...state.inputValidities,
      [action.inputType]: action.validity,
    };

    let updatedFormValidity = true;
    for (const key in updatedValidties) {
      updatedFormValidity = updatedFormValidity && updatedValidties[key];
    }

    return {
      inputValues: updatedValues,
      inputValidities: updatedValidties,
      formValidity: updatedFormValidity,
    };
  }
  return state;
};

const AuthScreen = () => {
  const [formState, dispatchFormReducer] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formValidity: false,
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormReducer({
        type: UPDATE_FORM_ACTION,
        inputType: inputIdentifier,
        value: inputValue,
        validity: inputValidity,
      });
    },
    [dispatchFormReducer]
  );

  const dispatch = useDispatch();

  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const authHandler = async () => {
    try {
      setIsLoading(true);
      setError(null);
      isSignUp
        ? await dispatch(
            authActions.signUp(
              formState.inputValues.email,
              formState.inputValues.password
            )
          )
        : await dispatch(
            authActions.signIn(
              formState.inputValues.email,
              formState.inputValues.password
            )
          );
    } catch (error) {
      console.log("handling2");
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error!", error, [{ text: "Ok" }]);
    }
  }, [error]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient style={styles.gradient} colors={["#ffedff", "#ffe3ff"]}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id={"email"}
              label={"E-mail"}
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address!"
              onInputChange={inputChangeHandler}
              initalValue=""
            />
            <Input
              id={"password"}
              label={"Password"}
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid Password!"
              onInputChange={inputChangeHandler}
              initalValue=""
            />
            <View style={styles.btnContainer}>
              {isLoading ? (
                <ActivityIndicator size={"small"} color={Colors.primaryColor} />
              ) : (
                <Button
                  title={isSignUp ? "SignUp" : "Login"}
                  onPress={authHandler}
                  color={Colors.primaryColor}
                />
              )}
            </View>
            <View style={styles.btnContainer}>
              <Button
                title={`Switch to Sign ${isSignUp ? "In" : "Up"}`}
                onPress={() => {
                  setIsSignUp((prevState) => !prevState);
                }}
                color={Colors.primaryColor}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxHeight: 400,
    maxWidth: 400,
    padding: 20,
  },
  btnContainer: {
    marginTop: 10,
  },
});

export default AuthScreen;

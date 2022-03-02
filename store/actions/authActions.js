import AsyncStorage from "@react-native-async-storage/async-storage";
import env from "../../env";

export const AUTHENTICATE = "Authenticate";

export const signUp = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${env.authKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = "Something went wrong!";

        switch (errorId) {
          case "EMAIL_EXISTS":
            message = "This Email Id already exists.";
        }

        throw new Error(message);
      }

      const resData = await response.json();

      // console.log(resData);

      dispatch({
        type: AUTHENTICATE,
        token: resData.idToken,
        userId: resData.localId,
      });

      storeUserData(
        resData.localId,
        resData.idToken,
        new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
      );
    } catch (error) {
      throw error;
    }
  };
};

export const signIn = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.authKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = "Something went wrong!";

        switch (errorId) {
          case "EMAIL_NOT_FOUND":
            message = "This Email Id does not exist!";
          case "INVALID_PASSWORD":
            message = "The entered password was incorrect!";
        }

        throw new Error(message);
      }

      const resData = await response.json();

      dispatch({
        type: AUTHENTICATE,
        token: resData.idToken,
        userId: resData.localId,
      });

      storeUserData(
        resData.localId,
        resData.idToken,
        new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
      );
    } catch (error) {
      console.log("handling");
      throw error;
    }
  };
};

export const setUserData = (userId, token) => {
  return {
    type: AUTHENTICATE,
    userId,
    token,
  };
};

export const LOGOUT = "Logout";
export const logout = () => {
  AsyncStorage.removeItem("userData");
  return {
    type: LOGOUT,
  };
};

const storeUserData = async (userId, token, expiryDate) => {
  try {
    await AsyncStorage.setItem(
      "userData",
      JSON.stringify({
        userId,
        token,
        expiryDate: expiryDate.toISOString(),
      })
    );
  } catch (error) {
    console.log(error);
  }
};

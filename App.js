import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import 'react-native-gesture-handler';
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import ReduxThunk from 'redux-thunk';
import SplashNavigation from "./navigation/SplashNavigation";
import authReducer from './store/reducers/authReducer';
import cartReducer from "./store/reducers/cartReducer";
import orderReducer from "./store/reducers/orderReducer";
import productsReducer from "./store/reducers/productsReducer";

const rootReducer = combineReducers({
  productReducer: productsReducer,
  cartReducer: cartReducer,
  orderReducer: orderReducer,
  authReducer: authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [fontLoaded] = useFonts({
    "openSans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "openSansBold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });

  if (!fontLoaded) {
    return <AppLoading />;
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SplashNavigation />
      </NavigationContainer>
    </Provider>
  );
}
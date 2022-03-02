import React, {
  useLayoutEffect,
  useState,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  createRef,
} from "react";
import {
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import * as productActions from "../../store/actions/productActions";

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

const EditProductsScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const productId = route.params.productId;
  const product = useSelector((root) =>
    root.productReducer.userProducts.find((prod) => prod.id === productId)
  );

  const [formState, dispatchFormReducer] = useReducer(formReducer, {
    inputValues: {
      title: product ? product.title : "",
      imageUrl: product ? product.imageUrl : "",
      price: product ? product.price : "",
      description: product ? product.description : "",
    },
    inputValidities: {
      title: product ? true : false,
      imageUrl: product ? true : false,
      price: product ? true : false,
      description: product ? true : false,
    },
    formValidity: product ? true : false,
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

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "Ok" }]);
    }
  }, [error]);

  const dispatch = useDispatch();
  const onSavePressed = useCallback(async () => {
    if (!formState.formValidity) {
      Alert.alert("Error", "Enter the correct inputs!!", [{ text: "Ok" }]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (productId) {
        await dispatch(
          productActions.updateProduct(productId, {
            title: formState.inputValues.title,
            imageUrl: formState.inputValues.imageUrl,
            price: parseInt(formState.inputValues.price),
            description: formState.inputValues.description,
          })
        );
      } else {
        await dispatch(
          productActions.createProduct({
            title: formState.inputValues.title,
            imageUrl: formState.inputValues.imageUrl,
            price: parseInt(formState.inputValues.price),
            description: formState.inputValues.description,
          })
        );
      }
      setIsLoading(false);
      navigation.goBack();
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  }, [dispatch, navigation, productId, formState]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName={
              Platform.OS === "android" ? "md-checkbox" : "ios-checkbox"
            }
            iconSize={23}
            color="white"
            onPress={onSavePressed}
          />
        </HeaderButtons>
      ),
    });
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primaryColor} size={"large"} />
      </View>
    );
  }

  const imageRef = createRef();
  const priceRef = createRef();
  const descriptionRef = createRef();

  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          id={"title"}
          forwardRef={imageRef}
          label={"Title"}
          errorText={"Please enter a valid title!"}
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          initialValue={product ? product.title : ""}
          initialValidity={product ? true : false}
          required
        />
        <Input
          forwardRef={product ? descriptionRef : priceRef}
          ref={imageRef}
          id={"imageUrl"}
          label={"Image Url"}
          errorText={"Please enter a valid image url!"}
          keyboardType="default"
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          initialValue={product ? product.imageUrl : ""}
          initialValidity={product ? true : false}
          required
        />
        {product ? null : (
          <Input
            forwardRef={descriptionRef}
            ref={priceRef}
            id={"price"}
            label={"Price"}
            errorText={"Please enter a valid price!"}
            keyboardType="decimal-pad"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            required
            min={0.1}
          />
        )}
        <Input
          ref={descriptionRef}
          id={"description"}
          label={"Description"}
          errorText={"Please enter a valid description!"}
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={3}
          onInputChange={inputChangeHandler}
          initialValue={product ? product.description : ""}
          initialValidity={product ? true : false}
          required
          minLength={5}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProductsScreen;

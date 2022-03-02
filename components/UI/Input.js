import React, { forwardRef, useEffect, useReducer } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const INPUT_CHANGE = "InputChange";
const INPUT_BLUR = "InputBlur";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        inputValue: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const Input = forwardRef(
  (
    {
      initialValue,
      initialValidity,
      onInputChange,
      id,
      label,
      errorText,
      forwardRef,
      ...rest
    },
    ref
  ) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
      inputValue: initialValue ? initialValue : "",
      isValid: initialValidity,
      touched: false,
    });

    useEffect(() => {
      if (inputState.touched) {
        onInputChange(id, inputState.inputValue, inputState.isValid);
      }
    }, [inputState, onInputChange, id]);

    const textChangeHandler = (text) => {
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let isValid = true;
      if (rest.required && text.trim().length === 0) {
        isValid = false;
      }
      if (rest.email && !emailRegex.test(text.toLowerCase())) {
        isValid = false;
      }
      if (rest.min != null && +text < rest.min) {
        isValid = false;
      }
      if (rest.max != null && +text > rest.max) {
        isValid = false;
      }
      if (rest.minLength != null && text.length < rest.minLength) {
        isValid = false;
      }
      dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
    };

    const lostFocusHandler = () => {
      dispatch({ type: INPUT_BLUR });
    };

    return (
      <View style={styles.formControl}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          ref={ref}
          {...rest}
          style={styles.input}
          value={inputState.inputValue}
          onChangeText={textChangeHandler}
          onBlur={lostFocusHandler}
          onSubmitEditing={() => {
            if (forwardRef) forwardRef.current.focus();
          }}
          blurOnSubmit={forwardRef ? false : true}
        />
        {inputState.touched && !inputState.isValid && (
          <Text style={styles.error}>{errorText}</Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "openSansBold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  error: {
    color: "red",
  },
});

export default Input;

import Product from "../../models/Product";

export const SET_PRODUCTS = "SetProducts";
export const setProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    const token = getState().authReducer.token;

    try {
      const res = await fetch(
        `https://rn-shop-db-default-rtdb.asia-southeast1.firebasedatabase.app/products.json?auth=${token}`
      );

      if (!res.ok) {
        throw new Error("Products were not Fetched!!!!");
      }

      const response = await res.json();

      const loadedData = [];

      for (const key in response) {
        const { title, description, imageUrl, price, ownerId } = response[key];
        loadedData.push(
          new Product(key, ownerId, title, imageUrl, description, price)
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        loadedData,
        userProducts: loadedData.filter((prod) => prod.ownerId === userId),
      });
    } catch (err) {
      if (err.msg) throw err;
      else throw new Error("An Error Occurred");
    }
  };
};

export const REMOVE_PRODUCT = "RemoveProduct";
export const removeProduct = (pid) => {
  return async (dispatch, getState) => {
    const token = getState().authReducer.token;
    await fetch(
      `https://rn-shop-db-default-rtdb.asia-southeast1.firebasedatabase.app/products/${pid}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    dispatch({
      type: REMOVE_PRODUCT,
      pid,
    });
  };
};

export const CREATE_PRODUCT = "CreateProduct";
export const createProduct = (newProduct) => {
  return async (dispatch, getState) => {
    const token = getState().authReducer.token;
    const userId = getState().authReducer.userId;
    try {
      const response = await fetch(
        `https://rn-shop-db-default-rtdb.asia-southeast1.firebasedatabase.app/products.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newProduct,
            ownerId: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const id = await response.json();

      dispatch({
        type: CREATE_PRODUCT,
        product: {
          ...newProduct,
          id,
          ownerId: userId,
        },
      });
    } catch (err) {
      throw new Error(
        "An Error Occurred. Try again later if the problem persists."
      );
    }
  };
};

export const UPDATE_PRODUCT = "UpdateProduct";
export const updateProduct = (pid, product) => {
  return async (dispatch, getState) => {
    const token = getState().authReducer.token;
    const userId = getState().authReducer.userId;
    try {
      const response = await fetch(
        `https://rn-shop-db-default-rtdb.asia-southeast1.firebasedatabase.app/products/${pid}.json?auth=${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...product,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      dispatch({
        type: UPDATE_PRODUCT,
        pid,
        product,
        ownerId: userId,
      });
    } catch (err) {
      throw new Error(
        "An Error Occurred. Please try again later if the problem persists."
      );
    }
  };
};

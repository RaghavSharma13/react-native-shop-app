import PRODUCTS from "../../data/dummy-data";
import Product from "../../models/Product";
import {
  CREATE_PRODUCT,
  REMOVE_PRODUCT,
  SET_PRODUCTS,
  UPDATE_PRODUCT,
} from "../actions/productActions";

const initialState = {
  availableProducts: [],
  userProducts: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS: {
      return {
        availableProducts: action.loadedData,
        userProducts: action.userProducts,
      };
    }
    case REMOVE_PRODUCT: {
      const pid = action.pid;
      return {
        ...state,
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== pid
        ),
        userProducts: state.userProducts.filter(
          (product) => product.id !== pid
        ),
      };
    }
    case CREATE_PRODUCT: {
      const prodDetails = action.product;
      const newProduct = new Product(
        prodDetails.id,
        action.ownerId,
        prodDetails.title,
        prodDetails.imageUrl,
        prodDetails.description,
        prodDetails.price
      );

      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };
    }
    case UPDATE_PRODUCT: {
      const pid = action.pid;
      const prodDetails = action.product;

      const newProduct = new Product(
        pid,
        action.ownerId,
        prodDetails.title,
        prodDetails.imageUrl,
        prodDetails.description,
        prodDetails.price
      );

      const oldAvailableProductIndex = state.availableProducts.findIndex(
        (prod) => prod.id === pid
      );
      const oldUserProductIndex = state.userProducts.findIndex(
        (prod) => prod.id === pid
      );

      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[oldAvailableProductIndex] = newProduct;

      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[oldUserProductIndex] = newProduct;

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };
    }
    default:
      return state;
  }
};

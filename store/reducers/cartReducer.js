import CartItem from "../../models/CartItem";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cartActions";
import { ADD_ORDER } from "../actions/orderActions";
import { REMOVE_PRODUCT } from "../actions/productActions";

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const product = action.product;
      const id = product.id;
      let newCartItem;
      if (state.items[product.id]) {
        // increase the quantity and total amount
        newCartItem = new CartItem(
          state.items[id].qty + 1,
          state.items[id].title,
          state.items[id].price,
          state.items[id].sum + state.items[id].price
        );
      } else {
        // add a new Entry
        newCartItem = new CartItem(
          1,
          product.title,
          product.price,
          product.price
        );
      }
      return {
        ...state,
        items: { ...state.items, [id]: newCartItem },
        totalAmount: state.totalAmount + product.price,
      };
    }
    case REMOVE_FROM_CART: {
      const productId = action.productId;
      let updatedItems;
      if (!state.items.hasOwnProperty(productId))
        throw Error(`IllegalArgumentException: ${productId} was found.`);
      else {
        if (state.items[productId].qty === 1) {
          updatedItems = { ...state.items };
          delete updatedItems[productId];
        } else {
          const newCartItem = new CartItem(
            state.items[productId].qty - 1,
            state.items[productId].title,
            state.items[productId].price,
            state.items[productId].sum - state.items[productId].price
          );
          updatedItems = { ...state.items, [productId]: newCartItem };
        }
        const updatedAmount = state.totalAmount - state.items[productId].price;
        return {
          ...state,
          items: updatedItems,
          totalAmount: updatedAmount >= 0 ? updatedAmount : 0,
        };
      }
    }
    case ADD_ORDER: {
      return initialState;
    }
    case REMOVE_PRODUCT: {
      const pid = action.pid;
      if (state.items[pid]) {
        const updatedItems = { ...state.items };
        const product = updatedItems[pid];
        delete updatedItems[pid];
        return {
          ...state,
          items: updatedItems,
          totalAmount: state.totalAmount - product.sum,
        };
      } else {
        return { ...state };
      }
    }
    default:
      return { ...state };
  }
};

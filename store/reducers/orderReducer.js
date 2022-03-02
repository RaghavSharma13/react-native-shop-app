import { ADD_ORDER, GET_ORDERS } from "../actions/orderActions";
import Order from "../../models/Order";
const initialState = {
  items: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDER: {
      const newOrder = new Order(
        action.order.id,
        action.order.items,
        action.order.amount,
        action.order.date
      );
      return {
        items: state.items.concat(newOrder),
      };
    }
    case GET_ORDERS: {
      return {
        items: action.orders,
      };
    }
    default:
      return { ...state };
  }
};

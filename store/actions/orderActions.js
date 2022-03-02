import Order from "../../models/Order";

export const ADD_ORDER = "AddOrder";
export const addOrder = (items, amount) => {
  return async (dispatch, getState) => {
    const date = new Date().toISOString();
    const token = getState().authReducer.token;
    const userId = getState().authReducer.userId;
    const response = await fetch(
      `https://rn-shop-db-default-rtdb.asia-southeast1.firebasedatabase.app/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          totalAmount: amount,
          date,
        }),
      }
    );

    if (!response.ok) {
      throw new Error();
    }

    const { name } = await response.json();

    dispatch({
      type: ADD_ORDER,
      order: {
        id: name,
        items,
        amount,
        date,
      },
    });
  };
};

export const GET_ORDERS = "GetOrders";
export const getOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    const token = getState().authReducer.token;
    try {
      const response = await fetch(
        `https://rn-shop-db-default-rtdb.asia-southeast1.firebasedatabase.app/orders/${userId}.json?auth=${token}`
      );

      if (!response.ok) throw new Error();

      const resData = await response.json();

      let orders = [];

      for (const key in resData) {
        const { date, items, totalAmount } = resData[key];
        orders.push(new Order(key, items, totalAmount, date));
      }

      dispatch({
        type: GET_ORDERS,
        orders,
      });
    } catch (err) {
      throw new Error("No Orders Found. Try again later or place a few.");
    }
  };
};

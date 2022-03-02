export const ADD_TO_CART = "AddToCart";
export const addToCart = (product) => {
  return {
    type: ADD_TO_CART,
    product: product,
  };
};
export const REMOVE_FROM_CART = "RemoveFromCart";
export const removeFromCart = (productId) => {
  return {
    type: REMOVE_FROM_CART,
    productId: productId,
  };
};

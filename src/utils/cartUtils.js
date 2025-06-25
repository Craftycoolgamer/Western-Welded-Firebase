export const getCartItemCount = (cart) => {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((count, item) => count + (item.quantity || 0), 0);
};

export const getCartTotal = (cart) => {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  );
};
import { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';


const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { showNotification } = useNotification();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('jewelryCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('jewelryCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      // Create a unique key that includes size for products with sizes
      const itemKey = product.selectedSize 
        ? `${product.id}-${product.selectedSize}`
        : product.id;

      const existingItemIndex = prevCart.findIndex(item => 
        (product.selectedSize 
          ? item.id === product.id && item.selectedSize === product.selectedSize
          : item.id === product.id)
      );

      if (existingItemIndex >= 0) {
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + product.quantity
        };
        return newCart;
      }
      
      return [...prevCart, { ...product, itemKey }];
    });
  };

  const removeFromCart = (itemKey) => {
    setCart(prevCart => prevCart.filter(item => 
      item.itemKey !== itemKey && item.id !== itemKey
    ));
    showNotification(`${itemKey.name} removed from cart`, 'warning');
  };

  const updateQuantity = (productId, newQuantity, size) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        (size 
          ? item.id === productId && item.selectedSize === size
          : item.id === productId)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
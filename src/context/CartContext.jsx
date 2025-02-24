import { createContext, useContext, useState, useEffect } from "react";
import {
  addItemToDB,
  getCartFromDB,
  updateItemQuantityInDB,
  removeItemFromDB,
  clearCartDB,
} from "../utilis/indexedDB";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from IndexedDB on mount
  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await getCartFromDB();
      setCart(storedCart);
    };
    loadCart();
  }, []);
  // Add item to cart
  const addToCart = async (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });

    await addItemToDB({ ...item, quantity: 1 });
  };

  // Update item quantity
  const updateQuantity = async (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    await updateItemQuantityInDB(id, quantity);
  };

  // Remove item from cart
  const removeFromCart = async (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    await removeItemFromDB(id);
  };

  const clearCart = async () => {
    setCart([]); // Reset the state
    await clearCartDB(); // Clear IndexedDB storage
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using the cart
export const useCart = () => {
  return useContext(CartContext);
};

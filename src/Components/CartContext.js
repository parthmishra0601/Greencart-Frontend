// src/context/CartContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
export const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  // --- NEW: State for managing favorite items ---
  const [favoriteItems, setFavoriteItems] = useState([]);

  // Function to add an item to the cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart to avoid duplicates or update quantity
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // If you want to handle quantity (e.g., increment if already in cart):
        return prevItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 } : cartItem
        );
        // For now, if you just want to prevent adding duplicates without quantity increment:
        // return prevItems;
      }
      return [...prevItems, { ...item, quantity: 1 }]; // Add new item with a default quantity
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // --- NEW: Function to toggle an item's favorite status ---
  const toggleFavorite = (item) => {
    setFavoriteItems((prevFavorites) => {
      const isCurrentlyFavorite = prevFavorites.some((favItem) => favItem.id === item.id);
      if (isCurrentlyFavorite) {
        return prevFavorites.filter((favItem) => favItem.id !== item.id); // Remove if it's already a favorite
      } else {
        return [...prevFavorites, item]; // Add if it's not a favorite
      }
    });
  };

  // Value to be provided to consumers
  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    setCartItems, // Provided for potential direct updates, if necessary
    favoriteItems,   // --- NEW: Expose favoriteItems state ---
    toggleFavorite,  // --- NEW: Expose toggleFavorite function ---
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to easily consume the cart context
export const useCart = () => {
  return useContext(CartContext);
};
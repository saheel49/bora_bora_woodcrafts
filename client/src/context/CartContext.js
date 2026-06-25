import React, { createContext, useContext, useReducer } from "react";

// ─── Cart Context ─────────────────────────────────────────────────────────────
const CartContext = createContext();

// Cart reducer handles all cart operations
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        // Increase quantity if already in cart
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload);

    case "UPDATE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

// Provider wraps the entire app
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addItem    = (product)              => dispatch({ type: "ADD_ITEM",        payload: product });
  const removeItem = (id)                   => dispatch({ type: "REMOVE_ITEM",     payload: id });
  const updateQty  = (id, quantity)         => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart  = ()                     => dispatch({ type: "CLEAR_CART" });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal   = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for easy access
export function useCart() {
  return useContext(CartContext);
}

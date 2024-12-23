// context/cart.jsx

import { useReducer, createContext, useEffect } from "react";
import { cartReducer, cartInitialState } from "../reducers/cartReducer";
import axios from "axios";

// Crear contexto
export const CartContext = createContext();

// Proveedor del carrito
function useCartReducer() {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);

  const getUserToken = () => localStorage.getItem("token");

  const addToCart = async (sessionData) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/checkout/cart",
        sessionData,
        {
          headers: { Authorization: `Bearer ${getUserToken()}` },
        }
      );
      dispatch({
        type: "ADD_TO_CART",
        payload: response.data,
      });
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3001/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${getUserToken()}` },
      });
      dispatch({
        type: "REMOVE_FROM_CART",
        payload: itemId,
      });
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/checkout/cart",
        {
          headers: { Authorization: `Bearer ${getUserToken()}` },
        }
      );

      const cartItems = response.data?.cart?.items || [];
      dispatch({
        type: "SET_CART",
        payload: cartItems,
      });
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    }
  };

  return { state, addToCart, removeFromCart, clearCart, fetchCart };
}

export function CartProvider({ children }) {
  const { state, addToCart, removeFromCart, clearCart, fetchCart } =
    useCartReducer();

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

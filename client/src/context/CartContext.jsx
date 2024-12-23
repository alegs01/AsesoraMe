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

      console.log("Datos enviados al carrito:", sessionData);
      console.log("Respuesta del carrito:", response.data);

      dispatch({
        type: "ADD_TO_CART",
        payload: response.data.cart.items[0], // Solo agrega el primer item al carrito
      });
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  const removeFromCart = async (sessionId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/session/${sessionId}`,
        {
          headers: { Authorization: `Bearer ${getUserToken()}` },
        }
      );

      if (response.status === 200) {
        console.log("Sesión eliminada y carrito vaciado");

        // Vaciar el estado local del carrito
        dispatch({ type: "REMOVE_FROM_CART" });
      } else {
        console.error("Error al eliminar la sesión:", response.data.message);
      }
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

      console.log("Carrito obtenido del backend:", response.data.cart);

      dispatch({
        type: "SET_CART",
        payload: response.data.cart.items || [], // Asegúrate de procesar los ítems correctamente
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
        cart: state.cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

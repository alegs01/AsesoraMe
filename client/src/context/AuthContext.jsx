import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Reducer para manejar el estado global de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_EXITOSO":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        authStatus: true,
      };

    case "LOGOUT_USUARIO":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        authStatus: false,
        sessionURL: null,
      };

    case "GET_DATA_USER":
      return {
        ...state,
        user: action.payload,
        authStatus: true,
      };

    case "GET_CHECKOUT_SESSION":
      return {
        ...state,
        sessionURL: action.payload,
      };

    case "CHANGE_STATUS_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

// Estado inicial del contexto de autenticación
const initialAuthState = {
  user: null,
  authStatus: false,
  sessionURL: null,
  loading: false,
};

// Crear contexto
const AuthContext = createContext(initialAuthState);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Obtener token desde localStorage
  const getUserToken = () => localStorage.getItem("token");

  // Manejar inicio de sesión
  const Login = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/user/login",
        data
      );
      dispatch({
        type: "LOGIN_EXITOSO",
        payload: { token: response.data.token, user: response.data.user },
      });

      console.log("Usuario autenticado:", response.data.user);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return error.response?.data?.message || "Error desconocido.";
    }
  };

  // Manejar registro de usuario
  const registerAuth = async (data) => {
    try {
      await axios.post("http://localhost:3001/api/user/register", data);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      return error.response?.data?.message || "Error desconocido.";
    }
  };

  // Cerrar sesión
  const Logout = () => {
    dispatch({ type: "LOGOUT_USUARIO" });
  };

  // Obtener sesión de pago
  const getCheckoutSession = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/checkout", {
        headers: {
          Authorization: `Bearer ${getUserToken()}`,
        },
      });
      dispatch({ type: "GET_CHECKOUT_SESSION", payload: response.data.url });
      return response.data.url;
    } catch (error) {
      console.error("Error al obtener la sesión de pago:", error);
      return null;
    }
  };

  // Validar usuario al cargar la aplicación
  useEffect(() => {
    const token = getUserToken();

    if (token) {
      axios.defaults.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token cargado desde localStorage:", token);

      (async () => {
        try {
          const decodedToken = jwtDecode(token);
          console.log("Token decodificado:", decodedToken);

          if (!decodedToken?.id) {
            throw new Error("Token inválido o sin ID de usuario.");
          }

          const response = await axios.get(
            `http://localhost:3001/api/user/id/${decodedToken.id}`
          );

          dispatch({ type: "GET_DATA_USER", payload: response.data });
          console.log("Estado global actualizado con el usuario:", state.user);
        } catch (error) {
          console.error("Error al validar usuario:", error);
          Logout();
        }
      })();
    }
  }, []);

  // Contexto de valor
  const value = {
    user: state.user,
    authStatus: state.authStatus,
    sessionURL: state.sessionURL,
    loading: state.loading,
    Login,
    Logout,
    registerAuth,
    getCheckoutSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para consumir el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getUserToken = () => {
    return localStorage.getItem("token");
  };

  const Login = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/user/login",
        data
      );
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      console.log(response);
    } catch (error) {
      return error.response.data.message;
    }
  };

  const registerAuth = async (data) => {
    try {
      await axios.post("http://localhost:3001/api/user/register", data);
    } catch (error) {
      return error.response.data.message;
    }
  };

  const Logout = () => {
    try {
      // Eliminar el token del localStorage
      localStorage.removeItem("token");

      // Limpiar el estado del usuario
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      return "Error al cerrar sesión.";
    }
  };

  useEffect(() => {
    const token = getUserToken();
    if (token) {
      axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const value = {
    user,
    setUser,
    Login,
    Logout,
    registerAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

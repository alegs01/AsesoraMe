// ./src/context/User/UserState.js
import { useReducer } from "react";

import UserReducer from "./UserReducer";
import UserContext from "./UserContext";
import axiosClient from "../../config/axios";
import getToken from "../../config/token";

const UserState = (props) => {
  const initialState = {
    currentUser: {
      name: "",
      lastname: "",
      country: "",
      address: "",
      email: "",
      receipts: [],
      zipcode: 0,
    },
    cart: [],
    authStatus: false,
    globalLoading: false,
    sessionURL: null,
  };

  const [globalState, dispatch] = useReducer(UserReducer, initialState);

  const registerUser = async (form) => {
    try {
      const res = await axiosClient.post("/users/create", form);
      const token = res.data.data;

      dispatch({
        type: "REGISTRO_EXITOSO",
        payload: token,
      });

      return;
    } catch (error) {
      console.log(error);
      return error.response.data.msg;
    }
  };

  const loginUser = async (form) => {
    try {
      const res = await axiosClient.post("/users/login", form);

      const token = res.data.data;

      dispatch({
        type: "LOGIN_EXITOSO",
        payload: token,
      });

      return;
    } catch (error) {
      return error.response.data.msg;
    }
  };

  const verifyingToken = async () => {
    getToken();

    try {
      const res = await axiosClient.get("/users/verifytoken");

      const userData = res.data.data;

      dispatch({
        type: "GET_DATA_USER",
        payload: userData,
      });
    } catch (error) {
      return;
    }
  };

  const logoutUser = async () => {
    dispatch({
      type: "LOGOUT_USUARIO",
    });
  };

  const setLoading = (status) => {
    dispatch({
      type: "CHANGE_STATUS_LOADING",
      dispatch: status,
    });
  };

  const getCheckoutSession = async () => {
    getToken();

    const res = await axiosClient.get("checkout/create-checkout-session");

    dispatch({
      type: "GET_CHECKOUT_SESSION",
      payload: res.data.session_url,
    });
  };

  const userSubmitForm = async (dataform) => {
    getToken();

    await axiosClient.put("users/update", dataform);
  };

  // 4. RETORNO
  return (
    <UserContext.Provider
      value={{
        currentUser: globalState.currentUser,
        cart: globalState.cart,
        authStatus: globalState.authStatus,
        globalLoading: globalState.globalLoading,
        sessionURL: globalState.sessionURL,
        registerUser,
        loginUser,
        verifyingToken,
        logoutUser,
        setLoading,
        getCheckoutSession,
        userSubmitForm,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
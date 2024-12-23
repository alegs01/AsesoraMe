export const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      console.log("ADD_TO_CART llamado con payload:", action.payload);
      return { ...state, cart: [...state.cart, action.payload] };

    case "REMOVE_FROM_CART":
      return { ...state, cart: [] };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    case "SET_CART":
      return { ...state, cart: action.payload.items || [] }; // Maneja items correctamente

    default:
      return state;
  }
};

export const cartInitialState = {
  cart: [],
};

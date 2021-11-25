import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

// using react context and reducer to set the dart mode and light mode of the application
export const Store = createContext();

const initialState = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,

  // defining cart as an object from the initial stage;
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [], // default value is an empty array; no item in the cart;

    shippingAddress: Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress'))
      : { location: {} }, // default value is an empty array;

    // Was not implemented in original video
    paymentMethod: Cookies.get('paymentMethod')
      ? Cookies.get('paymentMethod')
      : '', // default value is an empty string;
  },

  // defining the initial state of the userInfo

  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    // defining a case for the dark mode on
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    // defining a case for the dark mode off
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };

    // defining a case for the CART_ADD_ITEM
    case 'CART_ADD_ITEM': {
      // get the new item from the slug which is the item that is being added to cart
      const newItem = action.payload;

      // check the cart item in the state of new item to know if it already exists.
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id,
      );

      // if this returns true, it means we already have the new item in the cart, then just increase the quantity
      const cartItems = existItem // the new value for cart items
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item,
          )
        : // if no item is found then add the item to cart
          [...state.cart.cartItems, newItem];

      console.log('Search items: ', state.cart.Cookies);

      // set the cookie values for the cart items;
      Cookies.set('cartItems', JSON.stringify(cartItems));

      // return the previous value in the state and also the previous value of the cart object
      // and concatenate the new item to be added to cart
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        // action.payload is the item that will be deleted according to this function inside the
        // cart component removeItemHandler() that passed the cart item to be deleted to the payload
        // filter keeps all items and removes only the item that is equal to the action.payload
        (cartItem) => cartItem._id !== action.payload._id,
      );

      // set the cookie values for the cart items;
      Cookies.set('cartItems', JSON.stringify(cartItems));

      // return the previous value in the state and also the previous value of the cart object
      // and concatenate the new item to be added to cart
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    // the case for saving the shipping address
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        // cart: { ...state.cart, shippingAddress: action.payload }, // value before google map
        cart: {
          ...state.cart,
          shippingAddress: { ...state.cart.shippingAddress, ...action.payload },
        }, // value after google map
      };

    // the case for shipping address chosen from map
    case 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            location: action.payload,
          },
        },
      };

    // the case for saving the payment method
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };

    // case for clearing the cart after the order have been placed
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    // the case for the user login will return the current state and the userInfo which is the
    // action dot payload. Payload in the regard is the data that is returned from the backend
    // ajax post request that is sent from the front end.
    case 'USER_LOGIN':
      return { ...state, userInfo: action.payload };

    // the case for the user logout will return the current state and the userInfo
    // and then set the userInfo back to null and also set the cartItems to an empty array
    // ajax post request that is sent from the front end.
    case 'USER_LOGOUT':
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [] },
        // shippingAddress: {}, // before map implementation
        shippingAddress: { location: {} },
        paymentMethod: '',
      };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  // this Store is coming from the Store defined up there
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

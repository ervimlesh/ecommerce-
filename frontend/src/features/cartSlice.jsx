import { createSlice } from "@reduxjs/toolkit";

const items =
  localStorage.getItem("cart") != null
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
const allQuantity =
  localStorage.getItem("totalQuantity") != null
    ? JSON.parse(localStorage.getItem("totalQuantity"))
    : 0;
const totalAmount =
  localStorage.getItem("totalPrice") != null
    ? JSON.parse(localStorage.getItem("totalPrice"))
    : 0;

const initialState = {
  cart: items,
  totalQuantity: allQuantity,
  totalPrice: totalAmount,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      let find = state.cart.findIndex(
        (item) => item._id === action.payload._id
      );
      if (find >= 0) {
        state.cart[find].quantity += 1;
      } else {
        state.cart.push(action.payload);
      }
    },

    getCartTotal: (state) => {
      let { totalQuantity, totalPrice } = state.cart.reduce(
        (cartTotal, cartItem) => {
          // console.log("carttotal", cartTotal);
          // console.log("cartitem", cartItem);
          const { price, quantity } = cartItem;
          // console.log(price, quantity);
          const itemTotal = price * quantity;
          cartTotal.totalPrice += itemTotal;
          cartTotal.totalQuantity += quantity;
          return cartTotal;
        },
        {
          totalPrice: 0,
          totalQuantity: 0,
        }
      );
      state.totalPrice = parseInt(totalPrice.toFixed(2));
      state.totalQuantity = totalQuantity;

      localStorage.setItem(
        "cart",
        JSON.stringify(state.cart.map((item) => item))
      );
      localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice));
      localStorage.setItem(
        "totalQuantity)",
        JSON.stringify(state.totalQuantity)
      );
    },

    removeItem: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
    },
    increaseItemQuantity: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item._id === action.payload) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    },
    decreaseItemQuantity: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item._id === action.payload) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    },
  },
});

export const {
  addToCart,
  getCartTotal,
  removeItem,
  increaseItemQuantity,
  decreaseItemQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;

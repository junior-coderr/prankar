// redux/slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  element: 0,
  credits: null,
};
export const transaction = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setElem: (state, action) => {
      state.element = action.payload;
    },
    setCredits: (state, action) => {
      state.credits = action.payload;
    },
  },
});

export const { setElem, setCredits } = transaction.actions;
export default transaction.reducer;

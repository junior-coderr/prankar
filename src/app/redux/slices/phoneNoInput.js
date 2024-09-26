// redux/slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: "",
  prefix: "+91",
};
export const phoneNoInputSlice = createSlice({
  name: "phoneNoInput",
  initialState,
  reducers: {
    setPhoneNo: (state, action) => {
      state.value = action.payload;
    },
    setPrefix: (state, action) => {
      state.prefix = action.payload;
    },
    clearPhoneNo: (state) => {
      state.value = "";
    },
  },
});

export const { setPhoneNo, clearPhoneNo, setPrefix } =
  phoneNoInputSlice.actions;
export default phoneNoInputSlice.reducer;

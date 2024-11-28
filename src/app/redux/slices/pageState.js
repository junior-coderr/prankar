import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentScroll: 0,
};

export const pageStateSlice = createSlice({
  name: "pageState",
  initialState,
  reducers: {
    setCurrentScroll: (state, action) => {
      state.currentScroll = action.payload;
    },
  },
});

export const { setCurrentScroll } = pageStateSlice.actions;
export default pageStateSlice.reducer;

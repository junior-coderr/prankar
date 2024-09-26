import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

const sidSlice = createSlice({
  name: "sid",
  initialState,
  reducers: {
    setSid: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setSid } = sidSlice.actions;
export default sidSlice.reducer;

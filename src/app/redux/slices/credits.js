import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
  isLoading: false,
};

const creditsSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    setCredits: (state, action) => {
      state.value = action.payload;
      state.isLoading = false;
    },
    setCreditsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredits, setCreditsLoading } = creditsSlice.actions;
export default creditsSlice.reducer;

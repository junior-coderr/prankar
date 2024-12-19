import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
  loading: true,
};

export const creditsSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    setCredits: (state, action) => {
      state.value = action.payload;
      state.loading = false;
    },
    setCreditsLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setCredits, setCreditsLoading } = creditsSlice.actions;
export default creditsSlice.reducer;

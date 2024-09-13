// redux/slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  audioSelected: null,
};
export const audioSelectedSlice = createSlice({
  name: "audioSelected",
  initialState,
  reducers: {
    setAudioSelected: (state, action) => {
      state.audioSelected = action.payload;
    },
    clearAudioSelected: (state) => {
      state.audioSelected = null;
    },
  },
});

export const { setAudioSelected, clearAudioSelected } =
  audioSelectedSlice.actions;
export default audioSelectedSlice.reducer;

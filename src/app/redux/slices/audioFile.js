// redux/slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  audioFile: null,
};
export const audioFileSlice = createSlice({
  name: "audioFile",
  initialState,
  reducers: {
    setAudioFile: (state, action) => {
      state.audioFile = action.payload;
    },
    clearAudioFile: (state) => {
      state.audioFile = null;
    },
  },
});

export const { setAudioFile, clearAudioFile } = audioFileSlice.actions;
export default audioFileSlice.reducer;

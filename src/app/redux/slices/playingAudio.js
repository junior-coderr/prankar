// redux/slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: null,
};
export const playingAudioSlice = createSlice({
  name: "playingAudio",
  initialState,
  reducers: {
    setPlayingAudio: (state, action) => {
      state.value = action.payload;
    },
    clearPlayingAudio: (state) => {
      state.value = null;
    },
  },
});

export const { setPlayingAudio, clearPlayingAudio } = playingAudioSlice.actions;
export default playingAudioSlice.reducer;

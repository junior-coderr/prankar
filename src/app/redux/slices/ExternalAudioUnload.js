// redux/slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: false,
};
export const externalAudioUnloadSlice = createSlice({
  name: "externalAudioUnload",
  initialState,
  reducers: {
    setExternalAudioUnload: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setExternalAudioUnload } = externalAudioUnloadSlice.actions;
export default externalAudioUnloadSlice.reducer;

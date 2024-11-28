import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  phoneNumber: "",
  prefix: "+91",
  selectedAudioIndex: null,
  customAudioFile: null,
  currentPage: 0,
};

export const persistedStateSlice = createSlice({
  name: "persistedState",
  initialState,
  reducers: {
    setPersistedPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setPersistedPrefix: (state, action) => {
      state.prefix = action.payload;
    },
    setPersistedSelectedAudioIndex: (state, action) => {
      state.selectedAudioIndex = action.payload;
    },
    setPersistedCustomAudioFile: (state, action) => {
      state.customAudioFile = action.payload;
    },
    setPersistedCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearPersistedState: (state) => {
      state.phoneNumber = "";
      state.prefix = "+91";
      state.selectedAudioIndex = null;
      state.customAudioFile = null;
      state.currentPage = 0;
    },
  },
});

export const {
  setPersistedPhoneNumber,
  setPersistedPrefix,
  setPersistedSelectedAudioIndex,
  setPersistedCustomAudioFile,
  setPersistedCurrentPage,
  clearPersistedState,
} = persistedStateSlice.actions;

export default persistedStateSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import phoneNoInputReducer from "./slices/phoneNoInput";
import audioFileReducer from "./slices/audioFile";
import audioSelectedReducer from "./slices/audioSelected";
import playingAudioReducer from "./slices/playingAudio";
export const store = configureStore({
  reducer: {
    phoneNoInput: phoneNoInputReducer,
    audioFile: audioFileReducer,
    audioSelected: audioSelectedReducer,
    playingAudio: playingAudioReducer,
  },
});

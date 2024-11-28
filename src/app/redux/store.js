import { configureStore } from "@reduxjs/toolkit";
import phoneNoInputReducer from "./slices/phoneNoInput";
import audioFileReducer from "./slices/audioFile";
import audioSelectedReducer from "./slices/audioSelected";
import playingAudioReducer from "./slices/playingAudio";
import sidReducer from "./slices/sid";
import externalAudioUnloadReducer from "./slices/ExternalAudioUnload";
import transaction from "./slices/transaction.payment";
import pageStateReducer from "./slices/pageState";
import persistedStateReducer from "./slices/persistedState";

export const store = configureStore({
  reducer: {
    phoneNoInput: phoneNoInputReducer,
    audioFile: audioFileReducer,
    audioSelected: audioSelectedReducer,
    playingAudio: playingAudioReducer,
    sid: sidReducer,
    externalAudioUnload: externalAudioUnloadReducer,
    transaction: transaction,
    pageState: pageStateReducer,
    persistedState: persistedStateReducer,
  },
});

import { configureStore } from "@reduxjs/toolkit";
import phoneNoInputReducer from "./slices/phoneNoInput";

export const store = configureStore({
  reducer: {
    phoneNoInput: phoneNoInputReducer,
  },
});

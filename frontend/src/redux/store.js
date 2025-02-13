import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSLice from "./jobSlice";
const store = configureStore({
  reducer: {
    auth: authSlice,
    job: jobSLice,
  },
});

export default store;

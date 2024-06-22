import { configureStore } from "@reduxjs/toolkit";
import betsReducer from "./slices/betsSlice";

export default configureStore({
  reducer: {
    bets: betsReducer,
  },
});

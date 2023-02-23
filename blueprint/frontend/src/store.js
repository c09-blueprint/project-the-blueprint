// ! This file contains the redux store used across the app
import { configureStore } from "@reduxjs/toolkit";

import exampleReducer from "./reducers/exampleReducer";
import userReducer from "./reducers/userReducer";

// create store for redux
const store = configureStore({
  reducer: {
    example: exampleReducer,
    user: userReducer,
  },
});

export default store;

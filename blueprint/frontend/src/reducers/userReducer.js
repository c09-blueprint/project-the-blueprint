import { createSlice } from "@reduxjs/toolkit";

import { userServices } from "../services/userService";

const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

// get logged in user
export const getMe = (email, token) => {
  return async (dispatch) => {
    const loggedinUser = await userServices.me(email, token);
    dispatch(setUser(loggedinUser));
  };
};

export default userSlice.reducer;

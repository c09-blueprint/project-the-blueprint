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

// example of a reducer to add an example to the store
export const createUser = (user) => {
  return async (dispatch) => {
    const createdUser = await userServices.create(user);
    dispatch(setUser(createdUser));
  };
};

// get logged in user
export const getMe = () => {
  return async (dispatch) => {
    const loggedinUser = await userServices.me();
    dispatch(setUser(loggedinUser));
  };
};

export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modifiedNodes: false,
  modifiedEdges: false,
};

const userStateSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    setUserModifiedNodes(state, action) {
      return { ...state, modifiedNodes: action.payload };
    },
    setUserModifiedEdges(state, action) {
      return { ...state, modifiedEdges: action.payload };
    },
  },
});

export const { setUserModifiedNodes, setUserModifiedEdges } =
  userStateSlice.actions;

export default userStateSlice.reducer;

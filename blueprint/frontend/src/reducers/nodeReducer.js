import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

// initialize store and actions
const nodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    // set entire list
    setNodes(state, action) {
      return action.payload;
    },
    //TODO: append node
    //TODO: update node
    //TODO: delete node
  },
});

// create actions for a redux store
export const { setNodes } = nodeSlice.actions;

export const updateNode = (node) => {
    return async (dispatch) => {
      // todo: prob update db
      dispatch(setNodes(node));
    };
};

export default nodeSlice.reducer;

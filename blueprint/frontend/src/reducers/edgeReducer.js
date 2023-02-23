import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

// initialize store and actions
const edgeSlice = createSlice({
  name: "edge",
  initialState,
  reducers: {
    // set entire list
    setEdges(state, action) {
      return action.payload;
    },
    //TODO: append node
    //TODO: update node
    //TODO: delete node
  },
});

// create actions for a redux store
export const { setEdges } = edgeSlice.actions;

export const updateEdge = (edge) => {
    return async (dispatch) => {
      // todo: prob update db
      dispatch(setEdges(edge));
    };
};

export default edgeSlice.reducer;
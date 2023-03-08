import { createSlice } from "@reduxjs/toolkit";
import { addEdge, applyEdgeChanges } from "reactflow";

import { setUserModifiedEdges } from "./userStateReducer";

const initialState = [];

const edgeSlice = createSlice({
  name: "edges",
  initialState,
  reducers: {
    /* 
      Resets the entire edge list. 
      Most likely only used when observed new changes from server.
    */
    setEdges(state, action) {
      return action.payload;
    },
    /*
      Apply changes to old edges state using react-flow helper function.
    */
    applyChangesOnEdges(state, action) {
      return applyEdgeChanges(action.payload, state);
    },
    /*
      Add a new edge using react-flow helper function.
    */
    appendEdge(state, action) {
      return addEdge(action.payload, state);
    },
  },
});

// create actions for a redux store
export const { setEdges, applyChangesOnEdges, appendEdge } = edgeSlice.actions;
export default edgeSlice.reducer;

/*
  User modified edges.
*/
export const updateEdges = (changes) => {
  return async (dispatch) => {
    dispatch(applyChangesOnEdges(changes));
    dispatch(setUserModifiedEdges(true));
  };
};

/*
  User added a new node.
*/
export const addNewEdge = (changes) => {
  return async (dispatch) => {
    dispatch(appendEdge(changes));
    dispatch(setUserModifiedEdges(true));
  };
};

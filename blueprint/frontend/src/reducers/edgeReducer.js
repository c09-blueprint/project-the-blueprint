import { createSlice } from "@reduxjs/toolkit";
import { addEdge, applyEdgeChanges } from "reactflow";

import { setUserModifiedEdges } from "./userStateReducer";

const initialState = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    data: {
      label: "edge label",
    },
    type: "defaultEdge",
  },
];

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
    /*
      Modifies the label of a edge given id.
    */
    setEdgeLabel(state, action) {
      const { id, label } = action.payload;
      state.forEach((edge) => {
        if (edge.id === id) {
          edge.data = { ...edge.data, label };
        }
        console.log(edge);
      });
    },
  },
});

// create actions for a redux store
export const { setEdges, applyChangesOnEdges, appendEdge, setEdgeLabel } =
  edgeSlice.actions;
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
  User added a new edge.
*/
export const addNewEdge = (changes) => {
  return async (dispatch) => {
    dispatch(appendEdge(changes));
    dispatch(setUserModifiedEdges(true));
  };
};

/*
  User added a label to a edge.
*/
export const updateEdgeLabel = (id, label) => {
  return async (dispatch) => {
    dispatch(setEdgeLabel({ id, label }));
    dispatch(setUserModifiedEdges(true));
  };
};

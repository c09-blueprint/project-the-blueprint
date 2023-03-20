import { createSlice } from "@reduxjs/toolkit";
import { applyNodeChanges } from "reactflow";

import { setUserModifiedNodes } from "./userStateReducer";

/* hardcode for now */
const initialState = {
  currentId: 1,
  nodes: [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: { label: "Hello" },
      type: "input",
    },
    {
      id: "2",
      position: { x: 100, y: 100 },
      data: { label: "World" },
    },
  ],
};

const nodeSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    /* 
      Resets the entire state. 
      Payload should be { currentId: xxx, nodes: xxx }
      Most likely only used when observed new changes from server.
    */
    setNodes(state, action) {
      return action.payload;
    },
    /*
      Applies changes to old nodes state using react-flow helper function.
      Assuming no new nodes are added. ie: currentId don't need to change.
    */
    applyChangesOnNodes(state, action) {
      return { ...state, nodes: applyNodeChanges(action.payload, state.nodes) };
    },
    /*
      Assigns id and appends to state.nodes; increments currentId.
    */
    appendNode(state, action) {
      return {
        currentId: state.currentId + 1,
        nodes: [
          ...state.nodes,
          { ...action.payload, id: state.currentId.toString() },
        ],
      };
    },
    /*
      Modifies the label of a node given id.
    */
    setNodeLabel(state, action) {
      const { id, label } = action.payload;
      state.nodes.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, label };
        }
        return node;
      });
    },
  },
});

export const { setNodes, applyChangesOnNodes, appendNode, setNodeLabel } =
  nodeSlice.actions;
export default nodeSlice.reducer;

/*
  User modified nodes.
*/
export const updateNodes = (changes) => {
  return async (dispatch) => {
    dispatch(applyChangesOnNodes(changes));
    dispatch(setUserModifiedNodes(true));
  };
};

/*
  User added a new node.
*/
export const addNewNode = (node) => {
  return async (dispatch) => {
    dispatch(appendNode(node));
    dispatch(setUserModifiedNodes(true));
  };
};

/*
  User added a label to a node.
*/
export const updateNodeLabel = (id, label) => {
  return async (dispatch) => {
    dispatch(setNodeLabel({ id, label }));
    dispatch(setUserModifiedNodes(true));
  };
};

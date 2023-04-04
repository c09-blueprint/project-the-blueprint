import { createSlice } from "@reduxjs/toolkit";
import { applyNodeChanges } from "reactflow";

import { setUserModifiedNodes } from "./userStateReducer";

/* hardcode for now */
const initialState = {
  currentId: 1,
  nodes: [],
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
    /*
      deletes the node given id.
    */
    deleteNode(state, action) {
      const { id } = action.payload;
      let filterNodes = state.nodes.filter((node) => node.id !== id);
      return { ...state, nodes: filterNodes };
    },

    /* 
      Duplicates the node given id.
    */
    duplicateNode(state, action) {
      const { id } = action.payload;
      let nodeToDuplicate = state.nodes.find((node) => node.id === id);
      let newNode = {
        ...nodeToDuplicate,
        id: state.currentId.toString(),
        position: {
          x: nodeToDuplicate.position.x + 100,
          y: nodeToDuplicate.position.y + 100,
        },
      };
      return {
        currentId: state.currentId + 1,
        nodes: [...state.nodes, newNode],
      };
    },

    changeFillColor(state, action) {
      const { id, type, color } = action.payload;
      state.nodes.map((node) => {
        if (node.id === id) {
          if (
            type !== "circleNode" &&
            type !== "diamondNode" &&
            type !== "triangleNode"
          ) {
            node.style = { ...node.style, backgroundColor: color };
          } else {
            node.data = { ...node.data, shapeFill: color };
          }
        }
        return node;
      });
    },
  },
});

export const {
  setNodes,
  applyChangesOnNodes,
  appendNode,
  setNodeLabel,
  deleteNode,
  duplicateNode,
  changeFillColor,
} = nodeSlice.actions;
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

/*
  User deleted a node.
*/
export const removeNode = (id) => {
  return async (dispatch) => {
    dispatch(deleteNode({ id }));
    dispatch(setUserModifiedNodes(true));
  };
};

/*
  User duplicated a node.
*/
export const duplicateNodeById = (id) => {
  return async (dispatch) => {
    dispatch(duplicateNode({ id }));
    dispatch(setUserModifiedNodes(true));
  };
};

/* User changed background color of a node. */
export const changeBackgroundColor = (id, type, color) => {
  return async (dispatch) => {
    dispatch(changeFillColor({ id, type, color }));
    dispatch(setUserModifiedNodes(true));
  };
};

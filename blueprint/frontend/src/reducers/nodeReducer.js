import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

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
    // set node label but I pass in the entire list of nodes in the payload, ideally I want to just pass in the node id and label and use the state to get the nodes
    setNodeLabel(state, action) {
      let { id, label, nodes } = action.payload;
      console.log("setNodeLabel", nodes);
      nodes.forEach((node) => {
        if (node.id === id) {
          node.data.label = label;
        }
      });

      return nodes;
    },
    //TODO: append node
    //TODO: update node
    //TODO: delete node
  },
});

// create actions for a redux store
export const { setNodes, setNodeLabel } = nodeSlice.actions;

export const updateNode = (node) => {
  return async (dispatch) => {
    // todo: prob update db
    dispatch(setNodes(node));
  };
};

//TODO: prob dont want to pass in nodes here but I need to figure out how to get the state in the reducer
export const updateNodeLabel = (id, label, nodes) => {
  return async (dispatch) => {
    console.log("updateNodeLabel", id, label, nodes);
    dispatch(setNodeLabel({ id, label, nodes }));
  };
};

export default nodeSlice.reducer;

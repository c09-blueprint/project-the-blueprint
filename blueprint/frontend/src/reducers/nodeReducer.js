import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { applyNodeChanges } from "reactflow";

const initialState = null;

// initialize store and actions
const nodeSlice = createSlice({
  name: "node",
  initialState: [],
  reducers: {
    // set entire list
    setNodes(state, action) {
      return action.payload;
    },
    // set node label but I pass in the entire list of nodes in the payload, ideally I want to just pass in the node id and label and use the state to get the nodes
    // Issue is I can't edit the value as I get "TypeError: Cannot assign to read only property 'label' of object '#<Object>'"
    setNodeLabel(state, action) {
      const { id, label, nodes } = action.payload;
      state.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, label };
        }
      });
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

export const onNodesChange = (changes) => {
  return async (dispatch) => {
    dispatch(setNodes(changes));
  };
};

export default nodeSlice.reducer;

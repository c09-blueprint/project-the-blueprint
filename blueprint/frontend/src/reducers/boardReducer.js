import { createSlice } from "@reduxjs/toolkit";
import { boardServices } from "../services/boardService";

const initialState = [];

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    /* 
      Resets the entire board list. 
      Most likely only used when observed new changes from server.
    */
    setBoards(state, action) {
      return action.payload;
    },

    /*
      Add a new edge using react-flow helper function.
    */
    appendBoard(state, action) {
      return [...state, action.payload];
    },
  },
});

// create actions for a redux store
export const { setBoards, appendBoard } = boardSlice.actions;
export default boardSlice.reducer;

/*
  User added a new board.
*/
export const addNewBoard = (board) => {
  return async (dispatch) => {
    dispatch(appendBoard(board));
  };
};

export const getAllOwnedBoard = (email, token) => {
  return async (dispatch) => {
    const boards = await boardServices.getAllOwned(email, token);
    dispatch(setBoards(boards));
  };
};

export const createBoard = (email, token, name) => {
  return async (dispatch) => {
    const createdBoard = await boardServices.create(email, token, name);
    dispatch(appendBoard(createdBoard));
  };
};

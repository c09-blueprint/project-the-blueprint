import { createSlice } from "@reduxjs/toolkit";
import { boardServices } from "../services/boardService";

const initialState = {
  owned: [],
  shared: [],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    /* 
      Resets the entire board list. 
    */
    setBoardsOwned(state, action) {
      state.owned = action.payload;
    },
    setBoardsShared(state, action) {
      state.shared = action.payload;
    },
    /*
      Add a new edge using react-flow helper function.
    */
    appendBoardsOwned(state, action) {
      state.owned = [...state.owned, action.payload];
    },
    appendBoardsShared(state, action) {
      state.shared = [...state.shared, action.payload];
    },
  },
});

// create actions for a redux store
export const { setBoardsOwned, setBoardsShared, appendBoardsOwned } =
  boardSlice.actions;
export default boardSlice.reducer;

export const getAllOwnedBoard = (email, token) => {
  return async (dispatch) => {
    const boards = await boardServices.getAllOwned(email, token);
    dispatch(setBoardsOwned(boards));
  };
};

export const getAllSharedBoard = (email, token) => {
  return async (dispatch) => {
    const boards = await boardServices.getAllShared(email, token);
    dispatch(setBoardsShared(boards));
  };
};

export const createBoard = (email, token, name) => {
  return async (dispatch) => {
    const createdBoard = await boardServices.create(email, token, name);
    dispatch(appendBoardsOwned(createdBoard));
  };
};

//delete a board
export const deleteBoard = (email, token, boardId) => {
  return async (dispatch) => {
    await boardServices.deleteBoard(email, token, boardId);
    const boards = await boardServices.getAllOwned(email, token);
    dispatch(setBoardsOwned(boards));
  };
};

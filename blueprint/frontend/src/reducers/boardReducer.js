import { createSlice } from "@reduxjs/toolkit";
import { boardServices } from "../services/boardService";

const initialState = [
  {
    id: "1",
    name: "Board 1",
  },
  {
    id: "2",
    name: "Board 2",
  },
];

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

// example of a reducer to add an example to the store
export const createBoard = (user) => {
  return async (dispatch) => {
    // const createdUser = await boardServices.create(user);
    let createdUser = {
      id: "3",
      name: "Board 3",
    };
    dispatch(appendBoard(createdUser));
  };
};

// export const getBoards = () => {
//     return async (dispatch) => {
//         // get something from db and update redux store
//         // dispatch(setExample(example))
//     };
// };

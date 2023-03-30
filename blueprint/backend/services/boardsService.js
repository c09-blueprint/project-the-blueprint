import { Board } from "../models/board.js";
import { BoardUser } from "../models/boardUser.js";

const createBoard = async (name, reqUser) => {
  /* Create a board */
  const board = await Board.create({
    name: name,
  });

  /* Create an association */
  await BoardUser.create({
    UserId: reqUser.id,
    BoardId: board.id,
    permission: "owner",
  });

  return board;
};

const createUserBoardAssociation = async (id) => {};

export const boardService = {
  createBoard,
  createUserBoardAssociation,
};

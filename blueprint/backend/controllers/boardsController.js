import { boardService } from "../services/boardsService.js";

const createBoard = async (req, res, next) => {
  try {
  } catch (err) {
    res.status(503).json("Internal Error.");
  }
};

const addUserToBoard = async (req, res, next) => {};

export const boardController = {
  createBoard,
  addUserToBoard,
};

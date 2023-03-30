import { boardService } from "../services/boardsService.js";

const createBoard = async (req, res, next) => {
  try {
    const result = await boardService.createBoard(req.body.name, req.user);
    res.json(result);
  } catch (err) {
    res.status(503).json("Internal Error.");
  }
};

const addUserToBoard = async (req, res, next) => {};

export const boardController = {
  createBoard,
  addUserToBoard,
};

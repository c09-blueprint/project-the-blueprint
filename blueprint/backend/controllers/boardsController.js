import { boardService } from "../services/boardsService.js";

const createBoard = async (req, res, next) => {
  try {
    const result = await boardService.createBoard(req.body.name, req.user);
    res.json(result);
  } catch (err) {
    res.status(503).json("Internal Error.");
  }
};

const addUserToBoard = async (req, res, next) => {
  try {
    const result = await boardService.createUserBoardAssociation(
      req.body.boardId,
      req.body.email,
      "collaborator"
    );
    res.json(result);
  } catch (err) {
    res.status(503).json("Internal Error.");
  }
};

const getAllOwed = async (req, res, next) => {
  try {
    const result = await boardService.getAllOwed(req.user);
    res.json(result);
  } catch (err) {
    res.status(503).json("Internal Error.");
  }
};

const getAllShared = async (req, res, next) => {
  try {
    const result = await boardService.getAllShared(req.user);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(503).json("Internal Error.");
  }
};

export const boardController = {
  createBoard,
  addUserToBoard,
  getAllOwed,
  getAllShared,
};

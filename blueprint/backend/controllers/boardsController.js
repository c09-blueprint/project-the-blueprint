import { boardService } from "../services/boardsService.js";

const createBoard = async (req, res, next) => {
  try {
    const result = await boardService.createBoard(req.body.name, req.user.id);
    res.json(result);
  } catch (err) {
    res.status(503).json(err.message);
  }
};

const deleteBoard = async (req, res, next) => {
  try {
    const result = await boardService.deleteBoard(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(503).json(err.message);
  }
};

const addUserToBoard = async (req, res, next) => {
  try {
    const result = await boardService.createUserBoardAssociation(
      req.params.id,
      req.body.email,
      req.body.permission
    );
    res.json(result);
  } catch (err) {
    res.status(503).json(err.message);
  }
};

const getAllOwed = async (req, res, next) => {
  try {
    const result = await boardService.getAllOwed(req.user.id);
    res.json(result);
  } catch (err) {
    res.status(503).json(err.message);
  }
};

const getAllShared = async (req, res, next) => {
  try {
    const result = await boardService.getAllShared(req.user.id);
    res.json(result);
  } catch (err) {
    res.status(503).json(err.message);
  }
};

export const boardController = {
  createBoard,
  deleteBoard,
  addUserToBoard,
  getAllOwed,
  getAllShared,
};

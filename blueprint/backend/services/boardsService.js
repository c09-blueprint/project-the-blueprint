import { Board } from "../models/board.js";
import { BoardUser } from "../models/boardUser.js";
import { User } from "../models/user.js";
import { Op } from "sequelize";

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

const createUserBoardAssociation = async (boardId, email, permission) => {
  const board = await Board.findByPk(boardId);
  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  /* Create an association */
  const boardUser = await BoardUser.create({
    UserId: user.id,
    BoardId: board.id,
    permission: permission,
  });

  return boardUser;
};

const getAllOwed = async (reqUser) => {
  const boards = Board.findAll({
    attributes: ["id", "name"],
    include: [
      {
        model: User,
        where: { id: reqUser.id },
        attributes: [],
        through: {
          where: { permission: "owner" },
        },
      },
    ],
  });

  return boards;
};

const getAllShared = async (reqUser) => {
  const boards = Board.findAll({
    attributes: ["id", "name"],
    include: [
      {
        model: User,
        where: { id: reqUser.id },
        attributes: [],
        through: {
          where: {
            [Op.or]: [{ permission: "collaborator" }, { permission: "viewer" }],
          },
        },
      },
    ],
  });

  return boards;
};

export const boardService = {
  createBoard,
  createUserBoardAssociation,
  getAllOwed,
  getAllShared,
};

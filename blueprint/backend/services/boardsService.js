import { Board } from "../models/board.js";
import { BoardUser } from "../models/boardUser.js";
import { User } from "../models/user.js";
import { Op } from "sequelize";

const createBoard = async (name, userId) => {
  /* Create a board */
  const board = await Board.create({
    name: name,
  });

  /* Create an association */
  await BoardUser.create({
    UserId: userId,
    BoardId: board.id,
    permission: "owner",
  });

  return board;
};

const deleteBoard = async (boardId) => {
  const boardUser = await BoardUser.destroy({
    where: {
      BoardId: boardId,
    },
  });
  const board = await Board.destroy({
    where: {
      id: boardId,
    },
  });
  return board;
};

const createUserBoardAssociation = async (boardId, email, permission) => {
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!user) throw new Error("Cannot find user.");

  const findBoardUser = await BoardUser.findOne({
    where: {
      UserId: user.id,
      BoardId: boardId,
    },
  });
  if (findBoardUser) throw new Error("User is already a collaborator.");

  const board = await Board.findByPk(boardId);

  /* Create an association */
  const boardUser = await BoardUser.create({
    UserId: user.id,
    BoardId: board.id,
    permission: permission,
  });

  return boardUser;
};

const getAllOwed = async (userId) => {
  const boards = await Board.findAll({
    attributes: ["id", "name"],
    include: [
      {
        model: User,
        where: { id: userId },
        attributes: [],
        through: {
          where: { permission: "owner" },
        },
      },
    ],
  });

  return boards;
};

const getAllShared = async (userId) => {
  const boards = await Board.findAll({
    attributes: ["id", "name"],
    include: [
      {
        model: User,
        where: { id: userId },
        through: {
          where: {
            [Op.or]: [{ permission: "collaborator" }, { permission: "viewer" }],
          },
        },
      },
    ],
  });

  for (let i = 0; i < boards.length; i++) {
    boards[i] = {
      id: boards[i].id,
      name: boards[i].name,
      permission: boards[i].Users[0].BoardUser.permission,
    };
  }

  return boards;
};

export const boardService = {
  createBoard,
  deleteBoard,
  createUserBoardAssociation,
  getAllOwed,
  getAllShared,
};

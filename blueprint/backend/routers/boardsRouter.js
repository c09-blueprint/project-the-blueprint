import { Router } from "express";
import auth from "../utils/authorization.js";

import { boardController } from "../controllers/boardsController.js";

export const boardsRouter = Router();

boardsRouter.post("/", boardController.createBoard);
boardsRouter.delete("/:id", auth.isBoardOwner, boardController.deleteBoard);
boardsRouter.post(
  "/addCollaborator/:id",
  auth.isBoardOwner,
  boardController.addUserToBoard
);
boardsRouter.get("/getOwned", boardController.getAllOwed);
boardsRouter.get("/getShared", boardController.getAllShared);

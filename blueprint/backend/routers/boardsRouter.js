import { Router } from "express";

import { boardController } from "../controllers/boardsController.js";

export const boardsRouter = Router();

boardsRouter.post("/", boardController.createBoard);
boardsRouter.post("/addCollaborator", boardController.addUserToBoard);
boardsRouter.get("/getOwned", boardController.getAllOwed);
boardsRouter.get("/getShared", boardController.getAllShared);

import { Router } from "express";

import { boardController } from "../controllers/boardsController.js";

export const boardsRouter = Router();

usersRouter.post("/", boardController.createBoard);
usersRouter.post("/addCollaborator", boardController.addUserToBoard);

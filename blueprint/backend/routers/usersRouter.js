import { User } from "../models/users.js";
import { Router } from "express";

import { userController } from "../controllers/usersController.js";

export const usersRouter = Router();

usersRouter.post("/", userController.createUser);
usersRouter.get("/:id", userController.getUserById);

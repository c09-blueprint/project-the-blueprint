import { Router } from "express";
import { emailController } from "../controllers/emailController.js";

export const emailRouter = Router();

emailRouter.post("/", emailController.sendInviteEmail);
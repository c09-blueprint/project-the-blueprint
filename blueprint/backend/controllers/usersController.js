import { userService } from "../services/usersService.js";

const getMe = async (req, res, next) => {
  if (req.user) res.json(req.user);
  else res.status(503).json("Internal Error.");
};

export const userController = {
  getMe,
};

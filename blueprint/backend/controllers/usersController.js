// interact with /services
import { userService } from "../services/usersService.js";

const createUser = async (req, res, next) => {
  try {
    res.json(await userService.createUser(req.body));
  } catch (err) {
    console.log(err);
    res.status(503).json("Internal Error.");
  }
};

const getUserById = async (req, res, next) => {
  try {
    res.json(await userService.getUserById(req.params.id));
  } catch (err) {
    console.log(err);
    res.status(503).json("Internal Error.");
  }
};

export const userController = {
  createUser,
  getUserById,
};

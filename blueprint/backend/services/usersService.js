// interact with /models
import { User } from "../models/user.js";

// create user
const createUser = async (user) => {
  return await User.create({
    username: user.username,
  });
};

const getUserById = async (id) => {
  return await User.findByPk(id);
};

export const userService = {
  createUser,
  getUserById,
};

import { User } from "../models/user.js";

const getUserById = async (id) => {
  return await User.findByPk(id);
};

export const userService = {
  getUserById,
};

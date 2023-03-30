import { ENDPOINTS } from "./endpoints";
import GenericService from "./service";

const boardService = new GenericService(ENDPOINTS.BASE_BOARD_URL);

// create new user
const create = async (user) => {
  return boardService.create(user);
};

export const boardServices = {
  create,
};

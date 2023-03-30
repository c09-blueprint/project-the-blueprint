import axios from "axios";
import { ENDPOINTS } from "./endpoints";
import GenericService from "./service";
import { getAuthHeader } from "../utils/authService";

const boardService = new GenericService(ENDPOINTS.BASE_BOARD_URL);

// create new board
const create = async (email, token, name) => {
  const res = await axios.post(
    `${ENDPOINTS.BASE_BOARD_URL}`,
    { name: name },
    getAuthHeader(email, token)
  );
  console.log("Created BOARD IN DATABASE: ", res.data);
  return res.data;
};

export const boardServices = {
  create,
};

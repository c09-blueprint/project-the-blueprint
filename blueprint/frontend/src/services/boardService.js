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

// create new board
const getAllOwned = async (email, token) => {
  const res = await axios.get(
    `${ENDPOINTS.BASE_BOARD_URL}getOwned`,
    getAuthHeader(email, token)
  );
  return res.data;
};

const getAllShared = async (email, token) => {
  const res = await axios.get(
    `${ENDPOINTS.BASE_BOARD_URL}getShared`,
    getAuthHeader(email, token)
  );
  return res.data;
};

const addCollaborator = async (email, token, boardId, userEmail) => {
  const res = await axios.post(
    `${ENDPOINTS.BASE_BOARD_URL}addCollaborator`,
    {
      boardId: boardId,
      email: userEmail,
    },
    getAuthHeader(email, token)
  );
  return res.data;
};

export const boardServices = {
  create,
  getAllOwned,
  getAllShared,
  addCollaborator,
};

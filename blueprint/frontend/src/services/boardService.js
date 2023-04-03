import axios from "axios";
import { ENDPOINTS } from "./endpoints";
import { getAuthHeader } from "../utils/authService";

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

//delete a board
const deleteBoard = async (email, token, boardId) => {
  const res = await axios.delete(
    `${ENDPOINTS.BASE_BOARD_URL}${boardId}`,
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

const addCollaborator = async (
  email,
  token,
  boardId,
  userEmail,
  permission
) => {
  const res = await axios.post(
    `${ENDPOINTS.BASE_BOARD_URL}addCollaborator/${boardId}`,
    {
      email: userEmail,
      permission: permission,
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
  deleteBoard,
};

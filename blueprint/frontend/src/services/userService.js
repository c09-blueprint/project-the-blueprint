import axios from "axios";
import { ENDPOINTS } from "./endpoints";
import GenericService from "./service";
import { getAuthHeader } from "../utils/authService";

const userService = new GenericService(ENDPOINTS.BASE_USER_URL);

// get logged in user
const me = async (email, token) => {
  const res = await axios.get(
    `${ENDPOINTS.BASE_USER_URL}me`,
    getAuthHeader(email, token)
  );
  return res.data;
};

export const userServices = {
  me,
};

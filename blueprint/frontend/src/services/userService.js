import axios from "axios";
import { ENDPOINTS } from "./endpoints";
import { getAuthHeader } from "../utils/authService";

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

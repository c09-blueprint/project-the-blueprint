// The base url for all apis
const BASE_URL = process.env.REACT_APP_BASE_URL + "/api/";

export const ENDPOINTS = {
  // The base url for user api
  BASE_USER_URL: `${BASE_URL}users/`,
  // The base url for board api
  BASE_BOARD_URL: `${BASE_URL}boards/`,
};

import { ENDPOINTS } from "./endpoints";
import GenericService from "./service";

const userService = new GenericService(ENDPOINTS.BASE_USER_URL);

// create new user
const create = async (user) => {
  return userService.create(user);
};

// get logged in user
const me = async () => {
  // TODO: hardcode it for now to get the first uesr
  // remove after implementing authentication
  return userService.retrieveSingle(1);
};

export const userServices = {
  create,
  me,
};

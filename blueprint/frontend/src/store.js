import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./reducers/userReducer";
import userStateReducer from "./reducers/userStateReducer";
import nodeReducer from "./reducers/nodeReducer";
import edgeReducer from "./reducers/edgeReducer";
import boardReducer from "./reducers/boardReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    userState: userStateReducer,
    nodes: nodeReducer,
    edges: edgeReducer,
    board: boardReducer,
  },
});

export default store;

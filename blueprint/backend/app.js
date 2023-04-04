import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "./utils/logger.js";
import { sequelize } from "./datasource.js";
import { usersRouter } from "./routers/usersRouter.js";
import { boardsRouter } from "./routers/boardsRouter.js";
import { emailRouter } from "./routers/emailRouter.js";
import ENDPOINTS from "./utils/endpoints.js";
import auth from "./utils/authorization.js";

/* DO NOT DELETE THESE */
import { User } from "./models/user.js";
import { Board } from "./models/board.js";
import { Workspace } from "./models/workspace.js";
import { BoardUser } from "./models/boardUser.js";
import { WorkspaceUser } from "./models/workspaceUser.js";
/* DO NOT DELETE THESE */

/* Connect and sync with database. */
try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  logger.info("Database connection has been established successfully.");
} catch (error) {
  logger.error("Unable to connect to the database:", error);
}

/* Start app. */
const PORT = 3001;
export const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

/* Request logger */
app.use(function (req, res, next) {
  logger.info("HTTP request", req.method, req.url, req.body);
  next();
});

/* Enforce authentication on all endpoints. */
app.use(auth.userExtractor);

app.use(ENDPOINTS.USER_ENDPOINT, usersRouter);
app.use(ENDPOINTS.BOARD_ENDPOINT, boardsRouter);
app.use(ENDPOINTS.INVITE_ENDPOINT, emailRouter);

app.listen(PORT, (err) => {
  if (err) logger.error(err);
  else logger.info("HTTP server on http://localhost:%s", PORT);
});

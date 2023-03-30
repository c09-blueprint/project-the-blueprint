import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "./utils/logger.js";
import { sequelize } from "./datasource.js";
import { userExtractor } from "./utils/authorization.js";
import { usersRouter } from "./routers/usersRouter.js";
import { emailRouter } from "./routers/emailRouter.js";

/* DO NOT DELETE THESE */
import { User } from "./models/user.js";
import { Board } from "./models/board.js";
import { Workspace } from "./models/workspace.js";
import { BoardUser } from "./models/boardUser.js";
import { WorkspaceUser } from "./models/workspaceUser.js";
/* DO NOT DELETE THESE */

/* Try connect and sync database. */
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
app.use(cors());
// app.use(express.static('build'))   to be added when prod build is ready
app.use(express.json());

/* Request logger */
app.use(function (req, res, next) {
  logger.info("HTTP request", req.method, req.url, req.body);
  next();
});

/* Enforce authentication on all endpoints. */
app.use(userExtractor);

/* TODO: remove
test authentication. */
app.get("/authorized", function (req, res) {
  res.send("Secured Resource");
});

app.use("/api/users", usersRouter);
app.use("/api/emails", emailRouter);

app.listen(PORT, (err) => {
  if (err) logger.error(err);
  else logger.info("HTTP server on http://localhost:%s", PORT);
});

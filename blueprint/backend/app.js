import { sequelize } from "./datasource.js";
import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "./utils/logger.js";

import { User } from "./models/user.js";
import { Board } from "./models/board.js";
import { Workspace } from "./models/workspace.js";
import { BoardUser } from "./models/boardUser.js";
import { WorkspaceUser } from "./models/workspaceUser.js";

import { usersRouter } from "./routers/usersRouter.js";
import { emailRouter } from "./routers/emailRouter.js";

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  logger.info("Database connection has been established successfully.");
} catch (error) {
  logger.error("Unable to connect to the database:", error);
}

const PORT = 3001;
export const app = express();
app.use(bodyParser.json());
app.use(cors());

/* TODO: add to env */
const jwtCheck = auth({
  audience: "http://localhost:3001",
  issuerBaseURL: "https://dev-jcol6i3ol3vahmwd.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

app.use(express.json());

app.use(function (req, res, next) {
  logger.info("HTTP request", req.method, req.url, req.body);
  next();
});

// enforce authentication on all endpoints
// app.use(jwtCheck);

// test authentication
app.get("/authorized", jwtCheck, function (req, res) {
  console.log("imhere.");
  res.send("Secured Resource");
});

app.use("/api/users", usersRouter);
app.use("/api/emails", emailRouter);

app.listen(PORT, (err) => {
  if (err) logger.error(err);
  else logger.info("HTTP server on http://localhost:%s", PORT);
});

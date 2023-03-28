import { sequelize } from "./datasource.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "./utils/logger.js"

import { usersRouter } from "./routers/usersRouter.js";
import { emailRouter } from "./routers/emailRouter.js";

const PORT = 3001;
export const app = express();
app.use(bodyParser.json());
app.use(cors());

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  logger.info("Database connection has been established successfully.");
} catch (error) {
  logger.error("Unable to connect to the database:", error);
}

app.use(express.json());

app.use(function (req, res, next) {
  logger.info("HTTP request", req.method, req.url, req.body);
  next();
});

app.use("/api/users", usersRouter);
app.use("/api/emails", emailRouter);

app.listen(PORT, (err) => {
  if (err) logger.error(err);
  else logger.info("HTTP server on http://localhost:%s", PORT);
});

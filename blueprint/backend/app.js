import { sequelize } from "./datasource.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { usersRouter } from "./routers/usersRouter.js";

const PORT = 3001;
export const app = express();
app.use(bodyParser.json());
app.use(cors());

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use(express.json());

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.use("/api/users", usersRouter);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});

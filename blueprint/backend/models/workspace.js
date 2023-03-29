import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./user.js";

export const Workspace = sequelize.define("Workspace", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

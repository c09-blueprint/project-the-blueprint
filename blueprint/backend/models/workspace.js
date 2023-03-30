import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Workspace = sequelize.define("Workspace", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

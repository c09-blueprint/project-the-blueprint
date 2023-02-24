import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Document = sequelize.define("Document", {
  nodes: {
    type: DataTypes.STRING,
  },
  edges: {
    type: DataTypes.STRING,
  },
});

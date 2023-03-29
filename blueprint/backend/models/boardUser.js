import { User } from "./user.js";
import { Board } from "./board.js";
import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const BoardUser = sequelize.define(
  "BoardUser",
  {
    permission: {
      type: DataTypes.ENUM(["owner", "collaborator", "viewer"]),
    },
  },
  { timestamps: false }
);

/* Many-to-Many relationship between Board and User. */
Board.belongsToMany(User, { through: "BoardUser", onDelete: "SET NULL" });
User.belongsToMany(Board, { through: "BoardUser", onDelete: "SET NULL" });

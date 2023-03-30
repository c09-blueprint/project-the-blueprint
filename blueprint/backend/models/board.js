import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { Workspace } from "./workspace.js";

export const Board = sequelize.define("Board", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

/* 
  One Workspace to Many Board.
  Board can exists without a Workspace.
*/
Workspace.hasMany(Board, {
  /* For now, cascade delete all Boards of a Workspace on delete. */
  onDelete: "CASCADE",
  hooks: true,
});
Board.belongsTo(Workspace);

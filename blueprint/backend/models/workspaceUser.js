import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./user.js";
import { Workspace } from "./workspace.js";

export const WorkspaceUser = sequelize.define(
  "WorkspaceUser",
  {
    permission: {
      type: DataTypes.ENUM(["owner", "collaborator", "viewer"]),
    },
  },
  { timestamps: false }
);

/* Many-to-Many relationship between Workspace and User. */
Workspace.belongsToMany(User, {
  through: "WorkspaceUser",
  onDelete: "SET NULL",
});
User.belongsToMany(Workspace, {
  through: "WorkspaceUser",
  onDelete: "SET NULL",
});

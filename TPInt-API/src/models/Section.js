import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
import { Entry } from "./entry.js";

export const Section = sequelize.define("section", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
});

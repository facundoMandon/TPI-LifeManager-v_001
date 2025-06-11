
import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
export const Project = sequelize.define(
  "projects",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    initDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    state: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.ENUM(1, 2, 3), // 1: alta, 2: media, 3: baja
      allowNull: false,
      defaultValue: 2 // valor por defecto es media
    },
    description: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: true,
  }
);


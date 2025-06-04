import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
import { Section } from "./Section.js";

export const Entry = sequelize.define("entry", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  type: {
     type: DataTypes.ENUM("recordatorio", "nota", "fecha importante"),
  },
  expireDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
    priority: {
      type: DataTypes.ENUM(1, 2, 3), // 1: alta, 2: media, 3: baja
      allowNull: false,
      defaultValue: 2 // valor por defecto es media
  },
  state: {
    type: DataTypes.ENUM("pendiente", "completado", "vencido"),
    allowNull: false,
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
  type: DataTypes.TEXT,
  allowNull: true,
  },
});

import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
import Section from "./Section.js";

const Entry = sequelize.define("entry", {
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
    type: DataTypes.ENUM("alta", "media", "baja"),
  },
  state: {
    type: DataTypes.ENUM("pendiente", "completado", "vencido"),
    allowNull: false,
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
});



export default Entry;

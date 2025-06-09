import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";

export const TasksEst = sequelize.define(
  "TasksEst",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    initDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sectionId: {
      type: DataTypes.INTEGER,
      foreignKey: true,
    },
    content: {
  type: DataTypes.TEXT, // para texto largo
  allowNull: true, // editable desde un "textarea" en el frontend, como si fuera un "notepad" asociado a cada tarea.
}

  },
  {
    timestamps: false,
  }
);


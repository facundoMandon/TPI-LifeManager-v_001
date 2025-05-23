import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";

const Tasks = sequelize.define(
  "Task",
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
    projectId: {
      type: DataTypes.INTEGER,
      foreignKey: true,
    },
  },
  {
    timestamps: false,
  }
);

export default Tasks;

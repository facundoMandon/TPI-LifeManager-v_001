import { INTEGER, Sequelize } from "sequelize";
import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
import Tasks from "./Tasks.js";
// esto es solo el esquema de la tabla
//pero la tabla todavía no está creada. Este es solo el esqueleto.
// el metodo "sequelize.define recibe tres argumentos" sequelize.define('nombreTabla', objeto, opciones)
//objeto va a tener los tipos de datos que va a guardar la tabla (ejemplo {id: {type: DataTypes.INTEGER, autoincrement:true, primaryKey: true}})
//como tercer argumento (es opcional), vamos a poner las opciones del tipo "timestamps: false" o similar.
const Project = sequelize.define(
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
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

Project.hasMany(Tasks, {
  foreignKey: "projectId",
  sourceKey: "id",
});

Tasks.belongsTo(Project, {
  foreignKey: "projectId",
  targetId: "id",
});
export default Project;

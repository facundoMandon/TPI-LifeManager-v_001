
import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
// esto es solo el esquema de la tabla
//pero la tabla todavía no está creada. Este es solo el esqueleto.
// el metodo "sequelize.define recibe tres argumentos" sequelize.define('nombreTabla', objeto, opciones)
//objeto va a tener los tipos de datos que va a guardar la tabla (ejemplo {id: {type: DataTypes.INTEGER, autoincrement:true, primaryKey: true}})
//como tercer argumento (es opcional), vamos a poner las opciones del tipo "timestamps: false" o similar.
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


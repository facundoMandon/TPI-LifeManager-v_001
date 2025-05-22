import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Book = sequelize.define("book" , {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        timestamps: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        timestamps: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
        timestamps: false
    },
    rating: {
        type: DataTypes.INTEGER,
        timestamps: false
     },
     pageCount: {
        type: DataTypes.INTEGER,
        timestamps: false
     },
     summary: {
        type: DataTypes.TEXT,
        timestamps: false
     },
     imageUrl: {
        type: DataTypes.STRING,
        timestamps: false
     },
     available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        timestamps: false
     }
})
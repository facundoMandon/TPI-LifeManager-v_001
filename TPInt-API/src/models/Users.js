import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
import Section from "./Section.js";

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM("superadmin", "usuario", "admin"),
    defaultValue: "usuario",
    allowNull: false,
  },
});

User.hasMany(Section, {
  foreignKey: "userId",
  sourceKey: "id"
})

Section.belongsTo(User, {
  foreignKey: "userId",
  targetId: "id"
})

export default User;

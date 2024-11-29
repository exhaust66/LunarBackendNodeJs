import sequelize from "../configs/sequelize";
import { DataTypes } from "sequelize";
import User from "./user";

const Trainer=sequelize.define('Trainer',{
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: 'id',
          },
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        assignedTraining: {
            type: DataTypes.ARRAY, // Use JSON to store array of phone objects
            allowNull: true,
        },
});

module.exports= Trainer;
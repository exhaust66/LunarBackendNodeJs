const { DataTypes } = require('sequelize');
const sequelize=require('../configs/sequelize');
const User = require('./user');

const Trainer=sequelize.define('Trainer',{
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: 'id',
          },
          onDelete: 'CASCADE', // Automatically delete related trainer records when deleted in user table
          onUpdate: 'CASCADE'  // Automatically update references on user update
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        assignedTraining: {
            type: DataTypes.JSON, // Use JSON to store array of phone objects
            defaultValue:[], // empty JSON that matches MYsql type
        },
});

module.exports = Trainer;
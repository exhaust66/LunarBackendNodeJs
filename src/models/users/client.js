const { DataTypes } = require('sequelize');
const sequelize=require('../configs/sequelize');
const User= require("./user");

const Client=sequelize.define('Client',{
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, 
            key: 'id', 
        },
        onDelete: 'CASCADE', // Automatically delete related client records when deleted in user table
        onUpdate: 'CASCADE'  // Automatically update references on user update
    },
    subscriptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    renewalStatus: {
        type: DataTypes.ENUM('Pending', 'Renewed', 'Expired'),
        allowNull: false,
    },
});

module.exports= Client;
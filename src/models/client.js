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
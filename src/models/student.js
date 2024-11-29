const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Student = sequelize.define('Student', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    
});
const Otp=sequelize.define('Otp',{
    resetOtp: {
        type: DataTypes.STRING, // Corrected from Sequelize.STRING
        allowNull: true,
    },
    otpExpiry: {
        type: DataTypes.DATE, // Corrected from Sequelize.DATE
        allowNull: true,
    },  
});

module.exports = {Student,Otp};
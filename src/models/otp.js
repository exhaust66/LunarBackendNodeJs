const { DataTypes } = require('sequelize');
const User = require('./user');
const sequelize = require('../configs/sequelize');

const Otp = sequelize.define('Otp', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    resetOtp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otpExpiry: {
        type: DataTypes.DATE,
        allowNull: false,
    },
},{
    tableName:'otps'
});

module.exports = Otp;
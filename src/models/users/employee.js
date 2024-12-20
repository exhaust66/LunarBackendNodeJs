const { DataTypes } = require('sequelize');
const sequelize=require('../../configs/sequelize');
const User = require('./user');

const Employee = sequelize.define('Employee',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    position:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    dateOfHire:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    salary:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    type:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    arrivalTime:{
        type:DataTypes.TIME,
        allowNull:true,
    },
    departureTime:{
        type:DataTypes.TIME,
        allowNull:true,
    },
});

Employee.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

module.exports=Employee;
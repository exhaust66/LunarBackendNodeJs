const sequelize = require('../../configs/sequelize');
const {DataTypes}= require('sequelize')
const Intern = require('./intern');
const User = require('../users/user');

const InternApplication = sequelize.define('InternApplication',{
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:'id'
        },
        allowNull:false
    },
    internId:{
        type:DataTypes.INTEGER,
        references:{
            model:Intern,
            key:'id'
        },
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM('Pending','Accepted','Rejected'),
        defaultValue:'Pending',
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        allowNull:true 
    },
    remarks:{
        type:DataTypes.STRING,
        allowNull:true 
    }
},{
    tableName:'internApplications'
})

module.exports = InternApplication;
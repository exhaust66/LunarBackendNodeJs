const sequelize = require('../../configs/sequelize');
const {DataTypes}= require('sequelize')
const Training = require('./training');
const User = require('../users/user');

const TrainingApplication = sequelize.define('TrainingApplication',{
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:'id'
        },
        allowNull:false
    },
    trainingId:{
        type:DataTypes.INTEGER,
        references:{
            model:Training,
            key:'id'
        },
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM('Pending','Accepted','Rejected'),
        defaultValue:'Pending',
        allowNull:false
    },
    trainingCategory:{
        type:DataTypes.STRING,
        allowNull:true 
    },
    remarks:{
        type:DataTypes.STRING,
        allowNull:true 
    }
},{
    tableName:'trainingApplications'
})

module.exports = TrainingApplication;
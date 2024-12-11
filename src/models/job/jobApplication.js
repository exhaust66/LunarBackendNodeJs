const sequelize = require('../../configs/sequelize');
const {DataTypes}= require('sequelize')
const Job = require('./job');
const User = require('../users/user');

const JobApplication = sequelize.define('JobApplication',{
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:'id'
        },
        allowNull:false
    },
    jobId:{
        type:DataTypes.INTEGER,
        references:{
            model:Job,
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
    tableName:'jobApplications'
})

module.exports = JobApplication;
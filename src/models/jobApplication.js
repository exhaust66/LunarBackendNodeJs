const {DataTypes}=require('sequelize');
const sequelize=require('../configs/sequelize');
const Job = require('./job');
const User = require('./users/user');

const JobApplication=sequelize.define('JobApplication',{
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:'id',
        },
        allowNull:false,
    },
    category:{
        type:DataTypes.STRING,
        defaultValue:'Job',
    },
    jobId:{
        type:DataTypes.INTEGER,
        references:{
            model:Job,
            key:'id'
        },
        allowNull:false,
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false
    },
    contact:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    resume:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    
});

module.exports=JobApplication;
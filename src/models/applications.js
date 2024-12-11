const sequelize = require('../configs/sequelize');
const {DataTypes}= require('sequelize');
const User=require('../models/users/user');
const Program=require('../models/program');

const Applications = sequelize.define('Applications',{
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:'id'
        },
        allowNull:false
    },
    programId:{
        type:DataTypes.INTEGER,
        references:{
            model:Program,
            key:'id'
        },
        allowNull:false,
    },
    status:{
        type:DataTypes.ENUM('Pending','Accepted','Rejected'),
        defaultValue:'Pending',
        allowNull:false
    },
    type:{
        type:DataTypes.ENUM('Training','Internship'),
        allowNull:true 
    },
},{
    tableName:'aplications'
})

module.exports = Applications;
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
    contact:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    status:{
        type:DataTypes.ENUM('Accepted','Pending','Rejected'),
        defaultValue:'Pending',
        allowNull:false,
    },
    resume:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    
});

JobApplication.belongsTo(User,{
    foreignKey:"userId",
    as:"users"
})

module.exports=JobApplication;
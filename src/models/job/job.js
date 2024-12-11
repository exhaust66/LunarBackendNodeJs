const sequelize = require('../../configs/sequelize');
const {DataTypes} = require('sequelize');

const Job =  sequelize.define('Job',{
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    bannerImage:{
        type:DataTypes.STRING,
        allowNull:false
    },
    totalSeats:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    availableSeats:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    availablity:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
        allowNull:false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false, 
    }
},{
    tableName:'jobs'
})

module.exports = Job;
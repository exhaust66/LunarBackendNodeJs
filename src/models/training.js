const sequelize = require('../configs/sequelize');
const {DataTypes} = require('sequelize');
const Trainer = require('./users/trainer');

const Traning =  sequelize.define('Traning',{
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    trainerId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Trainer,
            key:'userId'
        }
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false, 
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
    }
},{
    tableName:'tranings'
})

module.exports = Traning;
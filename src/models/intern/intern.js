const sequelize = require('../../configs/sequelize');
const {DataTypes} = require('sequelize');

const Intern =  sequelize.define('Intern',{
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
    tableName:'interns'
})

module.exports = Intern;
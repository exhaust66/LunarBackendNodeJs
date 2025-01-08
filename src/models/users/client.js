const { DataTypes } = require('sequelize');
const sequelize=require('../../configs/sequelize');

const Client=sequelize.define('Client',{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    product:{
        type:DataTypes.STRING,
        allowNull:false,
    },
   contactNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    package:{
        type:DataTypes.ENUM('1 Month','6 Months','12 Months'),
        allowNull:false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    renewalStatus: {
        type: DataTypes.ENUM('New','Renewed', 'Expired'),
        allowNull: false,
    },
    details:{
        type:DataTypes.TEXT,
        allowNull:true,
    },
});


module.exports= Client;
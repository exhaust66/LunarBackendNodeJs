const { DataTypes } = require('sequelize');
const sequelize=require('../../configs/sequelize');
const User= require("./user");
const {Product}= require("../product");

const Client=sequelize.define('Client',{
    userId:{
        type: DataTypes.INTEGER,
        
        references: {
            model: User, 
            key: 'id', 
        },
        allowNull: false,
        onDelete: 'CASCADE', // Automatically delete related client records when deleted in user table
        onUpdate: 'CASCADE'  // Automatically update references on user update
    },
    productId:{
        type:DataTypes.INTEGER,
        references:{
            model:Product,
            key:'productId',
        },
        allowNull:false,
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
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
        type: DataTypes.ENUM('Renewed', 'Expired'),
        allowNull: false,
    },
    details:{
        type:DataTypes.TEXT,
        allowNull:true,
    },
});

Client.belongsTo(User, {
    foreignKey: 'id',
    as: 'user',
});

Client.belongsTo(Product, {
    foreignKey: 'id',
    as: 'product',
});

module.exports= Client;
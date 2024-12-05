const sequelize=require('../configs/sequelize');
const {DataTypes}=require('sequelize');
const User = require('./users/user');

const AuthToken = sequelize.define('AuthToken',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:'id',
        }
    },
    token:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    expiryDate:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Automatically sets the current timestamp
    }
},{
    tableName:'authTokens',
    timestamps:false
})

module.exports = AuthToken;
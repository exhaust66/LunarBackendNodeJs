const sequelize=require('../configs/sequelize');
const {DataTypes}=require('sequelize');
const {Student} = require('./student');

const User=sequelize.define('User',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('Admin', 'Student', 'Trainer', 'Client'),
        defaultValue: 'Student',
        allowNull: false,
      },
      phone: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verification:{
        type: DataTypes.ENUM('Verified','Pending'),
        defaultValue:'Pending',
      }
},{
  tableName:'users'
});
Users.hasOne(Student,{
  foreignKey:'user_id',
  as:'student'
})

module.exports=User;
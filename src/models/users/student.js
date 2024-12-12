const { DataTypes } = require('sequelize');
const User = require('./user');
const Program = require('../program');
const sequelize = require('../../configs/sequelize');

const Student = sequelize.define('Student', {
     userId: {
          type: DataTypes.INTEGER,
          references: {
               model: "users",
               key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE' 
     },
     certificates: {
          type: DataTypes.STRING,
          allowNull: true,
     },
},{
     tableName:'students',
});
Student.belongsTo(User, {
     foreignKey: 'userId',
     as: 'user',
   });

module.exports = Student;

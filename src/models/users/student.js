const { DataTypes } = require('sequelize');
const User = require('./user');
const Program = require('../program');
const sequelize = require('../../configs/sequelize');

const Student = sequelize.define('Student', {
     userId: {
          type: DataTypes.INTEGER,
          references: {
               model: User,
               key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE' 
     },
     certificates: {
          type: DataTypes.STRING,
          allowNull: true,
     },
});

module.exports = Student;

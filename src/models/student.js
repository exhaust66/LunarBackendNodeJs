const { DataTypes } = require('sequelize');
const User = require('./user');
const sequelize = require('../configs/sequelize');

const Student = sequelize.define('Student', {
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:'id'
        },
        onDelete: 'CASCADE', // Automatically delete related student records when deleted in user table
        onUpdate: 'CASCADE'  // Automatically update references on user update
    },
   enrolledDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
   },
   appliedInternships: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue:[]
   },
   appliedTrainings: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue:[]
   },
   certificates: {
        type: DataTypes.STRING,
        allowNull: true,
   },
});

module.exports = Student;

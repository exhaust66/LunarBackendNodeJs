const { DataTypes } = require('sequelize');
const User = require('./user');
const sequelize = require('../configs/sequelize');

const Student = sequelize.define('Student', {
   enrolledDate: {
    type: DataTypes.DATE,
    allowNull: false,
   },
   appliedInternships: {
    type: DataTypes.STRING,
    allowNull: false,
   },
   appliedTrainings: {
    type: DataTypes.STRING,
    allowNull: false,
   },
   certificates: {
    type: DataTypes.STRING,
    allowNull: true,
   },
});

Student.belongsTo(User, { foreignKey: 'userId' });

const Otp = sequelize.define('Otp', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Students',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    resetOtp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otpExpiry: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = { Student, Otp };

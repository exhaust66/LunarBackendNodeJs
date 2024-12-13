const { DataTypes } = require('sequelize');
const sequelize = require('../configs/sequelize');

const Attendance = sequelize.define("Attendance", {
    enrollmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Enrollments', 
            key: 'id',
        },
    },
    programId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Programs',
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("Present", "Absent", "Late", "Leave"),
        allowNull: false,
    },
});

// Define associations
Attendance.associate = (models) => {
    Attendance.belongsTo(models.Enrollment, {
        foreignKey: "enrollmentId",
        as: "enrollment",
    });
};

module.exports = Attendance;

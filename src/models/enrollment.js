const {DataTypes}=require('sequelize');
const sequelize=require('../configs/sequelize');

const Enrollment=sequelize.define('Enrollment',{
    enrollmentId:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    status: {
        type: DataTypes.ENUM("Active", "Completed", "Dropped"),
        defaultValue: "Active",
        allowNull: false,
    },
    enrolledAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: sequelize.NOW,
    },
    completionDate: {
        type: DataTypes.DATEONLY,
    },
    certificateIssued: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

Enrollment.associate = (models) => {
    Enrollment.belongsTo(models.Student, {
        foreignKey: "studentId",
        as: "student",
    });
    Enrollment.belongsTo(models.Program, {
        foreignKey: "programId",
        as: "program",
    });
};
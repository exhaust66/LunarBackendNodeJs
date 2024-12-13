const {DataTypes}=require('sequelize');
const sequelize=require('../configs/sequelize');
const Student=require('../models/users/student');
const Program=require('../models/program');

const Enrollment=sequelize.define('Enrollment',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    studentId:{
        type: DataTypes.INTEGER,
        references: {
             model: Student,
             key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE' 
    },
    programId:{
        type: DataTypes.INTEGER,
        references: {
             model: Program,
             key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE' 
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

Enrollment.belongsTo(Student,{
    foreignKey:'studentId',
    as:'student'
});
module.exports=Enrollment;
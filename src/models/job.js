const {DataTypes}=require('sequelize');
const sequelize=require('../configs/sequelize');

const Job=sequelize.define('Job',{
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    location:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:'Itahari-6, Hatiya Line Rd, Lunar IT Solution Pvt.Ltd',
    },
    salary: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    applicationDeadline: {
        type: DataTypes.DATEONLY,
        allowNull:true,
    },
    jobType:{
        type:DataTypes.ENUM('Full-Time','Part-Time','Contract','Internship'),
        allowNull:false,
    },
    status:{
        type:DataTypes.ENUM('Open','Closed'),
        allowNull:false,
        defaultValue:'Open',
    },

});

module.exports=Job;
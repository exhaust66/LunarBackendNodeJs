const sequelize = require('../configs/sequelize');
const {DataTypes}= require('sequelize');
const User=require('../models/users/user');
const Program=require('../models/program');

const ArchivedApplications = sequelize.define('ArchivedApplications',{
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:'id'
        },
        allowNull:false
    },
    programId:{
        type:DataTypes.INTEGER,
        references:{
            model:Program,
            key:'id'
        },
        allowNull:false,
    },
    status:{
        type:DataTypes.ENUM('Pending','Accepted','Rejected'),
        defaultValue:'Pending',
        allowNull:false
    },
    type:{
        type:DataTypes.STRING,
        allowNull:true ,
        defaultValue:'Trainings'
    },
},{
    tableName:'aplications'
});

Applications.belongsTo(User, {
     foreignKey: 'userId',
     as: 'user',
   });

   Applications.belongsTo(Program, {
    foreignKey: 'programId', // This is the foreign key in Applications
    as: 'program',           // The alias for the Program model
  });

module.exports = ArchivedApplications;
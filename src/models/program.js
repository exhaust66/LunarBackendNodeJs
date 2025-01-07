const {DataTypes}=require('sequelize');
const sequelize=require('../configs/sequelize');

const Program=sequelize.define('Program',{
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    type: {
        type: DataTypes.ENUM("Training", "Internship"),
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATEONLY,
    },
});
Program.associate=(models)=>{
    Program.hasOne(models.Application, {
      foreignKey:'userId',
      as:'program',
    });
  };

module.exports=Program;
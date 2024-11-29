const sequelize=require('../configs/sequelize');

module.exports=sequelize.define('Trainers',{
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: 'id',
          },
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        assignedTraining: {
            type: DataTypes.JSON, // Use JSON to store array of phone objects
            allowNull: true,
        },
});
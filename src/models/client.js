const sequelize=require('../configs/sequelize');

module.exports=sequelize.define('Clients',{
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, 
            key: 'id', 
        },
    },
    subscriptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    renewalStatus: {
        type: DataTypes.ENUM('Pending', 'Renewed', 'Expired'),
        allowNull: false,
    },
});
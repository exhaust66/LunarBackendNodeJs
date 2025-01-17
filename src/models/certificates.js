const sequelize = require('../configs/sequelize');
const {DataTypes} = require('sequelize');

const Certificates = sequelize.define('Certificates',{
issusedCertificates:{
    type:DataTypes.STRING,
    allowNull:true,
}
});

//define associations with user and student 
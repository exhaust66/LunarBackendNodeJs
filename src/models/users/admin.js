const bcrypt = require('bcryptjs');
const { DataTypes } = require('sequelize');
const sequelize = require('../../configs/sequelize'); // Assuming this is your sequelize configuration

const Admin = sequelize.define('Admin', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
  tableName:'admins'
});

module.exports = Admin;
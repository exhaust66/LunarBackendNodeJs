const sequelize = require('../../configs/sequelize');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Student', 'Trainer', 'Client'),
    defaultValue: 'Student',
    allowNull: false,
  },
  phone: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verification: {
    type: DataTypes.ENUM('Verified', 'Pending'),
    defaultValue: 'Pending',
  }
}, {
  tableName: 'users'
});

// const File = sequelize.define('File', {
//   userId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: User,
//       key: 'userId',
//     },
//     allowNull: false,
//   },
  
//   fileName: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   filePath: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   fileSize: {
//     type: DataTypes.FLOAT,
//     allowNull: true
//   },
// },{
//     tableName:'files'
// });

// User.hasMany(File, {
//   foreignKey: 'userId',
//   as: 'files',
// });

// File.belongsTo(User, {
//   foreignKey: 'userId',
//   as: 'user',
// });

module.exports = User;

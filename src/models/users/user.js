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

  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('User','Admin', 'Student', 'Trainer', 'Client'),
    defaultValue: 'User',
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

// Define associations
User.associate = (models) => {
  User.hasOne(models.Student, {
    foreignKey: 'userId',
    as: 'student',
  });

  User.hasOne(models.Trainer,{
    foreignKey:'userId',
    as:'trainer'
  });
};
User.associate=(models)=>{
    User.hasOne(models.Applications,{
      foreignKey:'userId',
      as:'application',
    });
};
User.associate=(models)=>{
  User.hasOne(models.JobApplications,{
    foreignKey:'userId',
    as:'jobApplications',
  });
};


User.associate=(models)=>{
  User.hasOne(models.Client, {
    foreignKey:'userId',
    as:'client',
  });
};

User.associate=(models)=>{
  User.hasOne(models.Employee, {
    foreignKey:'userId',
    as:'client',
  });
};
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
// User.associate = (models) => {
//   User.hasOne(models.Student, {
//     foreignKey: 'userId',
//     as: 'student',
//   });
// };
module.exports = User;
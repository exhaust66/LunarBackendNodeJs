const sequelize = require('./configs/sequelize');

// Change force:true to alter:true later when you want to avoid data loss
sequelize.sync({ alter: true })  // Use alter: true to adjust tables without resetting the database
  .then(async () => {
    console.log('Tables are ready!');
  })
  .catch((error) => {
    console.error('Error syncing the database!');
  });
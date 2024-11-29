const sequelize = require('./configs/sequelize');
const seedAdmin=require('./seed');

// Change force:true to alter:true later when you want to avoid data loss
sequelize.sync({ force: true })  // Use alter: true to adjust tables without resetting the database
  .then(async () => {
    console.log('Tables are ready!');
    await seedAdmin();
  })
  .catch((error) => {
    console.error('Error syncing the database:', error);
  });
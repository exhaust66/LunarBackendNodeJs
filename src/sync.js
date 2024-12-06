const sequelize = require('./configs/sequelize');
const seedAdmin=require('./seed');

// Change force:true to alter:true later when you want to avoid data loss
sequelize.sync({ alter: true })  // Use alter: true to adjust tables without resetting the database
  .then(async () => {
    console.log('Tables are ready!');
    await seedAdmin();
  })
  .catch((error) => {
<<<<<<< HEAD
=======
    console.log(error);
>>>>>>> c0a4fe13900919bbc1ccc735418bbacd41b990b5
    console.error('Error syncing the database!!');
  });
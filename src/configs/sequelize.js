const { Sequelize } = require('sequelize');
const config = require('./config'); // Import DB settings

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    pool: config.pool,
    logging:false
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to MySQL has been established successfully!');
  })
  .catch((err) => {
    console.error('Unable to connect to the database!');
  });

module.exports = sequelize;

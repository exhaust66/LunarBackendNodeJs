const dotenv = require('dotenv');

dotenv.config();
let db_config
if (process.env.NODE_MODE === "PRODUCTION") {
    db_config = {
        HOST: process.env.DB_HOST,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASS,
        DB: process.env.DB_NAME,
        PORT: Number(process.env.DB_PORT),
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
} else {
    db_config = {
        HOST: "localhost",
        USER: "root",
        PASSWORD: "",
        DB: "lunar_db",
        dialect: "mysql",
        PORT: 3306,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
}
module.exports = db_config
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/sequelize');

const Product = sequelize.define('Product', {
    productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productDesc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:'null'
    },
});

const File = sequelize.define('File', {
    fileName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fileSize: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'productId',
        },
        allowNull: true
    }
});
Product.hasMany(File, {
    foreignKey: 'productId',
    as: 'files',
});

File.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
})
module.exports = { Product, File };
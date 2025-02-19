const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');
const InvoiceProduct = require('./InvoiceProduct');
const Stock = require('./Stock');
const Return = require('./Return');
const Product = require('./Products');

const ReturnProduct = sequelize.define(
    'ReturnProduct',
    {
        returnProductId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        returnQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        returnAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        returnItemType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        returnDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        returnNote: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        invoiceProductId: {
            type: DataTypes.INTEGER,
            references: {
                model: InvoiceProduct,
                key: "invoiceProductId",
            },
            allowNull: false,
        },
        stockId: {
            type: DataTypes.INTEGER,
            references: {
                model: Stock,
                key: "stockId",
            },
            allowNull: true,
        },
        returnItemId: {
            type: DataTypes.INTEGER,
            references: {
                model: Return,
                key: "returnItemId",
            },
            allowNull: false,
        },
        productId:{
            type:DataTypes.INTEGER,
            references:{
                model:Product,
                key:'product'
            },
            allowNull:false,
        },
    },
    {
        tableName: 'returnproducts',
        timestamps: false,
    }
);

ReturnProduct.belongsTo(InvoiceProduct, { foreignKey: 'invoiceProductId', as: 'invoiceProduct' });
ReturnProduct.belongsTo(Stock, { foreignKey: 'stockId', as: 'stock' });
ReturnProduct.belongsTo(Return, { foreignKey: 'returnItemId', as: 'return' });
ReturnProduct.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = ReturnProduct;
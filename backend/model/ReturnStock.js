const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig.js");
const Stock = require("./Stock.js");
const Product = require("./Products.js");

const ReturnStock = sequelize.define(
    "ReturnStock",
    {
        returnStockId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        returnStockDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        returnStockQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        returnStockAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        returnStockType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        returnStockNote: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stockId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Stock,
                key: "stockId",
            },
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Product,
                key: "productId",
            },
        },
    },
    {
        tableName: "returnstock",
        timestamps: false,
    }
);

// Define associations
ReturnStock.belongsTo(Stock, { foreignKey: "stockId", as: "stock" });
ReturnStock.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = ReturnStock;

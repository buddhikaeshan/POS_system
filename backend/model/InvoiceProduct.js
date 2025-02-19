const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Invoice = require('./Invoice')
const Product = require("./Products");
const Stock = require("./Stock");

const InvoiceProduct = sequelize.define(
    "InvoiceProduct",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: "productId",
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
        invoiceId: {
            type: DataTypes.INTEGER,
            references: {
                model: Invoice,
                key: "invoiceId",
            },
            allowNull: false,
        },
        invoiceNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        invoiceQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sendQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deliverdQty: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        unitAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        invoiceProductStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        warranty:{
            type:DataTypes.STRING,
            allowNull:true,
        }
    },
    {
        tableName: "invoiceproduct",
        timestamps: false,
    }
);
InvoiceProduct.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
});
InvoiceProduct.belongsTo(Stock, {
    foreignKey: "stockId",
    as: "stock",
});
InvoiceProduct.belongsTo(Invoice, {
    foreignKey: "invoiceId",
    as: "invoice",
});

module.exports = InvoiceProduct;

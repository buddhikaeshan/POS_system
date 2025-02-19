const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Supplier = require("./Supplier");
const Product = require("./Products");
const Category = require("./Category");

const Stock = sequelize.define(
    "Stock",
    {
        stockId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        stockName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mfd: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        exp: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        unitPrice: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        stockPrice: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        stockQty: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        stockDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        stockDescription: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stockStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "In Stock",
        },
        products_productId: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: "productId",
            },
        },
        supplier_supplierId: {
            type: DataTypes.INTEGER,
            references: {
                model: Supplier,
                key: "supplierId",
            },
        },
        category_categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: Category,
                key: "categoryId",
            },
        },
    },
    {
        tableName: "stock",
        timestamps: false,
    }
);
Stock.belongsTo(Product, {
    foreignKey: "products_productId",
    as: "product",
});
Stock.belongsTo(Supplier, {
    foreignKey: "supplier_supplierId",
    as: "supplier",
});
Stock.belongsTo(Category, {
    foreignKey: 'category_categoryId',
    as: 'category'
});

module.exports = Stock;

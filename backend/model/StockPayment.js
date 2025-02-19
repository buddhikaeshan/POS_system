const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Supplier = require("./Supplier");
const Stock = require("./Stock");

const StockPayment = sequelize.define(
    "StockPayment",
    {
        stockPaymentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cashAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        chequeAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        due: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        vat: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        stockQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        stockPayDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        stockPaymentStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        supplierId: {
            type: DataTypes.INTEGER,
            references: {
                model: Supplier,
                key: "supplierId",
            },
        },
        stockId: {
            type: DataTypes.INTEGER,
            references: {
                model: Stock,
                key: "stockId",
            },
        }
    },
    {
        tableName: "stockpayments",
        timestamps: false,
    }
);

StockPayment.belongsTo(Supplier, {
    foreignKey: "supplierId",
    as: "supplier",
});

StockPayment.belongsTo(Stock, {
    foreignKey: "stockId",
    as: "stock",
});

module.exports = StockPayment;
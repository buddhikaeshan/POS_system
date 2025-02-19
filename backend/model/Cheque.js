const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');
const Supplier = require('./Supplier');
const StockPayment = require('./StockPayment');

const Cheque = sequelize.define('Cheque', {
    chequeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    chequeNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    chequeAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    issuedDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    chequeDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    chequeStatus: {
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
    stockPaymentId: {
        type: DataTypes.INTEGER,
        references: {
            model: "stockPayment",
            key: "stockPaymentId",
        },
    },
},
    {
        tableName: 'chequedata',
        timestamps: false,
    }
);
Cheque.belongsTo(Supplier, {
    foreignKey: "supplierId",
    as: "supplier",
});

Cheque.belongsTo(StockPayment, {
    foreignKey: 'stockPaymentId',
    as: "stockPayment",
});

module.exports = Cheque;
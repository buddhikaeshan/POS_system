const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');
const StockPayment = require('./StockPayment');

const SupplierPayment = sequelize.define('SupplierPayment', {
    payId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    payDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    payAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stockPaymentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'supplierpayments',
});

SupplierPayment.belongsTo(StockPayment, {
    foreignKey: 'stockPaymentId',
    as: 'stockPayment',
});

module.exports = SupplierPayment;

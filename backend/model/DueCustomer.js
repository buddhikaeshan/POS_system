const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');
const Customer = require('./Customer');
const Invoice = require('./Invoice');
const Transaction = require('./Transaction');

const DueCustomer = sequelize.define('DueCustomer',
    {
      duecustomerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dueAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paidAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'cash',
      },
      datedCheque: {
        type: DataTypes.DATE,
        allowNull: true, // Allow null for non-cheque payments
      },
      chequeDetail: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for non-cheque payments
      },
      cusId: {
        type: DataTypes.INTEGER,
        references: {
          model: Customer,
          key: 'cusId',
        },
        allowNull: false,
      },
      invoiceId: {
        type: DataTypes.INTEGER,
        references: {
          model: Invoice,
          key: 'invoiceId',
        },
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.INTEGER,
        references: {
          model: Transaction,
          key: 'transactionId',
        },
        allowNull: false,
      },
    },
    {
      tableName: 'duecustomer',
      timestamps: false,
    }
  );
  
DueCustomer.belongsTo(Customer, {
    foreignKey: 'cusId',
    as: 'customer',
});
DueCustomer.belongsTo(Invoice, {
    foreignKey: 'invoiceId',
    as: 'invoice',
});
DueCustomer.belongsTo(Transaction, {
    foreignKey: 'transactionId',
    as: 'transaction',
});

module.exports = DueCustomer;
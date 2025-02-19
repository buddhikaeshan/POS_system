// const { DataTypes } = require("sequelize");
// const sequelize = require("../dbConfig");
// const Invoice = require("./Invoice");
// const User = require("./User");
// const Customer = require("./Customer");

// const Transaction = sequelize.define(
//     "Transaction",
//     {
//         transactionId: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         transactionType: {
//             type: DataTypes.STRING(255),
//             allowNull: false,
//             defaultValue: "Cash",
//         },
//         price: {
//             type: DataTypes.FLOAT,
//             allowNull: false,
//         },
//         discount: {
//             type: DataTypes.FLOAT,
//             allowNull: false,
//         },
//         dateTime: {
//             type: DataTypes.DATE,
//             allowNull: false,
//         },
//         note: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         paid: {
//             type: DataTypes.FLOAT,
//             allowNull: false,
//         },
//         due: {
//             type: DataTypes.FLOAT,
//             allowNull: false,
//         },
//         OgDue:{
//             type:DataTypes.FLOAT,
//             allowNull:false,
//         },
//         chequeDate: {
//             type: DataTypes.DATE,
//             allowNull: false,
//         },
//         totalAmount:{
//             type:DataTypes.INTEGER,
//             allowNull:false
//         },
//         invoice_invoiceId: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: Invoice,
//                 key: "invoiceId",
//             },
//             allowNull: false,
//         },
//         user_userId: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: User,
//                 key: "userId",
//             },
//             allowNull: false,
//         },
//         cusId: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: Customer,
//                 key: "cusId",
//             },
//             allowNull: false,
//         },
//     },
//     {
//         tableName: "transaction",
//         timestamps: false,
//     }
// );
// Transaction.belongsTo(Invoice, {
//     foreignKey: "invoice_invoiceId",
//     as: "product",
// });
// Transaction.belongsTo(User, {
//     foreignKey: "user_userId",
//     as: "user",
// });
// Transaction.belongsTo(Customer, {
//     foreignKey: "cusId",
//     as: "customer",
// });

// module.exports = Transaction;


const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Invoice = require("./Invoice");
const User = require("./User");
const Customer = require("./Customer");

const Transaction = sequelize.define(
    "Transaction",
    {
        transactionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        transactionType: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: "Cash",
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        dateTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paid: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        due: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        OgDue: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        chequeDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        invoice_invoiceId: {
            type: DataTypes.INTEGER,
            references: {
                model: Invoice,
                key: "invoiceId",
            },
            allowNull: false,
        },
        user_userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "userId",
            },
            allowNull: false,
        },
        cusId: {
            type: DataTypes.INTEGER,
            references: {
                model: Customer,
                key: "cusId",
            },
            allowNull: false,
        },
        dueFinishedDate: {
            type: DataTypes.DATE,  // This will store the date and time when due becomes 0
            allowNull: true, // It can be NULL initially
        },
    },
    {
        tableName: "transaction",
        timestamps: false,
    }
);

Transaction.belongsTo(Invoice, {
    foreignKey: "invoice_invoiceId",
    as: "product",
});
Transaction.belongsTo(User, {
    foreignKey: "user_userId",
    as: "user",
});
Transaction.belongsTo(Customer, {
    foreignKey: "cusId",
    as: "customer",
});

module.exports = Transaction;

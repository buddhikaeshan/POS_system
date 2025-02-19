const Transaction = require('../model/Transaction');
const DueCustomer = require('../model/DueCustomer');
const Customer = require('../model/Customer');
const Invoice = require('../model/Invoice');

const createDueCustomer = async (req, res) => {
    try {
        const { dueDate, dueAmount, paidAmount, status, cusId, invoiceId, transactionId } = req.body;
        if (!cusId || !invoiceId || !transactionId) {
            return res.status(400).json({ error: "Missing Id" });
        }

        const newDueCustomer = await DueCustomer.create({
            dueDate,
            dueAmount,
            paidAmount,
            status,
            cusId,
            invoiceId,
            transactionId,
        });

        res.status(201).json({ newDueCustomer });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ error: "Validation error: Please check the provided data." });
        }
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ error: "DueCustomer already exists." });
        }
        res.status(400).json({ error: `An error occurred: ${error.message}` });
    }
}

const getAllDueCustomers = async (req, res) => {
    try {
        const dueCustomer = await DueCustomer.findAll({
            include:[
                { model: Invoice, as: 'invoice' },
                { model: Transaction, as: 'transaction' },
                { model: Customer, as: 'customer' }
            ],
        });
        res.status(200).json(dueCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDueCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const dueCustomer = await DueCustomer.findByPk(id, {
            include: [
                { model: Invoice, as: 'invoice' },
                { model: Transaction, as: 'transaction' },
                { model: Customer, as: 'customer' }
            ],
        });

        if (dueCustomer) {
            res.status(200).json(dueCustomer);
        } else {
            res.status(404).json({ message: 'DueCustomer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDueCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            dueDate,
            dueAmount,
            paidAmount,
            status
        } = req.body;

        const dueCustomer = await DueCustomer.findByPk(id);
        if (!dueCustomer) {
            return res.status(404).json({ message: "DueCustomer not found" });
        }

        dueCustomer.dueDate = dueDate;
        dueCustomer.dueAmount = dueAmount;
        dueCustomer.paidAmount = paidAmount;
        dueCustomer.status = status;

        await dueCustomer.save();

        res.status(200).json({ dueCustomer });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteDueCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const dueCustomer = await DueCustomer.findByPk(id);
        if (!dueCustomer) {
            return res.status(400).json({ message: "Due Customer not found" })
        }
        await dueCustomer.destroy();
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createDueCustomer,
    getAllDueCustomers,
    getDueCustomerById,
    updateDueCustomer,
    deleteDueCustomer
};
const Invoice = require("../model/Invoice");
const Return = require("../model/Return");
const Store = require("../model/Store");
const User = require("../model/User");

const createReturn = async (req, res) => {
    try {
        const { returnItemDate, draft, storeId, userId, invoiceId } = req.body;

        if (!returnItemDate || !storeId || !userId || !invoiceId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const store = await Store.findByPk(storeId);
        if (!store) return res.status(400).json({ message: "Invalid store ID" });

        const user = await User.findByPk(userId);
        if (!user) return res.status(400).json({ message: "Invalid user ID" });

        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) return res.status(400).json({ message: "Invalid invoice ID" });

        const lastReturn = await Return.findOne({
            order: [['returnTime', 'DESC']],
        });

        const newReturn = await Return.create({
            returnItemDate,
            returnTime: 1,
            draft,
            store_storeId: storeId,
            user_userId: userId,
            invoice_invoiceId: invoiceId,
        });

        const returnWithAssociations = await Return.findByPk(newReturn.returnItemId, {
            include: [
                { model: Store, as: "store" },
                { model: User, as: "user" },
                { model: Invoice, as: "invoice" },
            ],
        });

        res.status(201).json(returnWithAssociations);
    } catch (error) {
        return res.status(500).json({ message: `An internal error occurred: ${error.message}` });
    }
};

// Get all returns
const getAllReturns = async (req, res) => {
    try {
        const returns = await Return.findAll({
            include: [
                { model: Store, as: "store" },
                { model: User, as: "user" },
                { model: Invoice, as: "invoice" },
            ],
        });
        res.status(200).json(returns);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

// Get a return by ID
const getReturnById = async (req, res) => {
    try {
        const { id } = req.params;
        const returnItem = await Return.findByPk(id, {
            include: [
                { model: Store, as: "store" },
                { model: User, as: "user" },
                { model: Invoice, as: "invoice" },
            ],
        });

        if (returnItem) {
            res.status(200).json(returnItem);
        } else {
            res.status(404).json({ message: "Return not found" });
        }
    } catch (error) {
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
};

async function deleteReturns(req, res) {
    try {
        const { id } = req.params;

        const returnItem = await Return.findByPk(id);
        if (!returnItem) {
            return res.status(404).json({ message: `Return  not found` });
        }
        await returnItem.destroy();

        res.status(200).json({
            message: `Return deleted successfully`,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateReturn(req, res) {
    try {
        const { id } = req.params;
        const { returnItemDate, returnTime, draft, storeId, userId, invoiceId } = req.body;

        const returnItem = await Return.findByPk(id);
        if (!returnItem) {
            return res.status(404).json({ message: "Return not found" });
        }

        await returnItem.update({
            returnItemDate, returnTime, draft, storeId, userId, invoiceId
        });

        res.status(200).json(returnItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createReturn,
    getAllReturns,
    getReturnById,
    updateReturn,
    deleteReturns,
};

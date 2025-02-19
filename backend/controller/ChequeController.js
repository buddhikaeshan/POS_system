const Cheque = require('../model/Cheque');
const StockPayment = require('../model/StockPayment');
const Supplier = require('../model/Supplier');
const { Sequelize } = require('sequelize');
const { fn, col } = Sequelize;

async function addCheque(req, res) {
    try {
        const cheques = req.body;

        // Validate input
        if (!Array.isArray(cheques) || cheques.length === 0) {
            return res.status(400).json({ message: 'No cheques provided' });
        }

        const createdCheques = [];

        for (const cheque of cheques) {
            const { chequeNumber, chequeAmount, issuedDate, chequeDate, chequeStatus, supplierId, stockPaymentId } = cheque;

            // Validate related entities
            const supplier = await Supplier.findByPk(supplierId);
            if (!supplier) {
                return res.status(400).json({ message: `Invalid supplier ID: ${supplierId}` });
            }

            const stockPayment = await StockPayment.findByPk(stockPaymentId);
            if (!stockPayment) {
                return res.status(400).json({ message: `Invalid stockPayment ID: ${stockPaymentId}` });
            }

            const existingChequeNum = await Cheque.findOne({ where: { chequeNumber } });
            if (existingChequeNum) {
                return res.status(400).json({ error: "This cheque number is already exists." });
            }

            const newCheque = await Cheque.create({
                chequeNumber,
                chequeAmount,
                issuedDate,
                chequeDate,
                chequeStatus: 'Pending',
                supplierId,
                stockPaymentId,
            });

            createdCheques.push(newCheque);
        }
        res.status(201).json({
            message: 'New cheque(s) added successfully',
            cheques: createdCheques,
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

async function getAllCheques(req, res) {
    try {
        const cheques = await Cheque.findAll({
            include: [
                { model: Supplier, as: 'supplier' },
                { model: StockPayment, as: 'stockPayment' },
            ],
        });

        if (cheques.length === 0) {
            return res.status(404).json({ message: 'No cheques found' });
        }

        res.status(200).json(cheques);
    } catch (err) {
        console.error('Error fetching all cheques:', err);
        res.status(500).json({ error: 'Failed to retrieve cheques' });
    }
}

async function getChequeById(req, res) {
    try {
        const chequeId = req.params.id;
        const cheque = await Cheque.findByPk(chequeId, {
            include: [
                { model: Supplier, as: 'supplier' },
                { model: StockPayment, as: 'stockPayment' },
            ],
        });
        if (!cheque) {
            return res.status(404).json({ message: `Cheque with ID ${chequeId} not found` });
        }
        res.status(200).json(cheque);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

async function updateCheque(req, res) {
    try {
        const { id } = req.params;
        const { chequeNumber, chequeAmount, chequeDate, chequeStatus, supplierId, stockPaymentId } = req.body;

        // Find the existing cheque by ID
        const chequeData = await Cheque.findByPk(id);
        if (!chequeData) {
            return res.status(404).json({ message: `Cheque with ID ${id} not found` });
        }

        // Update the cheque data
        await chequeData.update({
            chequeNumber,
            chequeAmount,
            chequeDate,
            chequeStatus,
            supplierId,
            stockPaymentId,
        });

        res.status(200).json(chequeData);
    } catch (error) {
        console.error('Error updating cheque:', error);
        res.status(400).json({ error: error.message });
    }
}


async function countPendingCheques(req, res) {
    try {
        const pendingChequeCount = await Cheque.count({
            where: { chequeStatus: 'Pending' },
        });

        res.status(200).json({
            message: 'Pending cheques count retrieved successfully',
            count: pendingChequeCount,
        });
    } catch (err) {
        console.error('Error counting pending cheques:', err);
        res.status(500).json({ error: 'Failed to count pending cheques' });
    }
}

async function getClearedChequeTotal(req, res) {
    try {
        const totalCleared = await Cheque.findOne({
            attributes: [[fn('SUM', col('chequeAmount')), 'totalAmount']],
            where: { chequeStatus: 'Cleared' },
            raw: true,
        });

        res.status(200).json({
            message: 'Total cleared cheques amount retrieved successfully',
            totalAmount: parseFloat(totalCleared.totalAmount || 0),
        });
    } catch (err) {
        console.error('Error fetching cleared cheques total:', err);
        res.status(500).json({ error: 'Failed to fetch cleared cheques total' });
    }
}

async function getPendingChequeTotal(req, res) {
    try {
        const totalPending = await Cheque.findOne({
            attributes: [[fn('SUM', col('chequeAmount')), 'totalAmount']],
            where: { chequeStatus: 'Pending' },
            raw: true,
        });

        res.status(200).json({
            message: 'Total pending cheques amount retrieved successfully',
            totalAmount: parseFloat(totalPending.totalAmount || 0),
        });
    } catch (err) {
        console.error('Error fetching pending cheques total:', err);
        res.status(500).json({ error: 'Failed to fetch pending cheques total' });
    }
}

async function getChequesBySupplierId(req, res) {
    try {
        const { supplierId } = req.params;
        const cheque = await Cheque.findAll({ where: { supplierId } });
        if (!cheque) {
            return res.status(404).json({ message: "Stock Payment not found" });
        }
        res.status(200).json(cheque);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getPendingChequeTotalBySupplier(req, res) {
    try {
        const { supplierId } = req.params;

        const totalPending = await Cheque.findOne({
            attributes: [
                [fn('SUM', col('chequeAmount')), 'totalAmount'],
                'supplierId'
            ],
            where: {
                chequeStatus: 'Pending',
                supplierId: supplierId
            },
            group: ['supplierId'],
            raw: true,
        });

        res.status(200).json({
            message: 'Pending cheques total for supplier retrieved successfully',
            totalAmount: parseFloat(totalPending?.totalAmount || 0),
            supplierId: supplierId
        });

    } catch (err) {
        console.error('Error fetching pending cheques total by supplier:', err);
        res.status(500).json({
            error: 'Failed to fetch pending cheques total for supplier'
        });
    }
}


module.exports = {
    addCheque,
    getAllCheques,
    getChequeById,
    updateCheque,
    countPendingCheques,
    getClearedChequeTotal,
    getPendingChequeTotal,
    getChequesBySupplierId,
    getPendingChequeTotalBySupplier
};
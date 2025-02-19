const Stock = require("../model/Stock");
const StockPayment = require("../model/StockPayment");
const Supplier = require("../model/Supplier");
const { Op, fn, col } = require("sequelize");

async function createStockPayment(req, res) {
    try {
        const { cashAmount, chequeAmount, due, vat, total, stockQty, stockPayDate, supplierId, stockId } = req.body;

        // Basic input validation
        if (cashAmount === undefined || chequeAmount === undefined || due === undefined) {
            return res.status(400).json({ error: "Missing payment amounts." });
        }

        if (total === undefined || total <= 0) {
            return res.status(400).json({ error: "Invalid or missing total amount." });
        }

        if (stockQty === undefined || stockQty <= 0) {
            return res.status(400).json({ error: "Invalid or missing stock quantity." });
        }

        const newStockPayment = await StockPayment.create({
            cashAmount,
            chequeAmount,
            due,
            vat,
            total,
            stockQty,
            stockPayDate,
            stockPaymentStatus: "Unpaid",
            supplierId,
            stockId,
        });

        res.status(201).json({
            message: "Stock payment created successfully",
            payment: newStockPayment,
        });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.error("Validation errors:", error.errors);
            return res.status(400).json({
                error: "Validation error: Please check the provided data.",
            });
        }
        console.error("An internal error occurred:", error.message);
        return res.status(500).json({
            error: `An internal error occurred: ${error.message}`,
        });
    }
}

async function getAllStockPayments(req, res) {
    try {
        const stockPayments = await StockPayment.findAll({
            include: [
                { model: Supplier, as: 'supplier' },
                { model: Stock, as: 'stock' }
            ]
        });

        if (stockPayments.length === 0) {
            return res.status(404).json({ message: "No stock payments found" });
        }

        res.status(200).json(stockPayments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `An internal error occurred: ${error.message}` });
    }
}

async function getStockPaymentById(req, res) {
    try {
        const { id } = req.params;

        const stockPayment = await StockPayment.findByPk(id,
            {
                include: [
                    { model: Supplier, as: 'supplier' },
                    { model: Stock, as: 'stock' }
                ]
            }
        );

        if (!stockPayment) {
            return res.status(404).json({ message: `StockPayment not found for ID: ${id}` });
        }

        res.status(200).json(stockPayment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `An internal error occurred: ${error.message}` });
    }
}

async function updateStockPayment(req, res) {
    try {
        const { id } = req.params;
        const { cashAmount, chequeAmount, due, vat, total, stockPayDate, stockQty, stockPaymentStatus, supplierId, stockId } = req.body;

        const stockPayment = await StockPayment.findByPk(id);

        if (!stockPayment) {
            return res.status(404).json({ message: `StockPayment not found for ID: ${id}` });
        }

        await stockPayment.update({
            cashAmount,
            chequeAmount,
            due,
            vat,
            total,
            stockQty,
            stockPayDate,
            stockPaymentStatus,
            supplierId,
            stockId,
        });

        res.status(200).json({ message: "StockPayment updated successfully", stockPayment });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.error("Validation errors:", error.errors);
            return res.status(400).json({
                error: "Validation error: Please check the provided data.",
                details: error.errors,
            });
        }

        // Handle other internal errors
        console.error("An internal error occurred:", error.message);
        return res.status(500).json({
            error: `An internal error occurred: ${error.message}`,
        });
    }
}

async function countDuePayments(req, res) {
    try {
        const duePaymentsCount = await StockPayment.count({
            where: {
                due: {
                    [require('sequelize').Op.gt]: 0,
                },
            },
        });

        res.status(200).json({
            message: `Number of due payments: ${duePaymentsCount}`,
            count: duePaymentsCount,
        });
    } catch (error) {
        console.error("An internal error occurred:", error.message);
        res.status(500).json({
            error: `An internal error occurred: ${error.message}`,
        });
    }
}

async function totalDues(req, res) {
    try {
        const totalDue = await StockPayment.sum('due', {
            where: {
                due: {
                    [require('sequelize').Op.gt]: 0,
                },
            },
        });

        res.status(200).json({
            message: `Total due amount: ${totalDue}`,
            totalDue,
        });
    } catch (error) {
        console.error("An internal error occurred:", error.message);
        res.status(500).json({
            error: `An internal error occurred: ${error.message}`,
        });
    }
}

async function getStockPaymentBySupplierId(req, res) {
    try {
        const { supplierId } = req.params;
        const stockPayment = await StockPayment.findAll({ where: { supplierId } });
        if (!stockPayment) {
            return res.status(404).json({ message: "Stock Payment not found" });
        }
        res.status(200).json(stockPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function countDuePaymentsBySupplier(req, res) {
    try {
        const { supplierId } = req.params;

        const duePayments = await StockPayment.findAll({
            attributes: [
                [fn("COUNT", col("stockPaymentId")), "unpaidInvoices"],
                [fn("SUM", col("due")), "totalDue"]
            ],
            where: {
                supplierId,
                due: { [Op.gt]: 0 }
            },
            include: [{
                model: Supplier,
                as: "supplier",
                attributes: [],
                required: true
            }],
            raw: true
        });

        if (!duePayments || duePayments.length === 0) {
            return res.status(200).json({
                unpaidInvoices: 0,
                totalDue: 0
            });
        }

        res.status(200).json({
            unpaidInvoices: Number(duePayments[0].unpaidInvoices) || 0,
            totalDue: Number(duePayments[0].totalDue) || 0
        });
    } catch (error) {
        console.error("Error fetching due payments:", error);
        res.status(500).json({
            error: "Failed to fetch due payments",
            details: error.message
        });
    }
}

const totalDuesBySupplier = async (req, res) => {
    try {
        const { supplierId } = req.params;

        const totalDue = await StockPayment.findAll({
            attributes: [
                'supplierId',
                [fn('SUM', col('due')), 'totalDue']
            ],
            where: {
                supplierId,
                due: { [Op.gt]: 0 },
            },
            group: ['supplierId'],
            include: [{
                model: Supplier,
                as: 'supplier',
                attributes: ['supplierId', 'supplierName']
            }]
        });

        res.status(200).json({
            message: "Total due amount per supplier",
            totalDue: totalDue[0] ? totalDue[0].dataValues.totalDue : 0,
        });
    } catch (error) {
        console.error("An internal error occurred:", error.message);
        res.status(500).json({ error: `An internal error occurred: ${error.message}` });
    }
};

async function getStockPaymentByStockId(req, res) {
    try {
        const { stockId } = req.params;
        const stockPayment = await StockPayment.findAll({ where: { stockId } });
        if (!stockPayment) {
            return res.status(404).json({ message: "Stock Payment not found" });
        }
        res.status(200).json(stockPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    createStockPayment,
    getAllStockPayments,
    getStockPaymentById,
    updateStockPayment,
    countDuePayments,
    totalDues,
    getStockPaymentBySupplierId,
    countDuePaymentsBySupplier,
    totalDuesBySupplier,
    getStockPaymentByStockId
};

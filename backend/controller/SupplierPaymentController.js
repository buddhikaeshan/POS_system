const StockPayment = require('../model/StockPayment');
const Supplier = require('../model/Supplier');
const SupplierPayment = require('../model/SupplierPayment');

async function createSupplierPayment(req, res) {
    try {
        const { payDate, payAmount, stockPaymentId } = req.body;

        const stockPayment = await StockPayment.findByPk(stockPaymentId);
        if (!stockPayment) {
            return res.status(404).json({ error: "StockPayment not found for the provided stockPaymentId." });
        }

        const newSupplierPayment = await SupplierPayment.create({
            payDate,
            payAmount,
            stockPaymentId,
        });

        res.status(201).json({
            message: "Supplier payment created successfully.",
            payment: newSupplierPayment,
        });

    } catch (error) {
        console.error("An internal error occurred:", error.message);
        return res.status(500).json({
            error: `An internal error occurred: ${error.message}`,
        });
    }
}

async function getAllSupplierPayments(req, res) {
    try {
        const supplierPayments = await SupplierPayment.findAll({
            include: {
                model: StockPayment,
                as: 'stockPayment',
            },
        });

        res.status(200).json(supplierPayments);

    } catch (error) {
        console.error("An internal error occurred:", error.message);
        return res.status(500).json({
            error: `An internal error occurred: ${error.message}`,
        });
    }
}

async function getSupplierPaymentByStockPaymentId(req, res) {
    try {
        const { stockPaymentId } = req.params;
        const supplerPayment = await SupplierPayment.findAll({ where: { stockPaymentId } });
        if (!supplerPayment) {
            return res.status(404).json({ message: "Supplier Payment not found" });
        }
        res.status(200).json(supplerPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createSupplierPayment,
    getAllSupplierPayments,
    getSupplierPaymentByStockPaymentId,
};

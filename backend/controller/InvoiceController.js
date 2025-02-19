const Invoice = require("../model/Invoice");
const Product = require("../model/Products");
const Stock = require("../model/Stock");
const Customer = require("../model/Customer");
const Transaction = require("../model/Transaction")

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

// Image upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'invoice');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const invoiceNo = req.body.invoiceNo || 'INV';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const safeInvoiceNo = invoiceNo.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${safeInvoiceNo}_${timestamp}${ext}`);
    }
});

const upload = multer({ storage: storage }).single('image');

const generateNextInvoiceNumber = async (req,res) => {
    try {
        const lastInvoice = await Invoice.findOne({
            order: [['invoiceNo', 'DESC']],
        });

        if (!lastInvoice) {
            return 1500;
        }

        // Generate the next sequential number
        const nextInvoiceNo = parseInt(lastInvoice.invoiceNo) + 1;
        return nextInvoiceNo;
        res.json({ invoiceNo: nextInvoiceNo }); 
    } catch (error) {
        throw new Error(`Error generating invoice number: ${error.message}`);
    }
};

// Create invoice
const createInvoice = async (req, res) => {
    try {
        const {
            invoiceDate,
            status = 'invoice',
            purchaseNo,
            store,
            cusId,
            invoiceTime = '1',
            deliveryTime = '1',
            performa = 'false',
            draft,
        } = req.body;

        if (!invoiceDate || !status || !store) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!cusId) {
            return res.status(400).json({ error: 'Customer Details Missing' });
        }
        // Generate the next invoice number if not provided
        const invoiceNo =  await generateNextInvoiceNumber();

        // Create the new invoice
        const newInvoice = await Invoice.create({
            invoiceNo,
            invoiceDate,
            status,
            purchaseNo,
            store,
            cusId,
            invoiceTime,
            deliveryTime,
            performa,
            draft
        });

        // Return the newly created invoice
        res.status(201).json(newInvoice);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.error('Validation errors:', error.errors);
            return res.status(400).json({ error: "Validation error: Please check the provided data." });
        }
        return res.status(500).json({ error: `An internal error occurred: ${error.message}` });
    }
};

// Update invoice
const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            invoiceDate,
            status,
            purchaseNo,
            store,
            cusId,
            draft,
            deliveryTime
        } = req.body;

        const customer = await Customer.findByPk(cusId);
        if (!customer) {
            return res.status(400).json({ message: 'Invalid customer ID' });
        }

        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        await invoice.update({
            invoiceDate,
            status,
            purchaseNo,
            store,
            cusId,
            draft,
            deliveryTime
        });

        res.status(200).json(invoice);
    } catch (error) {
        console.error("Error updating invoice:", error);
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
};

const getLastInvoiceNumber = async (req, res) => {
    try {
        const lastInvoice = await Invoice.findOne({
            order: [['invoiceNo', 'DESC']],
        });

        if (!lastInvoice) {
            return res.status(200).json({ lastInvoiceNo: 1500 });
        }

        res.status(200).json({ lastInvoiceNo: lastInvoice.invoiceNo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllInvoice = async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            include: [
                { model: Customer, as: 'customer' },
            ],
        });

        if (invoices.length === 0) {
            return res.status(404).json({ message: "No invoices found" });
        }

        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findByPk(id, {
            include: [
                { model: Customer, as: 'customer' },
            ],
        });

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getInvoiceByNo = async (req, res) => {
    try {
        const { num } = req.params;

        const invoice = await Invoice.findOne({
            where: { invoiceNo: num },
            include: [{ model: Customer, as: 'customer' }],
        });

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDeliveryTime = async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveryTime,status } = req.body;
        const invoice = await Invoice.findByPk(id);
        if (invoice) {
            await invoice.update({ deliveryTime,status });
            res.status(200).json(invoice);
        } else {
            res.status(404).json({ message: "Invoice not found" });
        }
    } catch (error) {
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
}

const updateInvoiceDraft = async (req, res) => {
    try {
        const { id } = req.params;
        const { draft } = req.body;
        const invoice = await Invoice.findByPk(id);
        if (invoice) {
            await invoice.update({ draft });
            res.status(200).json(invoice);
        } else {
            res.status(404).json({ message: "Invoice not found" });
        }
    } catch (error) {
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
}

// Delete a Invoice
const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        await invoice.destroy();
        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Multer error: Image upload failed' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error: Image upload failed' });
        }

        try {
            const { id } = req.params;

            const invoice = await Invoice.findByPk(id);
            if (!invoice) {
                return res.status(404).json({ message: "Invoice not found" });
            }

            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const image = `${req.protocol}://${req.get('host')}/uploads/invoice/${req.file.filename}`;
            invoice.image = image;
            await invoice.save();

            return res.status(200).json({
                message: "File successfully uploaded",
                image,
            });

        } catch (error) {
            console.error("Error updating invoice image:", error);
            return res.status(500).json({ error: "Server error: Unable to update file" });
        }
    });
}

const checkPurchaseNoExists = async (req, res) => {
    try {
        const { purchaseNo } = req.params;
        const invoice = await Invoice.findOne({ where: { purchaseNo } });
        res.status(200).json({ exists: !!invoice });
    } catch (error) {
        console.error('Error checking purchaseNo:', error);
        res.status(500).json({ error: 'An error occurred while checking the purchase number' });
    }
};

const updatePerforma = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const { performa } = req.body;

        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        await invoice.update({ performa });
        res.status(200).json(invoice);
    } catch (error) {
        console.error('Error updating performa:', error);
        res.status(500).json({ message: "An error occurred while updating performa" });
    }
};  

module.exports = {
    createInvoice,
    getAllInvoice,
    getInvoiceById,
    getInvoiceByNo,
    updateInvoice,
    updateDeliveryTime,
    deleteInvoice,
    getLastInvoiceNumber,
    generateNextInvoiceNumber,
    addImage,
    checkPurchaseNoExists,
    updatePerforma,
    updateInvoiceDraft
};

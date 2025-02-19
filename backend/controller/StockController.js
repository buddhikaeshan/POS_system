const Stock = require("../model/Stock");
const Supplier = require("../model/Supplier");
const Product = require("../model/Products");
const Category = require("../model/Category");
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

async function createStock(req, res) {
    try {
        const stocks = req.body;

        // Validate input
        if (!Array.isArray(stocks) || stocks.length === 0) {
            return res.status(400).json({ message: 'No products provided' });
        }

        const createdStocks = [];

        for (const stock of stocks) {
            const { stockName, exp, mfd, unitPrice, stockPrice, stockQty, stockDate, stockDescription, products_productId, supplier_supplierId, category_categoryId } = stock;

            // Validate related entities
            const product = await Product.findByPk(products_productId);
            if (!product) {
                return res.status(400).json({ message: `Invalid product ID: ${products_productId}` });
            }

            const supplier = await Supplier.findByPk(supplier_supplierId);
            if (!supplier) {
                return res.status(400).json({ message: `Invalid supplier ID: ${supplier_supplierId}` });
            }

            const category = await Category.findByPk(category_categoryId);
            if (!category) {
                return res.status(400).json({ message: `Invalid category ID: ${category_categoryId}` });
            }

            // Create stock
            const newStock = await Stock.create({
                stockName,
                exp,
                mfd,
                stockPrice,
                unitPrice,
                stockQty,
                stockDate,
                stockDescription,
                stockStatus: 'In Stock',
                products_productId,
                supplier_supplierId,
                category_categoryId,
            });

            createdStocks.push(newStock);
        }

        res.status(201).json({
            message: 'New stock(s) added successfully',
            stocks: createdStocks,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAllStocks(req, res) {
    try {
        const stock = await Stock.findAll({
            include: [
                { model: Product, as: 'product' },
                { model: Supplier, as: 'supplier' },
                { model: Category, as: 'category' },
            ]
        });
        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

async function getStockById(req, res) {
    try {
        const stockId = req.params.id;
        const stock = await Stock.findAll({
            where: { stockId },
            include: [
                { model: Product, as: 'product' },
                { model: Supplier, as: 'supplier' },
                { model: Category, as: 'category' },
            ]
        });

        if (stock.length === 0) {
            return res.status(404).json({ message: 'No stock found' });
        }

        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getStockIdUsingProductId(req, res) {
    try {
        const { products_productId } = req.params;
        const stock = await Stock.findOne({ where: { products_productId } });
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }
        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateStock(req, res) {
    try {
        const { id } = req.params;
        const {
            stockName,
            mfd,
            exp,
            stockPrice,
            stockQty,
            stockDate,
            stockDescription,
            stockStatus,
            products_productId,
            supplier_supplierId,
            category_categoryId,
        } = req.body;

        // Check if the stock exists
        const stock = await Stock.findByPk(id);
        if (!stock) {
            return res.status(404).json({ message: `Stock with ID ${id} not found` });
        }

        // Update stock fields
        await stock.update({
            stockName,
            mfd,
            exp,
            stockPrice,
            unitPrice,
            stockQty,
            stockDate,
            stockDescription,
            stockStatus,
            products_productId,
            supplier_supplierId,
            category_categoryId,
        });

        res.status(200).json({
            message: 'Stock updated successfully',
            stock,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteStock(req, res) {
    try {
        const { id } = req.params;

        // Check if the stock exists
        const stock = await Stock.findByPk(id);
        if (!stock) {
            return res.status(404).json({ message: `Stock not found` });
        }

        // Delete stock
        await stock.destroy();

        res.status(200).json({
            message: `Stock deleted successfully`,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getStockIdUsingSupplierId(req, res) {
    try {
        const { supplier_supplierId } = req.params;

        const stocks = await Stock.findAll({
            where: { supplier_supplierId }
        });

        if (!stocks || stocks.length === 0) {
            return res.status(404).json({ message: "No stock found for this supplier" });
        }

        res.status(200).json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getStockSuggestions(req, res) {
    try {
        const { query } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(200).json([]);
        }

        const stocks = await Stock.findAll({
            where: {
                stockName: { [Op.like]: `%${query}%` }
            },
            limit: 10,
            include: [{ model: Product, as: 'product' }],
        });

        res.status(200).json(stocks);
    } catch (error) {
        console.error("Error fetching stock suggestions:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

async function getStockByName(req, res) {

    try {
        const { name } = req.params;

        const stock = await Stock.findOne({
            where: { stockName: name }
        });

        if (!stock) {
            return res.status(404).json({ message: "stock not found" });
        } stock
        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createStock,
    getAllStocks,
    getStockById,
    getStockIdUsingProductId,
    updateStock,
    deleteStock,
    getStockIdUsingSupplierId,
    getStockSuggestions,
    getStockByName
};

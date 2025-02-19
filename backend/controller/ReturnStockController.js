const Product = require("../model/Products");
const ReturnStock = require("../model/ReturnStock");
const Stock = require("../model/Stock");


async function createReturnStock(req, res) {
    try {
        const returnStocks = req.body;

        // Validate input
        if (!Array.isArray(returnStocks) || returnStocks.length === 0) {
            return res.status(400).json({ message: "No return stocks provided" });
        }

        const createdReturnStocks = [];

        for (const returnStockItem of returnStocks) {
            const { returnStockDate, returnStockQty, returnStockAmount, returnStockType, returnStockNote, stockId, productId } = returnStockItem;

            // Validate required fields
            if (!returnStockDate || !returnStockQty || !returnStockAmount || !returnStockType || !productId || !stockId) {
                return res.status(400).json({
                    message: "Missing required fields in return stocks",
                    returnStockItem,
                });
            }

            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(400).json({ message: `Invalid Product ID: ${productId}` });
            }

            const stock = await Stock.findByPk(stockId);
            if (!stock) {
                return res.status(400).json({
                    message: `Invalid Stock ID: ${stockId}`,
                });
            }

            // Create return stock
            const newReturnStock = await ReturnStock.create({
                returnStockDate,
                returnStockQty,
                returnStockAmount,
                returnStockType,
                returnStockNote,
                stockId,
                productId
            });

            createdReturnStocks.push(newReturnStock);

            // Update stock quantity
            const updatedStockQty = parseFloat(stock.stockQty) - parseFloat(returnStockQty);
            console.log("Current stock Qty:", stock.stockQty);
            console.log("Return stock Qty:", returnStockQty);
            console.log("Updated stock Qty:", updatedStockQty);

            await stock.update({ stockQty: updatedStockQty });
        }

        res.status(201).json({
            message: "New returns added successfully",
            returns: createdReturnStocks,
        });

    } catch (error) {
        console.error("Error creating return stocks:", error);
        res.status(500).json({
            error: `An error occurred: ${error.message}`,
        });
    }
};

async function getAllReturnStocks(req, res) {
    try {
        const returnStock = await ReturnStock.findAll({
            include: [
                {
                    model: Stock,
                    as: 'stock'
                },
                {
                    model: Product,
                    as: 'product'
                },
            ]
        });

        res.status(200).json(returnStock);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

async function getReturnStockById(req, res) {
    try {
        const returnStockId = req.params.returnStockId;

        if (!returnStockId) {
            return res.status(400).json({ message: "Return Stock ID is required" });
        }

        const returnStock = await ReturnStock.findOne({
            where: { returnStockId },
            include: [
                {
                    model: Stock,
                    as: 'stock'
                },
                {
                    model: Product,
                    as: 'product'
                }
            ],
        });

        if (!returnStock) {
            return res.status(404).json({ message: 'No return stock found for the given ID' });
        }

        res.status(200).json(returnStock);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

async function getStockReturnsByStockId(req, res) {
    try {
        const { stockId } = req.params;

        const returnStock = await ReturnStock.findAll({
            where: { stockId }
        });

        if (!returnStock || returnStock.length === 0) {
            return res.status(404).json({ message: "No stock found for this supplier" });
        }

        res.status(200).json(returnStock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateReturnStock(req, res) {
    try {
        const { id } = req.params;
        const { returnStockDate, returnStockQty, returnStockAmount, returnStockType, returnStockNote, stockId, productId } = req.body;


        const returnStock = await ReturnStock.findByPk(id);
        if (!returnStock) {
            return res.status(404).json({ message: "Return stock not found" });
        }

        const stock = await Stock.findByPk(returnStock.stockId);
        if (!stock) {
            return res.status(400).json({ message: `Invalid Stock ID: ${returnStock.stockId}` });
        }

        let newStock = stock;
        if (stockId && stockId !== returnStock.stockId) {
            newStock = await Stock.findByPk(stockId);
            if (!newStock) {
                return res.status(400).json({ message: `Invalid Stock ID: ${stockId}` });
            }
        }

        if (productId && productId !== returnStock.productId) {
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(400).json({ message: `Invalid Product ID: ${productId}` });
            }
        }

        if (returnStockQty) {
            const previousQty = parseFloat(returnStock.returnStockQty);
            const newQty = parseFloat(returnStockQty);
            const qtyDifference = newQty - previousQty;


            const updatedStockQty = parseFloat(stock.stockQty) - qtyDifference;
            await stock.update({ stockQty: updatedStockQty });
        }

        await returnStock.update({
            returnStockDate: returnStockDate,
            returnStockQty: returnStockQty,
            returnStockAmount: returnStockAmount,
            returnStockType: returnStockType,
            returnStockNote: returnStockNote,
            stockId: stockId,
            productId: productId,
        });

        res.status(200).json({
            message: "Return stock updated successfully",
            returnStock
        });

    } catch (error) {
        console.error("Error updating return stock:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

async function deleteStockReturns(req, res) {
    try {
        const { id } = req.params;

        const returnStock = await ReturnStock.findByPk(id);
        if (!returnStock) {
            return res.status(404).json({ message: `Stock not found` });
        }
        await returnStock.destroy();

        res.status(200).json({
            message: `Stock deleted successfully`,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = {
    createReturnStock,
    getAllReturnStocks,
    getReturnStockById,
    getStockReturnsByStockId,
    updateReturnStock,
    deleteStockReturns,
};

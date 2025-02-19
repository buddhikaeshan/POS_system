const ReturnProduct = require('../model/ReturnProduct');
const InvoiceProduct = require('../model/InvoiceProduct');
const Stock = require('../model/Stock');
const Return = require('../model/Return');
const Product = require('../model/Products');

async function createReturnProduct(req, res) {
    try {
        const returns = req.body;

        // Validate input
        if (!Array.isArray(returns) || returns.length === 0) {
            return res.status(400).json({ message: "No returns provided" });
        }

        const createdReturns = [];

        for (const returnItem of returns) {
            const { returnQty, returnAmount, returnItemType, returnNote, returnDate, invoiceProductId, stockId, returnItemId, productId } = returnItem;

            // Validate required fields
            if (!returnQty || !returnItemType || !invoiceProductId || !returnItemId || !productId) {
                return res.status(400).json({
                    message: "Missing required fields in return item",
                    returnItem,
                });
            }

            // Validate related entities
            const invoiceProduct = await InvoiceProduct.findByPk(invoiceProductId);
            if (!invoiceProduct) {
                return res.status(400).json({ message: `Invalid invoice product ID: ${invoiceProductId}` });
            }

            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(400).json({ message: `Invalid product ID: ${productId}` });
            }

            // Create return product
            const newReturnProduct = await ReturnProduct.create({
                returnQty,
                returnAmount,
                returnItemType,
                returnNote,
                returnDate,
                invoiceProductId,
                stockId,
                returnItemId,
                productId
            });

            createdReturns.push(newReturnProduct);

            // If stockId exists, update stock
            if (stockId) {
                const stock = await Stock.findByPk(stockId);
                if (stock) {
                    const updatedStockQty = parseFloat(stock.stockQty) + parseFloat(returnQty);
                    console.log("Current stockQty:", stock.stockQty);
                    console.log("Return Qty:", returnQty);
                    console.log("Updated stockQty:", updatedStockQty);

                    await stock.update({ stockQty: updatedStockQty });
                } else {
                    console.warn(`Stock ID ${stockId} not found. Skipping stock update.`);
                }
            } else {
                console.warn(`Return item ${returnItemId} has no stockId. Skipping stock update.`);
            }
        }

        res.status(201).json({
            message: "New returns added successfully",
            returns: createdReturns,
        });
    } catch (error) {
        console.error("Error creating return products:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

async function getAllReturnProducts(req, res) {
    try {
        const returnProducts = await ReturnProduct.findAll({
            include: [
                {
                    model: InvoiceProduct,
                    as: 'invoiceProduct'
                },
                {
                    model: Stock,
                    as: 'stock'
                },
                {
                    model: Return,
                    as: 'return'
                },
                {
                    model: Product,
                    as: 'product'
                },
            ]
        });

        res.status(200).json(returnProducts);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

async function getAllReturnProductsById(req, res) {
    try {
        const returnProductId = req.params.id;

        const returnProducts = await ReturnProduct.findAll({
            where: { returnProductId },
            include: [
                {
                    model: InvoiceProduct,
                    as: 'invoiceProduct',
                },
                {
                    model: Stock,
                    as: 'stock',
                },
                {
                    model: Return,
                    as: 'return'
                },
            ],
        });

        if (returnProducts.length === 0) {
            return res.status(404).json({ message: 'No return products found for the given ID' });
        }

        res.status(200).json(returnProducts);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

async function getReturnProductsByReturnId(req, res) {
    try {
        const { returnItemId } = req.params;

        if (!returnItemId) {
            return res.status(400).json({ message: "Return product ID is required" });
        }

        const returnProducts = await ReturnProduct.findAll({
            where: { returnItemId },
            include: [
                {
                    model: InvoiceProduct,
                    as: 'invoiceProduct',
                },
                {
                    model: Stock,
                    as: 'stock',
                },
                {
                    model: Return,
                    as: 'return'
                },
                {
                    model: Product,
                    as: 'product'
                }
            ],
        });

        if (returnProducts.length === 0) {
            return res.status(404).json({ message: 'No return products found for the given invoice product ID' });
        }

        res.status(200).json(returnProducts);
    } catch (error) {
        console.error("Error fetching return products by invoice product ID:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

async function updateReturnProduct(req, res) {
    try {
        const { id } = req.params;
        const {
            returnQty,
            returnAmount,
            returnItemType,
            returnNote,
            returnDate,
            invoiceProductId,
            stockId,
            returnItemId,
            productId
        } = req.body;

        // Find the existing return product
        const returnProduct = await ReturnProduct.findByPk(id);
        if (!returnProduct) {
            return res.status(404).json({ message: "Return product not found" });
        }

        // Validate related entities
        if (invoiceProductId) {
            const invoiceProduct = await InvoiceProduct.findByPk(invoiceProductId);
            if (!invoiceProduct) {
                return res.status(400).json({ message: `Invalid invoice product ID: ${invoiceProductId}` });
            }
        }

        if (productId) {
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(400).json({ message: `Invalid product ID: ${productId}` });
            }
        }

        let updatedStockQty = null;

        if (stockId) {
            const stock = await Stock.findByPk(stockId);
            if (!stock) {
                return res.status(400).json({ message: `Invalid stock ID: ${stockId}` });
            }

            if (returnQty !== undefined && returnQty !== returnProduct.returnQty) {
                const qtyDifference = parseFloat(returnQty) - parseFloat(returnProduct.returnQty);
                updatedStockQty = parseFloat(stock.stockQty) + qtyDifference;

                console.log("Previous Return Qty:", returnProduct.returnQty);
                console.log("New Return Qty:", returnQty);
                console.log("Stock Adjusted by:", qtyDifference);
                console.log("Updated Stock Qty:", updatedStockQty);

                await stock.update({ stockQty: updatedStockQty });
            }
        }

        await returnProduct.update({
            returnQty,
            returnAmount,
            returnItemType,
            returnNote,
            returnDate,
            invoiceProductId,
            stockId,
            returnItemId,
            productId
        });

        res.status(200).json({
            message: "Return product updated successfully",
            returnProduct,
            updatedStockQty
        });
    } catch (error) {
        console.error("Error updating return product:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

async function deleteReturnProduct(req, res) {
    try {
        const { id } = req.params;

        const returnProduct = await ReturnProduct.findByPk(id);
        if (!returnProduct) {
            return res.status(404).json({ message: `Return product not found` });
        }
        await returnProduct.destroy();

        res.status(200).json({
            message: `Return product deleted successfully`,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createReturnProduct,
    getAllReturnProducts,
    getAllReturnProductsById,
    getReturnProductsByReturnId,
    updateReturnProduct,
    deleteReturnProduct,
};

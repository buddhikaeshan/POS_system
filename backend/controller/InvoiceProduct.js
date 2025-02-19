const Invoice = require("../model/Invoice");
const Product = require("../model/Products");
const Stock = require("../model/Stock");
const InvoiceProduct = require('../model/InvoiceProduct')

const createInvoiceProduct = async (req, res) => {
  try {
    const invoiceProducts = req.body;

    // Validate input
    if (!Array.isArray(invoiceProducts) || invoiceProducts.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    const insufficientStockProducts = [];
    const newProducts = []; // products not in db

    for (const invoiceProduct of invoiceProducts) {
      const { productId, stockId, invoiceId, invoiceNo, totalAmount, invoiceQty, sendQty, deliverdQty, discount, unitAmount, invoiceProductStatus, warranty } = invoiceProduct;

      // Check product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(400).json({ message: `Invalid product ID: ${productId}` });
      }



      const invoice = await Invoice.findByPk(invoiceId);
      if (!invoice) {
        return res.status(400).json({ message: 'Invalid invoice ID' });
      }

      // Check if enough stock is available


      // Check product already exists in invoice
      const existingProduct = await InvoiceProduct.findOne({
        where: { invoiceId, productId }
      });

      // Add new products not existin datatbase
      if (!existingProduct) {
        newProducts.push(invoiceProduct);
      }
    }



    // Process new invoice products if all stock is sufficient
    const createdInvoiceProducts = [];
    for (const invoiceProduct of newProducts) {
      const { productId, stockId, invoiceId, invoiceNo, totalAmount, invoiceQty, sendQty, deliverdQty, discount, unitAmount, invoiceProductStatus, warranty } = invoiceProduct;

      if (stockId) {

        // Check stock exists
        const stock = await Stock.findByPk(stockId)
        if (stock.stockQty < invoiceQty) {
          insufficientStockProducts.push({
            productId,
            productName: product.productName,
            availableStock: stock.stockQty,
            requestedQuantity: invoiceQty
          });
        }
        // If any products have insufficient stock, return detailed error
        if (insufficientStockProducts.length > 0) {
          return res.status(400).json({
            message: 'Insufficient stock for some products',
            insufficientProducts: insufficientStockProducts
          });
        }
        // Find stock and update quantity
        const updatedStockQty = stock.stockQty - invoiceQty;
        await stock.update({ stockQty: updatedStockQty });
      }


      // Create the invoice product
      const newInvoiceProduct = await InvoiceProduct.create({
        productId,
        stockId:stockId || null,
        invoiceId,
        invoiceNo,
        totalAmount,
        invoiceQty,
        sendQty,
        deliverdQty,
        discount,
        unitAmount,
        invoiceProductStatus,
        warranty
      });

      createdInvoiceProducts.push(newInvoiceProduct);
    }

    res.status(201).json({
      message: 'Invoice products created successfully',
      invoiceProducts: createdInvoiceProducts
    });

  } catch (error) {
    console.error('Error creating invoice products:', error);
    res.status(500).json({
      message: 'Server error occurred while creating the invoice products',
      error: error.message,
    });
  }
};

// Get all Invoice Products
const getAllInvoiceProducts = async (req, res) => {
  try {
    const invoiceProduct = await InvoiceProduct.findAll({
      include: [
        { model: Invoice, as: 'invoice' },
        { model: Product, as: 'product' },
        { model: Stock, as: 'stock' },
      ]
    });
    res.status(200).json(invoiceProduct);
  } catch (error) {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};

const deleteInvoiceProductbyId = async (req, res) => {
  try {
    const { invoiceProductId } = req.params;

    const invoiceProduct = await InvoiceProduct.findByPk(invoiceProductId);
    if (!invoiceProduct) {
      return res.status(404).json({ message: 'Invoice product not found' });
    }

    await invoiceProduct.destroy();
    res.status(200).json({ message: 'Invoice product deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice product:', error);
    res.status(500).json({ message: 'Failed to delete invoice product', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoiceProducts = await InvoiceProduct.findByPk(id, {
      include: [
        { model: Product, as: 'product' },
        { model: Stock, as: 'stock' },
      ],
    });

    if (!invoiceProducts) {
      return res.status(404).json({ message: 'No invoice products found' });
    }

    res.status(200).json(invoiceProducts);
  } catch (error) {
    console.error('Error fetching invoice products:', error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
}

const getInvoiceById = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoiceProducts = await InvoiceProduct.findAll({
      where: { invoiceId },
      include: [
        { model: Product, as: 'product' },
        { model: Stock, as: 'stock' }
      ]
    });

    if (invoiceProducts.length === 0) {
      return res.status(404).json({ message: 'No invoice products found' });
    }

    res.status(200).json(invoiceProducts);
  } catch (error) {
    console.error('Error fetching invoice products:', error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
}

const getInvoiceProductsByNo = async (req, res) => {
  try {
    const { num } = req.params;

    // Find invoice products by the invoice number
    const invoiceProducts = await InvoiceProduct.findAll({
      where: { invoiceNo: num },
      include: [
        { model: Product, as: 'product' },
        { model: Stock, as: 'stock' }
      ]
    });

    if (!invoiceProducts || invoiceProducts.length === 0) {
      return res.status(404).json({ message: "Invoice products not found for the given number" });
    }

    res.status(200).json(invoiceProducts);
  } catch (error) {
    console.error('Error fetching invoice products by number:', error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};


const deleteInvoiceProduct = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoiceProducts = await InvoiceProduct.findAll({ where: { invoiceId } });

    if (invoiceProducts.length === 0) {
      return res.status(404).json({ message: `No products found for invoice ID: ${invoiceId}` });
    }

    for (const invoiceProduct of invoiceProducts) {
      const { stockId, invoiceQty } = invoiceProduct;

      const stock = await Stock.findByPk(stockId);
      if (!stock) {
        return res.status(404).json({ message: `Stock with ID ${stockId} not found` });
      }

      const updatedStockQty = stock.stockQty + invoiceQty;
      await stock.update({ stockQty: updatedStockQty });

      await invoiceProduct.destroy();
    }

    res.status(200).json({ message: `All products for invoice ID ${invoiceId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting invoice products:', error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};

const updateInvoiceProduct = async (req, res) => {
  const insufficientStockProducts = [];

  try {
    const { id } = req.params;
    const {
      totalAmount,
      invoiceQty,
      sendQty,
      deliveredQty,
      discount,
      unitAmount,
      warranty,
      stockId,
      newStockqty,
      productName
    } = req.body;

    const invoiceProduct = await InvoiceProduct.findByPk(id);
    if (!invoiceProduct) {
      return res.status(404).json({ message: 'Invoice product not found' });
    }

    if (stockId) {
      const stock = await Stock.findByPk(stockId);
      const stockDifference = newStockqty - invoiceQty;
      const updatedStockQty = stock.stockQty + stockDifference;
      if (updatedStockQty < 0) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      await stock.update({ stockQty: updatedStockQty });
      if (stockId) {

        // Check if enough stock is available
        if (stock.stockQty < invoiceQty) {
          insufficientStockProducts.push({
            productName: productName,
            availableStock: stock.stockQty,
            requestedQuantity: invoiceQty
          });
        }
        // If any products have insufficient stock, return detailed error
        if (insufficientStockProducts.length > 0) {
          return res.status(400).json({
            message: 'Insufficient stock for some products',
            insufficientProducts: insufficientStockProducts
          });
        }
      }
    }

    if (totalAmount) invoiceProduct.totalAmount = totalAmount;
    if (invoiceQty) invoiceProduct.invoiceQty = invoiceQty;
    if (sendQty) invoiceProduct.sendQty = sendQty;
    if (deliveredQty) invoiceProduct.deliveredQty = deliveredQty;
    if (discount) invoiceProduct.discount = discount;
    if (unitAmount) invoiceProduct.unitAmount = unitAmount;
    if (warranty) invoiceProduct.warranty = warranty;

    await invoiceProduct.save();

    res.status(200).json({ message: 'Invoice product updated and stock quantity adjusted', invoiceProduct });
  } catch (error) {
    console.error('Error updating invoice product:', error);
    res.status(500).json({ message: 'Error updating invoice product', error: error.message });
  }
};

const updateDeliveryNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { sendQty, deliverdQty, invoiceProductStatus } = req.body;

    const invoiceProduct = await InvoiceProduct.findByPk(id);

    if (!invoiceProduct) {
      return res.status(404).json({ message: 'Delivery note not found' });
    }

    if (typeof sendQty !== 'undefined' && sendQty < 0 && typeof deliverdQty !== 'undefined' && deliverdQty < 0) {
      return res.status(400).json({ message: 'Invalid quantity provided' });
    }

    if (typeof sendQty !== 'undefined' && typeof deliverdQty !== 'undefined') {
      invoiceProduct.sendQty = sendQty;
      invoiceProduct.deliverdQty = deliverdQty;
      invoiceProduct.invoiceProductStatus = invoiceProductStatus;
    }

    await invoiceProduct.save();

    res.status(200).json({
      message: 'Delivery note updated successfully',
      invoiceProduct
    });
  } catch (error) {
    console.error('Error updating delivery note status:', error);
    res.status(500).json({
      message: 'Error updating delivery note status',
      error: error.message
    });
  }
};

const getInvoiceProductsByStockId = async (req, res) => {
  try {
    const { stockId } = req.params;

    const invoiceProducts = await InvoiceProduct.findAll({
      where: { stockId },
      include: [
        { model: Product, as: 'product' },
        { model: Invoice, as: 'invoice' },
        { model: Stock, as: 'stock' }
      ]
    });

    if (invoiceProducts.length === 0) {
      return res.status(404).json({ message: 'No invoice products found for this stock' });
    }

    res.status(200).json(invoiceProducts);
  } catch (error) {
    console.error('Error fetching invoice products by stock ID:', error);
    res.status(500).json({
      message: 'Error retrieving invoice products',
      error: error.message
    });
  }
};

module.exports = {
  createInvoiceProduct,
  getAllInvoiceProducts,
  deleteInvoiceProductbyId,
  deleteInvoiceProduct,
  getInvoiceById,
  getInvoiceProductsByNo,
  updateInvoiceProduct,
  updateDeliveryNote,
  getInvoiceProductsByStockId,
  getById
};

/*const createInvoiceProduct = async (req, res) => {
  try {
    const invoiceProducts = req.body;

    // Validate input
    if (!Array.isArray(invoiceProducts) || invoiceProducts.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    const insufficientStockProducts = [];

    for (const invoiceProduct of invoiceProducts) {
      const { productId, stockId, invoiceId, invoiceNo, totalAmount, invoiceQty, invoiceProductStatus } = invoiceProduct;

      // Check if the product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(400).json({ message: `Invalid product ID: ${productId}` });
      }

      // Check if the stock exists
      const stock = await Stock.findByPk(stockId);
      if (!stock) {
        return res.status(400).json({ message: `Invalid stock ID: ${stockId}` });
      }

      const invoice = await Invoice.findByPk(invoiceId);
      if (!invoice) {
        return res.status(400).json({ message: 'Invalid invoice ID' });
      }

      // Check if enough stock is available
      if (stock.stockQty < invoiceQty) {
        insufficientStockProducts.push({
          productId,
          productName: product.productName,
          availableStock: stock.stockQty,
          requestedQuantity: invoiceQty
        });
      }
    }

    // If any products have insufficient stock, return detailed error
    if (insufficientStockProducts.length > 0) {
      return res.status(400).json({
        message: 'Insufficient stock for some products',
        insufficientProducts: insufficientStockProducts
      });
    }

    // Process invoice products if all stock is sufficient
    const createdInvoiceProducts = [];
    for (const invoiceProduct of invoiceProducts) {
      const { productId, stockId, invoiceId, invoiceNo, totalAmount, invoiceQty, invoiceProductStatus } = invoiceProduct;

      // Find stock and update quantity
      const stock = await Stock.findByPk(stockId);
      const updatedStockQty = stock.stockQty - invoiceQty;
      await stock.update({ stockQty: updatedStockQty });

      // Create the invoice product
      const newInvoiceProduct = await InvoiceProduct.create({
        productId,
        stockId,
        invoiceId,
        invoiceNo,
        totalAmount,
        invoiceQty,
        invoiceProductStatus,
      });

      createdInvoiceProducts.push(newInvoiceProduct);
    }

    res.status(201).json({
      message: 'Invoice products created successfully',
      invoiceProducts: createdInvoiceProducts
    });

  } catch (error) {
    console.error('Error creating invoice products:', error);
    res.status(500).json({
      message: 'Server error occurred while creating the invoice products',
      error: error.message,
    });
  }
};*/
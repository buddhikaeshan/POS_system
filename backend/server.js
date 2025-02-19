const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./dbConfig");
const path = require('path');
const multer = require('multer');
const fs = require('fs');
// const rateLimit = require("express-rate-limit");


//Controllers
const SupplierController = require("./controller/SupplerController");
const UserController = require("./controller/UserController");
const CategoryController = require("./controller/CategoryController");
const ProductController = require("./controller/ProductController");
const StockController = require("./controller/StockController");
const StockPaymentController = require("./controller/StockPaymenTController");
const StockHistoryController = require('./controller/StockHistoryController');
const InvoiceController = require("./controller/InvoiceController");
const TransactionController = require("./controller/TransactionController");
const StoreController = require("./controller/StoreController");
const ReturnController = require("./controller/ReturnController");
const ReturnProductController = require("./controller/ReturnProductController");
const ReturnStockController = require("./controller/ReturnStockController");
const ExpenseController = require("./controller/ExpensesController");
const ExpensesCatController = require("./controller/ExpensesCatController");
const ReportController = require("./controller/Reports/ReportController");
const ProductNStockController = require("./controller/Reports/ProductStockController");
const InvoiceProductController = require('./controller/InvoiceProduct');
const CustomerController = require('./controller/CustomerController');
// const DeliveryNoteController = require('./controller/DeliveryNoteController');
const CostingController = require('./controller/CostingController');
const ChequeController = require('./controller/ChequeController');
const Transaction = require("./model/Transaction");
const DueCustomerController = require("./controller/DueCustomerController");
const SupplierPaymentController = require("./controller/SupplierPaymentController");

const DueCustomer = require("./model/DueCustomer");
const DueController = require("./controller/DueController");

// const CostingController = require("./controller/CostingController");
// const CostingController = require("./controller/");

const app = express();
const PORT = process.env.PORT;

// Rate Limiting Middleware
/*const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});*/

// Apply the rate limiter to all requests
// app.use(limiter);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads', 'purchase-orders')));


//user routes
app.post("/user", UserController.createUser);
app.get("/users", UserController.getAllUsers);
app.get("/user/:id", UserController.getUserById);
app.get('/user/name/:name', UserController.getUserByName);
app.put("/user/:id", UserController.updateUser);
app.delete("/user/:id", UserController.deleteUser);
app.post("/userLogin", UserController.userLogin);

//supplier routes
app.post("/supplier", SupplierController.createSupplier);
app.get("/suppliers", SupplierController.getAllSuppliers);
app.get("/supplier/:id", SupplierController.getSupplierById);
app.get("/supplier/supplierName/:name", SupplierController.getSupplierByName);
app.put("/supplier/:id", SupplierController.updateSupplier);
app.delete("/supplier/:id", SupplierController.deleteSupplier);
app.get('/suppliers/suggestions', SupplierController.getSupplierSuggestions);

//supplierPayment routes
app.post("/supplierPayment", SupplierPaymentController.createSupplierPayment);
app.get("/supplierPayments", SupplierPaymentController.getAllSupplierPayments);
app.get("/supplerPayment/:stockPaymentId", SupplierPaymentController.getSupplierPaymentByStockPaymentId);

//category routes
app.post("/category", CategoryController.createCategory);
app.get("/categories", CategoryController.getAllCategories);
app.get("/category/:id", CategoryController.getCategoryById);
app.put("/category/:id", CategoryController.updateCategory);
app.delete("/category/:id", CategoryController.deleteCustomer);
app.get("/category/name/:name", CategoryController.getNameCategories);

//customer routes
app.post('/customer', CustomerController.createCustomer);
app.get('/customers', CustomerController.getAllCustomers);
app.get('/customer/:id', CustomerController.getCustomerById);
app.put('/customer/:id', CustomerController.updateCustomer);
app.delete('/customer/:id', CustomerController.deleteCustomer);
app.get("/customer/cusCode/:code", CustomerController.getCustomerByCode);
app.get("/customer/cusName/:name", CustomerController.getCustomerByName);
app.get('/customers/suggestions', CustomerController.getCustomerSuggestions);
app.get('/customers/suggestion', CustomerController.getCustomerSuggestion);

//product routes
app.post("/product", ProductController.createProduct);
app.get("/products", ProductController.getAllProducts);
app.get("/product/:id", ProductController.getProductById);
app.put("/product/:id", ProductController.updateProduct);
app.delete("/product/:id", ProductController.deleteProduct);
app.get("/product/productName/:name", ProductController.getProductByName);
app.get('/product/codeOrName/:value', ProductController.getProductByCodeOrName);
app.get('/products/suggestions', ProductController.getProductSuggestions);
app.get('/product/image/:productCode', ProductController.getProductImageByCode);

//stock routes
app.post("/stock", StockController.createStock);
app.get("/stocks", StockController.getAllStocks);
app.get("/stock/:id", StockController.getStockById);
app.get('/stock/product/:products_productId', StockController.getStockIdUsingProductId);
app.put("/stock/:id", StockController.updateStock);
app.delete("/stock/:id", StockController.deleteStock);
app.get('/stock/supplier/:supplier_supplierId', StockController.getStockIdUsingSupplierId);
app.get('/stocks/suggestions', StockController.getStockSuggestions);
app.get("/stock/stockName/:name", StockController.getStockByName);

//stockPayment routes
app.post("/stockPayment", StockPaymentController.createStockPayment);
app.get("/stockPayments", StockPaymentController.getAllStockPayments);
app.get("/stockPayment/:id", StockPaymentController.getStockPaymentById);
app.put("/stockPayment/:id", StockPaymentController.updateStockPayment);
app.get('/stockPayments/dueCount', StockPaymentController.countDuePayments);
app.get('/stockPayments/totalDues', StockPaymentController.totalDues);
app.get('/stockPayments/:supplierId', StockPaymentController.getStockPaymentBySupplierId);
app.get('/stockPayments/duePayments/:supplierId', StockPaymentController.countDuePaymentsBySupplier);
app.get('/stockPayments/totalDues/:supplierId', StockPaymentController.totalDuesBySupplier);
app.get('/stockPayment/stock/:stockId', StockPaymentController.getStockPaymentByStockId);

//cheque routes
app.post("/cheque", ChequeController.addCheque);
app.get("/cheques", ChequeController.getAllCheques);
app.get("/cheque/:id", ChequeController.getChequeById);
app.put("/cheque/:id", ChequeController.updateCheque);
app.get("/countCheques", ChequeController.countPendingCheques);
app.get("/clearedChequeTotal", ChequeController.getClearedChequeTotal);
app.get('/pendingChequeTotal', ChequeController.getPendingChequeTotal);
app.get('/cheques/supplier/:supplierId', ChequeController.getChequesBySupplierId);
app.get('/cheques/pendingTotal/:supplierId', ChequeController.getPendingChequeTotalBySupplier)

//Stock History routes
app.get('/stockHistory', StockHistoryController.getAllStockHistory);

//invoice routes
app.post("/invoice", InvoiceController.createInvoice);
app.get("/invoices", InvoiceController.getAllInvoice);
app.get("/invoice/:id", InvoiceController.getInvoiceById);
app.put("/invoice/:id", InvoiceController.updateInvoice);
app.put("/deliveryTime/:id", InvoiceController.updateDeliveryTime);
app.delete("/invoice/:id", InvoiceController.deleteInvoice);
app.get('/invoice/invoiceNo/:num', InvoiceController.getInvoiceByNo);
app.get('/next-invoice-number', InvoiceController.getLastInvoiceNumber);
app.post('/invoice/:id', InvoiceController.addImage);
app.get('/invoice/purchaseNo/:purchaseNo', InvoiceController.checkPurchaseNoExists)
app.put('/updatePerforma/:invoiceId', InvoiceController.updatePerforma)
app.put('/updateDraft/:invoiceId', InvoiceController.updateInvoiceDraft)

//invoiceProduct Route
app.post('/invoiceProduct', InvoiceProductController.createInvoiceProduct);
app.get('/invoiceProducts', InvoiceProductController.getAllInvoiceProducts);
app.get('/invoiceProducts/:invoiceId', InvoiceProductController.getInvoiceById);
app.delete('/invoiceProducts/:invoiceProductId', InvoiceProductController.deleteInvoiceProductbyId);
app.get('/invoiceProduct/:num', InvoiceProductController.getInvoiceProductsByNo);
app.put('/invoiceProducts/:id', InvoiceProductController.updateInvoiceProduct);
app.put('/updateDeliveryNote/:id', InvoiceProductController.updateDeliveryNote);
app.get('/invoiceProduct/stock/:stockId', InvoiceProductController.getInvoiceProductsByStockId);
app.get('/invoiceProductById/:id', InvoiceProductController.getById);

//due Customer Route
app.post('/duecustomer', DueCustomerController.createDueCustomer);
app.get('/duecustomers', DueCustomerController.getAllDueCustomers);
app.get('/duecustomer/:id', DueCustomerController.getDueCustomerById);
app.put('/duecustomer/:id', DueCustomerController.updateDueCustomer);
app.delete('/duecustomer/:id', DueCustomerController.deleteDueCustomer);

app.post("/due/pay/:invoiceId", DueController.payDueAmount);

//transaction routes
app.post("/transaction", TransactionController.createTransaction);
app.put("/transactions/invoiceId/:invoiceId", TransactionController.updateTransaction);
app.get("/transactions", TransactionController.getAllTransactions);
app.get("/transactions/:id", TransactionController.getTransactionById);
app.get('/transaction/invoice/:invoiceId', TransactionController.getTransactionsByInvoiceId);
app.delete('/transactions/invoice/:invoice_invoiceId', TransactionController.deleteByInvoiceId);
app.put('/transaction/:id', TransactionController.editTransaction);

// Get transactions for a specific customer
app.get('/transactions/customer/:cusId', TransactionController.getTransactionsByCustomerId);

// Get invoice details for a specific customer
app.get('/duecustomer/invoice/:cusId', DueController.getDueCustomerByCusId);

//store routes
app.post("/store", StoreController.createStore);
app.get("/stores", StoreController.getAllStores);
app.get("/store/:id", StoreController.getStoreById);
app.put("/store/:id", StoreController.updateStore);
app.delete("/store/:id", StoreController.deleteStore);

//return routes
app.post("/return", ReturnController.createReturn);
app.get("/returns", ReturnController.getAllReturns);
app.get("/return/:id", ReturnController.getReturnById);
app.put('/return/:id', ReturnController.updateReturn);
app.delete('/return/:id', ReturnController.deleteReturns);

//return stock routes
app.post("/stocksReturn", ReturnStockController.createReturnStock);
app.get("/stocksReturns", ReturnStockController.getAllReturnStocks);
app.get('/stocksReturn/:returnStockId', ReturnStockController.getReturnStockById);
app.get('/stocksReturn/stock/:stockId', ReturnStockController.getStockReturnsByStockId);
app.put('/stocksReturn/:id', ReturnStockController.updateReturnStock);
app.delete('/stocksReturn/:id', ReturnStockController.deleteStockReturns);

//returnProduct routes
app.post('/returnProduct', ReturnProductController.createReturnProduct);
app.get('/returnProducts', ReturnProductController.getAllReturnProducts);
app.get('/returnProduct/:id', ReturnProductController.getAllReturnProductsById);
app.get("/returnProduct/return/:returnItemId", ReturnProductController.getReturnProductsByReturnId);
app.put('/returnProduct/:id', ReturnProductController.updateReturnProduct);
app.delete('/returnProduct/:id', ReturnProductController.deleteReturnProduct);

//expenses routes
app.post("/expense", ExpenseController.createExpense);
app.get("/expenses", ExpenseController.getAllExpenses);
app.get("/expense/:id", ExpenseController.getExpenseById);
app.put("/expense/:id", ExpenseController.updateExpense);
app.delete("/expense/:id", ExpenseController.deleteExpense);

//expenses category routes
app.post("/expensesCat", ExpensesCatController.createExpensesCategory);
app.get("/expensesCats", ExpensesCatController.getAllExpensesCats);
app.get("/expensesCat/:id", ExpensesCatController.getExpensesCatById);
app.put("/expensesCat/:id", ExpensesCatController.updateExpensesCat);
app.delete("/expensesCat/:id", ExpensesCatController.deleteExpensesCat);

//get reports
app.get("/getReports", ReportController.getReports);
app.get("/productStock", ProductNStockController.getStockReports);

// //Costing routes
app.post("/costingDraft", CostingController.createDraft);
app.post("/costing", CostingController.createCosting);
app.get("/costings", CostingController.getAllCostings);
app.get("/costing/:id", CostingController.getCostingById);
app.get("/costings/:id", CostingController.getCostingById);
app.put("/costing/:id", CostingController.updateCosting);
app.delete("/costing/:id", CostingController.deleteCosting);
app.put("/costings/:id", CostingController.updateAllCosting);
app.put('/costings/:id/prepared-by', CostingController.updatePreparedBy);
app.put('/costings/:headerId/details/:detailId', CostingController.updateCostingDetail);
app.delete('/costings/:headerId/details/:detailId', CostingController.deleteCostingDetail);

//Delivery note Route
// app.post('/deliveryNote', DeliveryNoteController.createDeliveryNote);
// app.get('/deliveryNotes', DeliveryNoteController.getAllDeliveryNote);
// app.get('/deliveryNotes/:invoiceId', DeliveryNoteController.getDeliveryNoteById)
// app.delete('/deliveryNote/:invoiceId', DeliveryNoteController.deleteDeliveryNote)
// app.get('/deliveryNote/:num', DeliveryNoteController.getDeliveryNoteByNo);
// app.put('/deliveryNotes/:id', DeliveryNoteController.updateDeliveryNoteStatus);
// app.put('/deliveryNotesStatus/:id', DeliveryNoteController.updateStatus);
// app.put('/deliveryNotesQty/:id', DeliveryNoteController.updateDeliverytQty);



app.get('/download/invoice/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', 'invoice', filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath, filename, (err) => {
            if (err) {
                res.status(500).json({ error: "Error downloading the file" });
            }
        });
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "build", "index.html"));
// });

sequelize
    .sync()
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((err) => {
        console.error("Error synchronizing database:", err);
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// const Transaction = require("../model/Transaction");
// const Invoice = require("../model/Invoice");
// const Customer = require("../model/Customer");
// const DueCustomer = require("../model/DueCustomer");

// const payDueAmount = async (req, res) => {
//     try {
//         const { invoiceId } = req.params;
//         const { payingAmount, cusId } = req.body;

//         if (!invoiceId || !payingAmount || !cusId) {
//             return res.status(400).json({ error: "Invoice ID, paying amount, and customer ID are required." });
//         }

//         const invoice = await Invoice.findByPk(invoiceId);
//         if (!invoice) {
//             return res.status(404).json({ message: 'Invoice not found' });
//         }

//         const transaction = await Transaction.findOne({ where: { invoice_invoiceId: invoiceId } });
//         if (!transaction) {
//             return res.status(404).json({ message: 'Transaction for this invoice ID not found' });
//         }

//         if (payingAmount > transaction.due) {
//             return res.status(400).json({ error: "Paying amount cannot be greater than due amount." });
//         }

//         const updatedPaid = transaction.paid + parseFloat(payingAmount);
//         const updatedDue = transaction.due - parseFloat(payingAmount);

//         // Update the transaction table
//         await transaction.update({
//             paid: updatedPaid,
//             due: updatedDue,
//         });

//         // Insert into the dueCustomer table to track payment history
//         await DueCustomer.create({
//             invoiceId: invoiceId, // Pass the invoice ID (can be null if not available)
//             transactionId: transaction.transactionId, // Pass the transaction ID
//             cusId: cusId, // Pass the customer ID
//             dueDate: new Date(), // Current date and time
//             dueAmount: transaction.due, // Remaining due amount before this payment
//             paidAmount: payingAmount, // Amount paid in this transaction
//             status: 'paid', // Status can be updated as needed
//         });

//         res.status(200).json({ message: 'Payment successful', transaction });
//     } catch (error) {
//         console.error('Error paying due amount:', error);
//         res.status(500).json({ message: 'An error occurred while processing the payment.' });
//     }
// };



// const payDueAmount = async (req, res) => {
//     try {
//       const { invoiceId } = req.params;
//       const { payingAmount, cusId, payType } = req.body;
  
//       if (!invoiceId || !payingAmount || !cusId || !payType) {
//         return res.status(400).json({ error: "Invoice ID, paying amount, customer ID, and payment type are required." });
//       }
  
//       const invoice = await Invoice.findByPk(invoiceId);
//       if (!invoice) {
//         return res.status(404).json({ message: 'Invoice not found' });
//       }
  
//       const transaction = await Transaction.findOne({ where: { invoice_invoiceId: invoiceId } });
//       if (!transaction) {
//         return res.status(404).json({ message: 'Transaction for this invoice ID not found' });
//       }
  
//       if (payingAmount > transaction.due) {
//         return res.status(400).json({ error: "Paying amount cannot be greater than due amount." });
//       }
  
//       const updatedPaid = transaction.paid + parseFloat(payingAmount);
//       const updatedDue = transaction.due - parseFloat(payingAmount);
  
//       // Update the transaction table
//       await transaction.update({
//         paid: updatedPaid,
//         due: updatedDue,
//       });
  
//       // Insert into the dueCustomer table to track payment history
//       await DueCustomer.create({
//         invoiceId: invoiceId,
//         transactionId: transaction.transactionId,
//         cusId: cusId,
//         dueDate: new Date(),
//         dueAmount: transaction.due,
//         paidAmount: payingAmount,
//         status: 'paid',
//         payType: payType, // Save payment type
//       });
  
//       res.status(200).json({ message: 'Payment successful', transaction });
//     } catch (error) {
//       console.error('Error paying due amount:', error);
//       res.status(500).json({ message: 'An error occurred while processing the payment.' });
//     }
//   };


const Transaction = require("../model/Transaction");
const Invoice = require("../model/Invoice");
const Customer = require("../model/Customer");
const DueCustomer = require("../model/DueCustomer");


const payDueAmount = async (req, res) => {
    try {
      const { invoiceId } = req.params;
      const { payingAmount, cusId, payType, datedCheque, chequeDetail } = req.body;
  
      if (!invoiceId || !payingAmount || !cusId || !payType) {
        return res.status(400).json({ error: "Invoice ID, paying amount, customer ID, and payment type are required." });
      }
  
      // Additional validation for cheque payments
      if (payType === 'cheque' && (!datedCheque || !chequeDetail)) {
        return res.status(400).json({ error: "Dated cheque and cheque detail are required for cheque payments." });
      }
  
      const invoice = await Invoice.findByPk(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
  
      const transaction = await Transaction.findOne({ where: { invoice_invoiceId: invoiceId } });
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction for this invoice ID not found' });
      }
  
      if (payingAmount > transaction.due) {
        return res.status(400).json({ error: "Paying amount cannot be greater than due amount." });
      }
  
      const updatedPaid = transaction.paid + parseFloat(payingAmount);
      const updatedDue = transaction.due - parseFloat(payingAmount);
  
      // Update the transaction table
      await transaction.update({
        paid: updatedPaid,
        due: updatedDue,
      });
  
      // Insert into the dueCustomer table to track payment history
      await DueCustomer.create({
        invoiceId: invoiceId,
        transactionId: transaction.transactionId,
        cusId: cusId,
        dueDate: new Date(),
        dueAmount: transaction.due,
        paidAmount: payingAmount,
        status: 'paid',
        payType: payType,
        datedCheque: payType === 'cheque' ? datedCheque : null, // Save cheque details if payment type is cheque
        chequeDetail: payType === 'cheque' ? chequeDetail : null,
      });
  
      res.status(200).json({ message: 'Payment successful', transaction });
    } catch (error) {
      console.error('Error paying due amount:', error);
      res.status(500).json({ message: 'An error occurred while processing the payment.' });
    }
  };

  const getDueCustomerByCusId = async (req, res) => {
    try {
        const { cusId } = req.params;
        const dueCustomers = await DueCustomer.findAll({
            where: { cusId },
            include: [
                { model: Invoice, as: 'invoice' },
                { model: Transaction, as: 'transaction' },
            ],
        });
        res.status(200).json(dueCustomers);
    } catch (error) {
        console.error('Error fetching due customers:', error);
        res.status(500).json({ message: 'An error occurred while fetching due customers.' });
    }
};

module.exports = {
    payDueAmount,    
    getDueCustomerByCusId,
};
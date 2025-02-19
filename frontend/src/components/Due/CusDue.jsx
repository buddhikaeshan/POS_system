// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import config from '../../config'; // Import your config file
// import PaymentModal from './PaymentModal'; // Import the PaymentModal component

// function CusDue() {
//     const { cusId } = useParams();
//     const Navigate = useNavigate();
//     const [customer, setCustomer] = useState(null);
//     const [paidInvoices, setPaidInvoices] = useState(0);
//     const [paidCheques, setPaidCheques] = useState(0);
//     const [totalDebts, setTotalDebts] = useState(0);
//     const [invoiceDetails, setInvoiceDetails] = useState([]);
//     const [transactionDetails, setTransactionDetails] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [unpaidInvoices, setUnpaidInvoices] = useState(0);
//     const [invoiceNumbers, setInvoiceNumbers] = useState({});
//     const [successMessage, setSuccessMessage] = useState('');
// const [errorMessage, setErrorMessage] = useState('');


//     const [showColumns, setShowColumns] = useState({
//         date: true,
//         invoiceNo: true,
//         chequeDetails: true,
//         chequeDate: false,
//         datedCheque: false,
//         debit: true,
//         credit: true,
//         balance: true,
//         totalDue: false,
//         paid: true
//     });
//     const [checkedRows, setCheckedRows] = useState({}); // State to track checked rows
//     const [showPaymentModal, setShowPaymentModal] = useState(false); // State to control modal visibility
//     const [selectedInvoices, setSelectedInvoices] = useState([]); // State to store selected invoices

//     const columnLabels = {
//         date: "Date (Invoice Created)",
//         invoiceNo: "Invoice No",
//         chequeDetails: "Cheque Details",
//         chequeDate: "Cheque Given Date",
//         datedCheque: "Dated Cheque",
//         debit: "Debit (Rs)",
//         credit: "Credit (Rs)",
//         balance: "Balance (Rs)",
//         totalDue: "Total Due",
//         paid: "Paid"
//     };

//     const toggleColumn = (column) => {
//         setShowColumns(prevState => ({
//             ...prevState,
//             [column]: !prevState[column]
//         }));
//     };

//     // Handle checkbox change
//     const handleCheckboxChange = (index) => {
//         setCheckedRows(prevState => ({
//             ...prevState,
//             [index]: !prevState[index]
//         }));
//     };

//     // Check if any checkbox is checked
//     const isAnyCheckboxChecked = Object.values(checkedRows).some(checked => checked);

//     // Open payment modal
//     const handleMakePayment = () => {
//         const selected = combinedData.filter((row, index) => checkedRows[index]);
//         setSelectedInvoices(selected);
//         setShowPaymentModal(true);
//     };

//     // Close payment modal
//     const handleCloseModal = () => {
//         setShowPaymentModal(false);
//     };

//     // Handle payment submission
//     // const handlePaymentSubmit = async (payments, chequeDetail) => {
//     //     try {
//     //         for (const payment of payments) {
//     //             const { invoiceNo, payingAmount } = payment;
//     //             const invoiceId = Object.keys(invoiceNumbers).find(
//     //                 key => invoiceNumbers[key] === invoiceNo
//     //             );

//     //             if (!invoiceId) {
//     //                 console.error('Invoice ID not found for invoice number:', invoiceNo);
//     //                 continue;
//     //             }

//     //             // Call the API to pay the due amount
//     //             await axios.post(`${config.BASE_URL}/due/pay/${invoiceId}`, {
//     //                 payingAmount,
//     //                 cusId,
//     //                 payType: 'cheque', // Assuming cheque payment
//     //                 datedCheque: new Date().toISOString(), // Use current date for cheque
//     //                 chequeDetail
//     //             });
//     //         }

//     //         // Refresh the page or update state
//     //         window.location.reload(); // Or update state to reflect changes
//     //     } catch (error) {
//     //         console.error('Error processing payments:', error);
//     //     }
//     // };

//     // const handlePaymentSubmit = async (paymentData) => {
//     //     try {
//     //         for (const payment of paymentData.payments) {
//     //             const { invoiceNo, payingAmount } = payment;
//     //             const invoiceId = Object.keys(invoiceNumbers).find(
//     //                 key => invoiceNumbers[key] === invoiceNo
//     //             );

//     //             if (!invoiceId) {
//     //                 console.error('Invoice ID not found for invoice number:', invoiceNo);
//     //                 continue;
//     //             }

//     //             // Call the API to pay the due amount
//     //             await axios.post(`${config.BASE_URL}/due/pay/${invoiceId}`, {
//     //                 payingAmount,
//     //                 cusId,
//     //                 payType: paymentData.paymentType, // Use the payment type from the modal
//     //                 datedCheque: paymentData.datedCheque, // Use the datedCheque from the modal
//     //                 chequeDetail: paymentData.chequeDetail // Use the chequeDetail from the modal
//     //             });
//     //         }

//     //         // Refresh the page or update state
//     //         window.location.reload(); // Or update state to reflect changes
//     //     } catch (error) {
//     //         console.error('Error processing payments:', error);
//     //     }
//     // };

//     const handlePaymentSubmit = async (paymentData) => {
//         try {
//             for (const payment of paymentData.payments) {
//                 const { invoiceNo, payingAmount } = payment;
//                 const invoiceId = Object.keys(invoiceNumbers).find(
//                     key => invoiceNumbers[key] === invoiceNo
//                 );

//                 if (!invoiceId) {
//                     throw new Error('Invoice ID not found for invoice number: ' + invoiceNo);
//                 }

//                 // Call the API to pay the due amount
//                 await axios.post(`${config.BASE_URL}/due/pay/${invoiceId}`, {
//                     payingAmount,
//                     cusId,
//                     payType: paymentData.paymentType,
//                     datedCheque: paymentData.datedCheque,
//                     chequeDetail: paymentData.chequeDetail
//                 });
//             }

//             // Update local state for each modified transaction
//             const updatedTransactionDetails = transactionDetails.map(transaction => {
//                 const payment = paymentData.payments.find(
//                     p => invoiceNumbers[transaction.invoice_invoiceId] === p.invoiceNo
//                 );

//                 if (payment) {
//                     return {
//                         ...transaction,
//                         due: transaction.due - parseFloat(payment.payingAmount),
//                         // Add payment details if needed
//                         paymentType: paymentData.paymentType,
//                         chequeDetail: paymentData.chequeDetail,
//                         datedCheque: paymentData.datedCheque
//                     };
//                 }
//                 return transaction;
//             });

//             setTransactionDetails(updatedTransactionDetails);
//             setSuccessMessage('Payment processed successfully!');
//             setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds

//             // Reset selected rows
//             setCheckedRows({});
//             setShowPaymentModal(false);

//             // Update other relevant states
//             const newTotalDebt = updatedTransactionDetails.reduce((sum, t) => sum + t.due, 0);
//             setTotalDebts(newTotalDebt);

//             const unpaidTransactions = updatedTransactionDetails.filter(t => t.due > 0);
//             const uniqueUnpaidInvoices = [...new Set(unpaidTransactions.map(t => t.invoice_invoiceId))];
//             setUnpaidInvoices(uniqueUnpaidInvoices.length);

//         } catch (error) {
//             console.error('Error processing payments:', error);
//             setErrorMessage('Failed to process payment: ' + error.message);
//             setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 3 seconds
//         }
//     };

//     // Fetch customer details
//     useEffect(() => {
//         axios.get(`${config.BASE_URL}/customer/${cusId}`)
//             .then(response => {
//                 setCustomer(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching customer details:', error);
//                 setError('Failed to fetch customer details');
//             });
//     }, [cusId]);

//     // Fetch due customers and calculate paid invoices and cheques
//     useEffect(() => {
//         axios.get(`${config.BASE_URL}/duecustomers`)
//             .then(response => {
//                 const dueCustomers = response.data.filter(dc => dc.cusId == cusId);
//                 setPaidInvoices(dueCustomers.length);
//                 setPaidCheques(dueCustomers.filter(dc => dc.payType === 'cheque').length);
//             })
//             .catch(error => {
//                 console.error('Error fetching due customers:', error);
//                 setError('Failed to fetch due customers');
//             });
//     }, [cusId]);

//     // Fetch total debts, transaction details, and invoice numbers (filtered by cusId)
//     useEffect(() => {
//         axios.get(`${config.BASE_URL}/transactions/customer/${cusId}`)
//             .then(response => {
//                 const transactions = response.data;
//                 const totalDebt = transactions.reduce((sum, t) => sum + t.due, 0);
//                 setTotalDebts(totalDebt);
//                 setTransactionDetails(transactions);

//                 // Calculate unpaid invoices (unique invoice_invoiceId where due > 0)
//                 const unpaidTransactions = transactions.filter(t => t.due > 0);
//                 const uniqueUnpaidInvoices = [...new Set(unpaidTransactions.map(t => t.invoice_invoiceId))];
//                 setUnpaidInvoices(uniqueUnpaidInvoices.length);

//                 // Fetch invoice numbers for each transaction
//                 const fetchInvoiceNumbers = async () => {
//                     const invoiceNumbersMap = {};
//                     for (const transaction of transactions) {
//                         try {
//                             const invoiceResponse = await axios.get(`${config.BASE_URL}/invoice/${transaction.invoice_invoiceId}`);
//                             invoiceNumbersMap[transaction.invoice_invoiceId] = invoiceResponse.data.invoiceNo;
//                         } catch (error) {
//                             console.error('Error fetching invoice details:', error);
//                             invoiceNumbersMap[transaction.invoice_invoiceId] = 'N/A'; // Fallback if invoice fetch fails
//                         }
//                     }
//                     setInvoiceNumbers(invoiceNumbersMap);
//                 };

//                 fetchInvoiceNumbers();
//             })
//             .catch(error => {
//                 console.error('Error fetching transactions:', error);
//                 setError('Failed to fetch transactions');
//             });
//     }, [cusId]);

//     // Fetch invoice details (filtered by cusId)
//     useEffect(() => {
//         axios.get(`${config.BASE_URL}/duecustomer/invoice/${cusId}`)
//             .then(response => {
//                 setInvoiceDetails(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching invoice details:', error);
//                 setError('Failed to fetch invoice details');
//             })
//             .finally(() => {
//                 setIsLoading(false);
//             });
//     }, [cusId]);

//     // Combine transactionDetails and invoiceDetails into a single dataset
//     const combinedData = transactionDetails.map(transaction => {
//         const payment = invoiceDetails.find(inv => inv.invoiceId === transaction.invoice_invoiceId);

//         // Use OgDue from the transaction table for Debit
//         const debitAmount = transaction.OgDue; // Updated to use OgDue

//         // Convert Dated Cheque to date format
//         const datedChequeDate = payment?.datedCheque ? new Date(payment.datedCheque) : null;
//         const today = new Date();

//         let daysLeftText = "-";
//         let daysLeftColor = "black";

//         if (datedChequeDate) {
//             const timeDiff = datedChequeDate - today;
//             const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

//             if (daysLeft > 0) {
//                 daysLeftText = `${daysLeft} days left`;
//                 daysLeftColor = "green";
//             } else {
//                 daysLeftText = "Overdue";
//                 daysLeftColor = "red";
//             }
//         }

//         return {
//             invoiceNo: invoiceNumbers[transaction.invoice_invoiceId] || 'N/A',
//             chequeDetails: payment?.chequeDetail || 'N/A',
//             soldDate: new Date(transaction.dateTime).toLocaleDateString(),
//             chequeGivenDate: payment ? new Date(payment.dueDate).toLocaleDateString() : '',
//             datedCheque: payment?.datedCheque ? new Date(payment.datedCheque).toLocaleDateString() : '',
//             paymentType: payment?.payType || '',
//             debit: debitAmount, // Updated to use OgDue
//             totalDue: transaction.due,
//             paid: payment ? payment.paidAmount : 0,
//             status: transaction.due > 0 ? 'No' : 'Yes',
//             daysLeftText,
//             daysLeftColor
//         };
//     });

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className="container-fluid my-4">
//             <h3 className="text-primary mb-4">Due Details for Customer: {customer?.cusName}</h3>

//             {successMessage && (
//         <div className="alert alert-success alert-dismissible fade show" role="alert">
//             {successMessage}
//             <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
//         </div>
//     )}

//     {/* Error Message */}
//     {errorMessage && (
//         <div className="alert alert-danger alert-dismissible fade show" role="alert">
//             {errorMessage}
//             <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
//         </div>
//     )}

//             <div className="row g-4">
//                 {/* Left Section: Customer Details */}
//                 <div className="col-lg-7">
//                     {/* Customer Name */}
//                     <div className="form-group row mb-3">
//                         <label className="col-sm-3 col-form-label">Customer Name:</label>
//                         <div className="col-sm-9">
//                             <input type="text" className="form-control" value={customer?.cusName || ''} readOnly />
//                         </div>
//                     </div>

//                     {/* Customer Company */}
//                     <div className="form-group row mb-3">
//                         <label className="col-sm-3 col-form-label">Customer Company:</label>
//                         <div className="col-sm-9">
//                             <input type="text" className="form-control" value={customer?.cusOffice || ''} readOnly />
//                         </div>
//                     </div>

//                     {/* No. of unpaid invoices */}
//                     <div className="form-group row mb-3">
//                         <label className="col-sm-3 col-form-label">No. of unpaid invoices:</label>
//                         <div className="col-sm-9">
//                             <input type="number" className="form-control" value={unpaidInvoices} readOnly />
//                         </div>
//                     </div>

//                     {/* Total Due of this customer */}
//                     <div className="form-group row mb-3">
//                         <label className="col-sm-3 col-form-label">Total Due of this customer:</label>
//                         <div className="col-sm-9">
//                             <input type="text" className="form-control" value={totalDebts} readOnly />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Section: Print Options */}
//                 <div className="col-lg-5">
//                     <h2 className="text-secondary mb-3">Print</h2>
//                     <div className="form-check mb-2">
//                         <button
//                             className="btn btn-primary"
//                             onClick={() => Navigate(`/dueinvoice/${cusId}`)}
//                         >
//                             View Paid Invoices
//                         </button>
//                     </div>
//                     <div className="form-check mb-2">
//                         <button
//                             className="btn btn-primary"
//                             onClick={() => Navigate(`/unpaidinvoice/${cusId}`)}
//                         >
//                             View Unpaid Invoices
//                         </button>
//                     </div>
//                     <div className="mb-4">
//                         <label htmlFor="date" className="form-label">Date:</label>
//                         <input type="date" id="date" className="form-control" />
//                     </div>
//                 </div>
//             </div>



//             <div className="d-flex justify-content-end mb-3">
//                 {/* Make Payment Button (Conditional Rendering) */}
//             {isAnyCheckboxChecked && (
//                 <div className="d-flex justify-content-start mb-3">
//                     <button className="btn btn-success" onClick={handleMakePayment}>
//                         Make a Bulk Payment
//                     </button>
//                 </div>
//             )}
//                 <div className="dropdown">
//                     <button
//                         className="btn btn-secondary dropdown-toggle"
//                         type="button"
//                         id="columnToggleDropdown"
//                         data-bs-toggle="dropdown"
//                         aria-expanded="false"
//                     >
//                         Toggle Columns
//                     </button>
//                     <ul className="dropdown-menu dropdown-menu-end p-3" aria-labelledby="columnToggleDropdown">
//                         {Object.keys(showColumns).map((colKey) => (
//                             <li key={colKey} className="form-check">
//                                 <input
//                                     type="checkbox"
//                                     className="form-check-input"
//                                     id={colKey}
//                                     checked={showColumns[colKey]}
//                                     onChange={() => toggleColumn(colKey)}
//                                 />
//                                 <label className="form-check-label ms-2" htmlFor={colKey}>
//                                     {columnLabels[colKey]}
//                                 </label>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>

//             <table className="table table-bordered">
//                 <thead className="table-light">
//                     <tr>
//                         {showColumns.date && <th>Date (Invoice Created)</th>}
//                         {showColumns.invoiceNo && <th>Invoice No</th>}
//                         {showColumns.chequeDetails && <th>Cheque Details</th>}
//                         {showColumns.chequeDate && <th>Cheque Given Date</th>}
//                         {showColumns.datedCheque && <th>Dated Cheque</th>}
//                         <th>Days Left</th>
//                         {showColumns.debit && <th>Debit (Rs)</th>}
//                         {showColumns.credit && <th>Credit (Rs)</th>}
//                         {showColumns.balance && <th>Balance (Rs)</th>}
//                         {showColumns.totalDue && <th>Total Due</th>}
//                         {showColumns.paid && <th>Paid</th>}
//                         <th>Paid Yes or No</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {combinedData.map((row, index) => {
//                         const invoiceDate = new Date(row.soldDate);
//                         const today = new Date();
//                         const timeDiff = today - invoiceDate;
//                         const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
//                         const isRowRed = daysDiff >= 30 && row.status === 'No';

//                         return (
//                             <tr
//                                 key={index}
//                                 style={{
//                                     backgroundColor: isRowRed ? '#ffcccc' : 'inherit'
//                                 }}
//                             >
//                                 {showColumns.date && <td>{row.soldDate}</td>}
//                                 {showColumns.invoiceNo && <td>{row.invoiceNo}</td>}
//                                 {showColumns.chequeDetails && <td>{row.chequeDetails}</td>}
//                                 {showColumns.chequeDate && <td>{row.chequeGivenDate}</td>}
//                                 {showColumns.datedCheque && <td>{row.datedCheque}</td>}
//                                 <td style={{ color: row.daysLeftColor, fontWeight: "bold" }}>{row.daysLeftText}</td>
//                                 {showColumns.debit && <td>{row.debit}</td>}
//                                 {showColumns.credit && <td>{/* Add Credit Value Here */}</td>}
//                                 {showColumns.balance && <td>{/* Add Balance Value Here */}</td>}
//                                 {showColumns.totalDue && <td>{row.totalDue}</td>}
//                                 {showColumns.paid && <td>{row.paid}</td>}
//                                 {/* <td>
//                                     <span style={{ color: row.totalDue > 0 ? 'red' : 'green', fontWeight: row.totalDue === 0 ? 'bold' : 'normal' }}>
//                                         {row.status}
//                                     </span>
//                                     <input
//                                         type="checkbox"
//                                         className="form-check-input ms-2"
//                                         checked={checkedRows[index] || false}
//                                         onChange={() => handleCheckboxChange(index)}
//                                     />
//                                 </td> */}
//                                 <td>
//     <span style={{ color: row.totalDue > 0 ? 'red' : 'green', fontWeight: row.totalDue === 0 ? 'bold' : 'normal' }}>
//         {row.status}
//     </span>
//     {/* Only show checkbox if status is 'No' (unpaid) */}
//     {row.status === 'No' && (
//         <input
//             type="checkbox"
//             className="form-check-input ms-2"
//             checked={checkedRows[index] || false}
//             onChange={() => handleCheckboxChange(index)}
//         />
//     )}
// </td>
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>

//             {/* Payment Modal */}
//             {showPaymentModal && (
//                 <PaymentModal
//                     selectedInvoices={selectedInvoices}
//                     onClose={handleCloseModal}
//                     onSubmit={handlePaymentSubmit}
//                 />
//             )}
//         </div>
//     );
// }

// export default CusDue;




//---------------------------------------------------------------------------------------------------------------


// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import config from '../../config'; // Import your config file
// import PaymentModal from './PaymentModal'; // Import the PaymentModal component

// function CusDue() {
//     const { cusId } = useParams();
//     const Navigate = useNavigate();
//     const [customer, setCustomer] = useState(null);
//     const [paidInvoices, setPaidInvoices] = useState(0);
//     const [paidCheques, setPaidCheques] = useState(0);
//     const [totalDebts, setTotalDebts] = useState(0);
//     const [invoiceDetails, setInvoiceDetails] = useState([]);
//     const [transactionDetails, setTransactionDetails] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [unpaidInvoices, setUnpaidInvoices] = useState(0);
//     const [invoiceNumbers, setInvoiceNumbers] = useState({});
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');


//     const [showColumns, setShowColumns] = useState({
//         date: true,
//         invoiceNo: true,
//         chequeDetails: true,
//         chequeDate: false,
//         datedCheque: false,
//         debit: true,
//         credit: true,
//         balance: true,
//         totalDue: false,
//         paid: true
//     });
//     const [checkedRows, setCheckedRows] = useState({}); // State to track checked rows
//     const [showPaymentModal, setShowPaymentModal] = useState(false); // State to control modal visibility
//     const [selectedInvoices, setSelectedInvoices] = useState([]); // State to store selected invoices

//     const columnLabels = {
//         date: "Date (Invoice Created)",
//         invoiceNo: "Invoice No",
//         chequeDetails: "Cheque Details",
//         chequeDate: "Cheque Given Date",
//         datedCheque: "Dated Cheque",
//         debit: "Debit (Rs)",
//         credit: "Credit (Rs)",
//         balance: "Balance (Rs)",
//         totalDue: "Total Due",
//         // paid: "Paid"
//         paid: "Status"
//     };

//     const toggleColumn = (column) => {
//         setShowColumns(prevState => ({
//             ...prevState,
//             [column]: !prevState[column]
//         }));
//     };

//     // Handle checkbox change
//     const handleCheckboxChange = (index) => {
//         setCheckedRows(prevState => ({
//             ...prevState,
//             [index]: !prevState[index]
//         }));
//     };

//     // Check if any checkbox is checked
//     const isAnyCheckboxChecked = Object.values(checkedRows).some(checked => checked);

//     // Open payment modal
//     const handleMakePayment = () => {
//         const selected = combinedData.filter((row, index) => checkedRows[index]);
//         setSelectedInvoices(selected);
//         setShowPaymentModal(true);
//     };

//     // Close payment modal
//     const handleCloseModal = () => {
//         setShowPaymentModal(false);
//     };



//     const handlePaymentSubmit = async (paymentData) => {
//         try {
//             for (const payment of paymentData.payments) {
//                 const { invoiceNo, payingAmount } = payment;
//                 const invoiceId = Object.keys(invoiceNumbers).find(
//                     key => invoiceNumbers[key] === invoiceNo
//                 );

//                 if (!invoiceId) {
//                     throw new Error('Invoice ID not found for invoice number: ' + invoiceNo);
//                 }

//                 // Call the API to pay the due amount
//                 await axios.post(`${config.BASE_URL}/due/pay/${invoiceId}`, {
//                     payingAmount,
//                     cusId,
//                     payType: paymentData.paymentType,
//                     datedCheque: paymentData.datedCheque,
//                     chequeDetail: paymentData.chequeDetail
//                 });
//             }

//             // Update local state for each modified transaction
//             const updatedTransactionDetails = transactionDetails.map(transaction => {
//                 const payment = paymentData.payments.find(
//                     p => invoiceNumbers[transaction.invoice_invoiceId] === p.invoiceNo
//                 );

//                 if (payment) {
//                     return {
//                         ...transaction,
//                         due: transaction.due - parseFloat(payment.payingAmount),
//                         // Add payment details if needed
//                         paymentType: paymentData.paymentType,
//                         chequeDetail: paymentData.chequeDetail,
//                         datedCheque: paymentData.datedCheque
//                     };
//                 }
//                 return transaction;
//             });

//             setTransactionDetails(updatedTransactionDetails);
//             setSuccessMessage('Payment processed successfully!');
//             setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds

//             // Reset selected rows
//             setCheckedRows({});
//             setShowPaymentModal(false);

//             // Update other relevant states
//             const newTotalDebt = updatedTransactionDetails.reduce((sum, t) => sum + t.due, 0);
//             setTotalDebts(newTotalDebt);

//             const unpaidTransactions = updatedTransactionDetails.filter(t => t.due > 0);
//             const uniqueUnpaidInvoices = [...new Set(unpaidTransactions.map(t => t.invoice_invoiceId))];
//             setUnpaidInvoices(uniqueUnpaidInvoices.length);

//         } catch (error) {
//             console.error('Error processing payments:', error);
//             setErrorMessage('Failed to process payment: ' + error.message);
//             setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 3 seconds
//         }
//     };

//     // Fetch customer details
//     useEffect(() => {
//         axios.get(`${config.BASE_URL}/customer/${cusId}`)
//             .then(response => {
//                 setCustomer(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching customer details:', error);
//                 setError('Failed to fetch customer details');
//             });
//     }, [cusId]);

//     // Fetch due customers and calculate paid invoices and cheques
//     useEffect(() => {
//         axios.get(`${config.BASE_URL}/duecustomers`)
//             .then(response => {
//                 const dueCustomers = response.data.filter(dc => dc.cusId == cusId);
//                 setPaidInvoices(dueCustomers.length);
//                 setPaidCheques(dueCustomers.filter(dc => dc.payType === 'cheque').length);
//             })
//             .catch(error => {
//                 console.error('Error fetching due customers:', error);
//                 setError('Failed to fetch due customers');
//             });
//     }, [cusId]);

//     // Fetch total debts, transaction details, and invoice numbers (filtered by cusId)
//     useEffect(() => {
//         axios.get(`${config.BASE_URL}/transactions/customer/${cusId}`)
//             .then(response => {
//                 const transactions = response.data;
//                 const totalDebt = transactions.reduce((sum, t) => sum + t.due, 0);
//                 setTotalDebts(totalDebt);
//                 setTransactionDetails(transactions);

//                 // Calculate unpaid invoices (unique invoice_invoiceId where due > 0)
//                 const unpaidTransactions = transactions.filter(t => t.due > 0);
//                 const uniqueUnpaidInvoices = [...new Set(unpaidTransactions.map(t => t.invoice_invoiceId))];
//                 setUnpaidInvoices(uniqueUnpaidInvoices.length);

//                 // Fetch invoice numbers for each transaction
//                 const fetchInvoiceNumbers = async () => {
//                     const invoiceNumbersMap = {};
//                     for (const transaction of transactions) {
//                         try {
//                             const invoiceResponse = await axios.get(`${config.BASE_URL}/invoice/${transaction.invoice_invoiceId}`);
//                             invoiceNumbersMap[transaction.invoice_invoiceId] = invoiceResponse.data.invoiceNo;
//                         } catch (error) {
//                             console.error('Error fetching invoice details:', error);
//                             invoiceNumbersMap[transaction.invoice_invoiceId] = 'N/A'; // Fallback if invoice fetch fails
//                         }
//                     }
//                     setInvoiceNumbers(invoiceNumbersMap);
//                 };

//                 fetchInvoiceNumbers();
//             })
//             .catch(error => {
//                 console.error('Error fetching transactions:', error);
//                 setError('Failed to fetch transactions');
//             });
//     }, [cusId]);

//     // Fetch invoice details (filtered by cusId)
//     useEffect(() => {
//         axios.get(`${config.BASE_URL}/duecustomer/invoice/${cusId}`)
//             .then(response => {
//                 setInvoiceDetails(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching invoice details:', error);
//                 setError('Failed to fetch invoice details');
//             })
//             .finally(() => {
//                 setIsLoading(false);
//             });
//     }, [cusId]);

//     const processTransactionData = () => {
//         const finalRows = [];
//         let runningBalance = 0;

//         // Sort transactions by date
//         const sortedTransactions = [...transactionDetails].sort(
//             (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
//         );

//         // Process each transaction
//         sortedTransactions.forEach(transaction => {
//             const debitAmount = transaction.OgDue;
//             runningBalance += debitAmount;

//             // Create main invoice row
//             const invoiceRow = {
//                 invoiceNo: invoiceNumbers[transaction.invoice_invoiceId] || 'N/A',
//                 chequeDetails: '',
//                 soldDate: new Date(transaction.dateTime).toLocaleDateString(),
//                 debit: debitAmount,
//                 credit: 0,
//                 balance: runningBalance,
//                 totalDue: transaction.due,
//                 status: transaction.due > 0 ? 'No' : 'Yes',
//                 isMainRow: true,
//                 invoice_invoiceId: transaction.invoice_invoiceId
//             };

//             finalRows.push(invoiceRow);

//             // Get all payments for this invoice
//             const paymentsForInvoice = invoiceDetails.filter(
//                 payment => payment.invoiceId === transaction.invoice_invoiceId
//             );

//             // Process each payment
//             paymentsForInvoice.forEach(payment => {
//                 runningBalance -= parseFloat(payment.paidAmount);

//                 // Find all invoices paid by this cheque/payment
//                 const relatedPayments = invoiceDetails.filter(
//                     p => p.chequeDetail === payment.chequeDetail && 
//                     p.payType === payment.payType &&
//                     new Date(p.dueDate).getTime() === new Date(payment.dueDate).getTime()
//                 );

//                 // Create payment row
//                 const paymentRow = {
//                     invoiceNo: '',
//                     chequeDetails: payment.chequeDetail || payment.payType,
//                     soldDate: '',
//                     debit: 0,
//                     credit: parseFloat(payment.paidAmount),
//                     balance: runningBalance,
//                     paymentDate: new Date(payment.dueDate).toLocaleDateString(),
//                     datedCheque: payment.datedCheque ? new Date(payment.datedCheque).toLocaleDateString() : '',
//                     isPaymentRow: true,
//                     totalPaidByThisMethod: relatedPayments.reduce((sum, p) => sum + parseFloat(p.paidAmount), 0),
//                     involvedInvoices: relatedPayments.map(p => p.invoiceId)
//                 };

//                 // Calculate days left for dated cheques
//                 if (payment.datedCheque) {
//                     const datedChequeDate = new Date(payment.datedCheque);
//                     const today = new Date();
//                     const timeDiff = datedChequeDate - today;
//                     const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

//                     paymentRow.daysLeftText = daysLeft > 0 ? `${daysLeft} days left` : "Overdue";
//                     paymentRow.daysLeftColor = daysLeft > 0 ? "green" : "red";
//                 }

//                 finalRows.push(paymentRow);
//             });
//         });

//         return finalRows;
//     };

//     // Combine transactionDetails and invoiceDetails into a single dataset
//     const combinedData = transactionDetails.map(transaction => {
//         const payment = invoiceDetails.find(inv => inv.invoiceId === transaction.invoice_invoiceId);
    
//         // Use OgDue from the transaction table for Debit
//         const debitAmount = transaction.OgDue; // Updated to use OgDue
    
//         // Convert Dated Cheque to date format
//         const datedChequeDate = payment?.datedCheque ? new Date(payment.datedCheque) : null;
//         const today = new Date();
    
//         let daysLeftText = "-";
//         let daysLeftColor = "black";
    
//         if (datedChequeDate) {
//             const timeDiff = datedChequeDate - today;
//             const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
//             if (daysLeft > 0) {
//                 daysLeftText = `${daysLeft} days left`;
//                 daysLeftColor = "green";
//             } else {
//                 daysLeftText = "Overdue";
//                 daysLeftColor = "red";
//             }
//         }
    
//         // Fetch payment details for this invoice
//         const payments = invoiceDetails.filter(inv => inv.invoiceId === transaction.invoice_invoiceId);
    
//         // Calculate total paid amount for this invoice
//         const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.paidAmount), 0);
    
//         // Calculate balance
//         const balance = debitAmount - totalPaid;
    
//         return {
//             invoiceNo: invoiceNumbers[transaction.invoice_invoiceId] || 'N/A',
//             chequeDetails: payment?.chequeDetail || 'N/A',
//             soldDate: new Date(transaction.dateTime).toLocaleDateString(),
//             chequeGivenDate: payment ? new Date(payment.dueDate).toLocaleDateString() : '',
//             datedCheque: payment?.datedCheque ? new Date(payment.datedCheque).toLocaleDateString() : '',
//             paymentType: payment?.payType || '',
//             debit: debitAmount, // Updated to use OgDue
//             totalDue: transaction.due,
//             paid: totalPaid,
//             balance: balance,
//             status: balance > 0 ? 'No' : 'Yes',
//             daysLeftText,
//             daysLeftColor,
//             payments: payments // Store all payments for this invoice
//         };
//     });
    
//     // Group payments by chequeDetail or payType
//     const paymentGroups = new Map();
    
//     invoiceDetails.forEach(payment => {
//         const key = payment.chequeDetail || payment.payType;
//         if (!paymentGroups.has(key)) {
//             paymentGroups.set(key, {
//                 chequeDetails: payment.chequeDetail || payment.payType,
//                 totalPaid: 0,
//                 invoices: []
//             });
//         }
//         const group = paymentGroups.get(key);
//         group.totalPaid += parseFloat(payment.paidAmount);
//         group.invoices.push(payment.invoiceId);
//     });
    
//     // Insert summary rows under relevant invoices
//     const finalData = [];
    
//     combinedData.forEach(row => {
//         // Add the invoice row
//         finalData.push(row);
    
//         // Check if there are payments for this invoice
//         const paymentsForInvoice = row.payments;
    
//         if (paymentsForInvoice.length > 0) {
//             paymentsForInvoice.forEach(payment => {
//                 const key = payment.chequeDetail || payment.payType;
//                 const group = paymentGroups.get(key);
    
//                 if (group) {
//                     // Add the summary row under the relevant invoice
//                     finalData.push({
//                         invoiceNo: '', // Empty for summary row
//                         chequeDetails: group.chequeDetails,
//                         soldDate: '', // Empty for summary row
//                         chequeGivenDate: '', // Empty for summary row
//                         datedCheque: '', // Empty for summary row
//                         paymentType: '', // Empty for summary row
//                         debit: '', // Empty for summary row
//                         totalDue: '', // Empty for summary row
//                         paid: group.totalPaid,
//                         balance: '', // Empty for summary row
//                         status: '', // Empty for summary row
//                         daysLeftText: '', // Empty for summary row
//                         daysLeftColor: '', // Empty for summary row
//                         isSummaryRow: true // Flag to identify summary rows
//                     });
    
//                     // Remove the group from the map to avoid duplicate summary rows
//                     paymentGroups.delete(key);
//                 }
//             });
//         }
//     });

//     const groupedData = [];
//     const paymentSummaryMap = new Map();

//     combinedData.forEach(row => {
//         // Add the individual transaction row
//         groupedData.push(row);

//         // Check if there are payments for this invoice
//         if (row.payments.length > 0) {
//             row.payments.forEach(payment => {
//                 const key = payment.chequeDetail || payment.payType;
//                 if (!paymentSummaryMap.has(key)) {
//                     paymentSummaryMap.set(key, {
//                         chequeDetails: payment.chequeDetail || payment.payType,
//                         totalPaid: 0,
//                         invoices: []
//                     });
//                 }
//                 const summary = paymentSummaryMap.get(key);
//                 summary.totalPaid += parseFloat(payment.paidAmount);
//                 summary.invoices.push(row.invoiceNo);
//             });
//         }
//     });

//     // Add summary rows
//     paymentSummaryMap.forEach((summary, key) => {
//         groupedData.push({
//             invoiceNo: '', // Empty for summary row
//             chequeDetails: summary.chequeDetails,
//             soldDate: '', // Empty for summary row
//             chequeGivenDate: '', // Empty for summary row
//             datedCheque: '', // Empty for summary row
//             paymentType: '', // Empty for summary row
//             debit: '', // Empty for summary row
//             totalDue: '', // Empty for summary row
//             paid: summary.totalPaid,
//             balance: '', // Empty for summary row
//             status: '', // Empty for summary row
//             daysLeftText: '', // Empty for summary row
//             daysLeftColor: '', // Empty for summary row
//             isSummaryRow: true // Flag to identify summary rows
//         });
//     });


//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className="container my-4 p-3">
//             <h3 className="text-primary mb-4">Due Details for Customer: {customer?.cusName}</h3>

//             {/* Success and Error Messages */}
//             {successMessage && (
//                 <div className="alert alert-success alert-dismissible fade show" role="alert">
//                     {successMessage}
//                     <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
//                 </div>
//             )}
//             {errorMessage && (
//                 <div className="alert alert-danger alert-dismissible fade show" role="alert">
//                     {errorMessage}
//                     <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
//                 </div>
//             )}

//             <div className="row g-4">
//                 {/* Left Section: Customer Details */}
//                 <div className="col-lg-7">
//                     {/* Customer Name */}
//                     <div className="form-group row mb-3">
//                         <label className="col-sm-3 col-form-label">Customer Name:</label>
//                         <div className="col-sm-9">
//                             <input type="text" className="form-control" value={customer?.cusName || ''} readOnly />
//                         </div>
//                     </div>

//                     {/* Customer Company */}
//                     <div className="form-group row mb-3">
//                         <label className="col-sm-3 col-form-label">Customer Company:</label>
//                         <div className="col-sm-9">
//                             <input type="text" className="form-control" value={customer?.cusOffice || ''} readOnly />
//                         </div>
//                     </div>

//                     {/* No. of unpaid invoices */}
//                     <div className="form-group row mb-3">
//                         <label className="col-sm-3 col-form-label">No. of unpaid invoices:</label>
//                         <div className="col-sm-9">
//                             <input type="number" className="form-control" value={unpaidInvoices} readOnly />
//                         </div>
//                     </div>

//                     {/* Total Due of this customer */}
//                     <div className="form-group row mb-3">
//                         <label className="col-sm-3 col-form-label">Total Due of this customer:</label>
//                         <div className="col-sm-9">
//                             <input type="text" className="form-control" value={totalDebts} readOnly />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Section: Print Options */}
//                 <div className="col-lg-5">
//                     <h2 className="text-secondary mb-3">Print</h2>
//                     <div className="form-check mb-2">
//                         <button
//                             className="btn btn-primary"
//                             onClick={() => Navigate(`/dueinvoice/${cusId}`)}
//                         >
//                             View Paid Invoices
//                         </button>
//                     </div>
//                     <div className="form-check mb-2">
//                         <button
//                             className="btn btn-primary"
//                             onClick={() => Navigate(`/unpaidinvoice/${cusId}`)}
//                         >
//                             View Unpaid Invoices
//                         </button>
//                     </div>
//                     <div className="mb-4">
//                         <label htmlFor="date" className="form-label">Date:</label>
//                         <input type="date" id="date" className="form-control" />
//                     </div>
//                 </div>
//             </div>



//             <div className="d-flex justify-content-end mb-3">
//                 {/* Make Payment Button (Conditional Rendering) */}
//                 {isAnyCheckboxChecked && (
//                     <div className="d-flex justify-content-start mb-3">
//                         <button className="btn btn-success" onClick={handleMakePayment}>
//                             Make a Bulk Payment
//                         </button>
//                     </div>
//                 )}
//                 <div className="dropdown">
//                     <button
//                         className="btn btn-secondary dropdown-toggle"
//                         type="button"
//                         id="columnToggleDropdown"
//                         data-bs-toggle="dropdown"
//                         aria-expanded="false"
//                     >
//                         Toggle Columns
//                     </button>
//                     <ul className="dropdown-menu dropdown-menu-end p-3" aria-labelledby="columnToggleDropdown">
//                         {Object.keys(showColumns).map((colKey) => (
//                             <li key={colKey} className="form-check">
//                                 <input
//                                     type="checkbox"
//                                     className="form-check-input"
//                                     id={colKey}
//                                     checked={showColumns[colKey]}
//                                     onChange={() => toggleColumn(colKey)}
//                                 />
//                                 <label className="form-check-label ms-2" htmlFor={colKey}>
//                                     {columnLabels[colKey]}
//                                 </label>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>

//             <table className="table table-bordered">
//                 <thead className="table-light">
//                     <tr>
//                         {showColumns.date && <th>Date</th>}
//                         {showColumns.invoiceNo && <th>Invoice No</th>}
//                         {showColumns.chequeDetails && <th>Cheque Details</th>}
//                         {showColumns.chequeDate && <th>Payment Date</th>}
//                         {showColumns.datedCheque && <th>Dated Cheque</th>}
//                         <th>Days Left</th>
//                         {showColumns.debit && <th>Debit (Rs)</th>}
//                         {showColumns.credit && <th>Credit (Rs)</th>}
//                         {showColumns.balance && <th>Balance (Rs)</th>}
//                         {showColumns.paid && <th>Status</th>}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {processTransactionData().map((row, index) => {
//                         const isOldInvoice = row.isMainRow && 
//                             ((new Date() - new Date(row.soldDate)) / (1000 * 60 * 60 * 24) >= 30) && 
//                             row.status === 'No';

//                         return (
//                             <tr
//                                 key={index}
//                                 style={{
//                                     backgroundColor: isOldInvoice ? '#ffcccc' : 
//                                                    row.isPaymentRow ? '#f0f0f0' : 'inherit'
//                                 }}
//                             >
//                                 {showColumns.date && <td>{row.soldDate}</td>}
//                                 {showColumns.invoiceNo && <td>{row.invoiceNo}</td>}
//                                 {showColumns.chequeDetails && <td>{row.chequeDetails}</td>}
//                                 {showColumns.chequeDate && <td>{row.paymentDate}</td>}
//                                 {showColumns.datedCheque && <td>{row.datedCheque}</td>}
//                                 <td style={{ 
//                                     color: row.daysLeftColor || 'inherit', 
//                                     fontWeight: "bold" 
//                                 }}>
//                                     {row.daysLeftText || '-'}
//                                 </td>
//                                 {showColumns.debit && <td>{row.debit || ''}</td>}
//                                 {showColumns.credit && <td>{row.credit || ''}</td>}
//                                 {showColumns.balance && <td>{row.balance}</td>}
//                                 {showColumns.paid && (
//                                     <td>
//                                         {row.isMainRow && (
//                                             <>
//                                                 <span style={{ 
//                                                     color: row.status === 'No' ? 'red' : 'green',
//                                                     fontWeight: row.status === 'Yes' ? 'bold' : 'normal'
//                                                 }}>
//                                                     {row.status}
//                                                 </span>
//                                                 {row.status === 'No' && (
//                                                     <input
//                                                         type="checkbox"
//                                                         className="form-check-input ms-2"
//                                                         checked={checkedRows[index] || false}
//                                                         onChange={() => handleCheckboxChange(index)}
//                                                     />
//                                                 )}
//                                             </>
//                                         )}
//                                     </td>
//                                 )}
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>

//             {/* Payment Modal */}
//             {showPaymentModal && (
//                 <PaymentModal
//                     selectedInvoices={selectedInvoices}
//                     onClose={handleCloseModal}
//                     onSubmit={handlePaymentSubmit}
//                 />
//             )}
//         </div>
//     );
// }

// export default CusDue;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config'; // Import your config file
import PaymentModal from './PaymentModal'; // Import the PaymentModal component
import PaginatedTransactionTable from './PaginatedTransactionTable';

function CusDue() {
    const { cusId } = useParams();
    const Navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [paidInvoices, setPaidInvoices] = useState(0);
    const [paidCheques, setPaidCheques] = useState(0);
    const [totalDebts, setTotalDebts] = useState(0);
    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const [transactionDetails, setTransactionDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unpaidInvoices, setUnpaidInvoices] = useState(0);
    const [invoiceNumbers, setInvoiceNumbers] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPaidInvoices, setShowPaidInvoices] = useState(false);
const [showUnpaidInvoices, setShowUnpaidInvoices] = useState(false);
    

    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    // Function to check if a date falls within the selected range
    const isDateInRange = (dateToCheck) => {
        if (!dateRange.startDate && !dateRange.endDate) return true;
        
        const date = new Date(dateToCheck);
        const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
        const end = dateRange.endDate ? new Date(dateRange.endDate) : null;
        
        if (start && end) {
            return date >= start && date <= end;
        } else if (start) {
            return date >= start;
        } else if (end) {
            return date <= end;
        }
        return true;
    };

    const [showColumns, setShowColumns] = useState({
        date: true,
        invoiceNo: true,
        chequeDetails: true,
        chequeDate: false,
        datedCheque: false,
        daysLeft: false,  // Added
        daysOfDue: true,
        debit: true,
        credit: true,
        balance: true,
        totalDue: false,
        paid: true
    });

    const [checkedRows, setCheckedRows] = useState({}); // State to track checked rows
    const [showPaymentModal, setShowPaymentModal] = useState(false); // State to control modal visibility
    const [selectedInvoices, setSelectedInvoices] = useState([]); // State to store selected invoices

    const columnLabels = {
        date: "Date (Invoice Created)",
        invoiceNo: "Invoice No",
        chequeDetails: "Cheque Details",
        chequeDate: "Cheque Given Date",
        datedCheque: "Dated Cheque",
        daysLeft: "Days Left",  // Added
        daysOfDue: "No of Days Due",
        debit: "Debit (Rs)",
        credit: "Credit (Rs)",
        balance: "Balance (Rs)",
        totalDue: "Total Due",
        paid: "Status"
    };

    const calculateDaysDue = (invoiceDate, dueFinishedDate, isPaid) => {
        const today = new Date();
        const startDate = new Date(invoiceDate);

        if (isPaid && dueFinishedDate) {
            // For paid invoices, calculate days between invoice date and payment date
            const paymentDate = new Date(dueFinishedDate);
            const daysDiff = Math.floor((paymentDate - startDate) / (1000 * 60 * 60 * 24));
            return `In ${daysDiff} days`;
        } else {
            // For unpaid invoices, calculate days from invoice date to today
            const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
            return `${daysDiff} days`;
        }
    };

    const toggleColumn = (column) => {
        setShowColumns(prevState => ({
            ...prevState,
            [column]: !prevState[column]
        }));
    };

    // Handle checkbox change
    const handleCheckboxChange = (index) => {
        setCheckedRows(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    // Check if any checkbox is checked
    const isAnyCheckboxChecked = Object.values(checkedRows).some(checked => checked);

    // Open payment modal
    // const handleMakePayment = () => {
    //     const selected = combinedData.filter((row, index) => checkedRows[index]);
    //     setSelectedInvoices(selected);
    //     setShowPaymentModal(true);
    // };
    const handleMakePayment = () => {
        // Filter the processed transaction data to get only checked rows that are main invoice rows
        const processedData = processTransactionData();
        const selected = processedData.filter((row, index) => 
            checkedRows[index] && row.isMainRow && row.status === 'No'
        ).map(row => ({
            invoiceNo: row.invoiceNo,
            totalDue: row.totalDue,
            invoice_invoiceId: row.invoice_invoiceId
        }));

        if (selected.length > 0) {
            setSelectedInvoices(selected);
            setShowPaymentModal(true);
        }
    };

    // Close payment modal
    const handleCloseModal = () => {
        setShowPaymentModal(false);
    };



    const handlePaymentSubmit = async (paymentData) => {
        try {
            for (const payment of paymentData.payments) {
                const { invoiceNo, payingAmount } = payment;
                const selectedInvoice = selectedInvoices.find(inv => inv.invoiceNo === invoiceNo);
                
                if (!selectedInvoice) {
                    throw new Error('Invoice not found: ' + invoiceNo);
                }

                // Use the invoice_invoiceId from selectedInvoice
                await axios.post(`${config.BASE_URL}/due/pay/${selectedInvoice.invoice_invoiceId}`, {
                    payingAmount,
                    cusId,
                    payType: paymentData.paymentType,
                    datedCheque: paymentData.datedCheque,
                    chequeDetail: paymentData.chequeDetail
                });
            
            }

            // Update local state for each modified transaction
            const updatedTransactionDetails = transactionDetails.map(transaction => {
                const payment = paymentData.payments.find(
                    p => invoiceNumbers[transaction.invoice_invoiceId] === p.invoiceNo
                );

                if (payment) {
                    return {
                        ...transaction,
                        due: transaction.due - parseFloat(payment.payingAmount),
                        // Add payment details if needed
                        paymentType: paymentData.paymentType,
                        chequeDetail: paymentData.chequeDetail,
                        datedCheque: paymentData.datedCheque
                    };
                }
                return transaction;
            });

            setTransactionDetails(updatedTransactionDetails);
            setSuccessMessage('Payment processed successfully!');
            setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds

            // Reset selected rows
            setCheckedRows({});
            setShowPaymentModal(false);

            // Update other relevant states
            const newTotalDebt = updatedTransactionDetails.reduce((sum, t) => sum + t.due, 0);
            setTotalDebts(newTotalDebt);

            const unpaidTransactions = updatedTransactionDetails.filter(t => t.due > 0);
            const uniqueUnpaidInvoices = [...new Set(unpaidTransactions.map(t => t.invoice_invoiceId))];
            setUnpaidInvoices(uniqueUnpaidInvoices.length);

        } catch (error) {
            console.error('Error processing payments:', error);
            setErrorMessage('Failed to process payment: ' + error.message);
            setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 3 seconds
        }
    };

    // Fetch customer details
    useEffect(() => {
        axios.get(`${config.BASE_URL}/customer/${cusId}`)
            .then(response => {
                setCustomer(response.data);
            })
            .catch(error => {
                console.error('Error fetching customer details:', error);
                setError('Failed to fetch customer details');
            });
    }, [cusId]);

    // Fetch due customers and calculate paid invoices and cheques
    useEffect(() => {
        axios.get(`${config.BASE_URL}/duecustomers`)
            .then(response => {
                const dueCustomers = response.data.filter(dc => dc.cusId == cusId);
                setPaidInvoices(dueCustomers.length);
                setPaidCheques(dueCustomers.filter(dc => dc.payType === 'cheque').length);
            })
            .catch(error => {
                console.error('Error fetching due customers:', error);
                setError('Failed to fetch due customers');
            });
    }, [cusId]);

    // Fetch total debts, transaction details, and invoice numbers (filtered by cusId)
    useEffect(() => {
        axios.get(`${config.BASE_URL}/transactions/customer/${cusId}`)
            .then(response => {
                const transactions = response.data;
                const totalDebt = transactions.reduce((sum, t) => sum + t.due, 0);
                setTotalDebts(totalDebt);
                setTransactionDetails(transactions);

                // Calculate unpaid invoices (unique invoice_invoiceId where due > 0)
                const unpaidTransactions = transactions.filter(t => t.due > 0);
                const uniqueUnpaidInvoices = [...new Set(unpaidTransactions.map(t => t.invoice_invoiceId))];
                setUnpaidInvoices(uniqueUnpaidInvoices.length);

                // Fetch invoice numbers for each transaction
                const fetchInvoiceNumbers = async () => {
                    const invoiceNumbersMap = {};
                    for (const transaction of transactions) {
                        try {
                            const invoiceResponse = await axios.get(`${config.BASE_URL}/invoice/${transaction.invoice_invoiceId}`);
                            invoiceNumbersMap[transaction.invoice_invoiceId] = invoiceResponse.data.invoiceNo;
                        } catch (error) {
                            console.error('Error fetching invoice details:', error);
                            invoiceNumbersMap[transaction.invoice_invoiceId] = 'N/A'; // Fallback if invoice fetch fails
                        }
                    }
                    setInvoiceNumbers(invoiceNumbersMap);
                };

                fetchInvoiceNumbers();
            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
                setError('Failed to fetch transactions');
            });
    }, [cusId]);

    // Fetch invoice details (filtered by cusId)
    useEffect(() => {
        axios.get(`${config.BASE_URL}/duecustomer/invoice/${cusId}`)
            .then(response => {
                setInvoiceDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching invoice details:', error);
                setError('Failed to fetch invoice details');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [cusId]);

    const processTransactionData = () => {
        const finalRows = [];
        let runningBalance = 0;
    
        const sortedTransactions = [...transactionDetails].sort(
            (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
        );
    
        sortedTransactions.forEach(transaction => {
            const debitAmount = transaction.OgDue;
            const transactionDate = new Date(transaction.dateTime);
            
            if (isDateInRange(transactionDate)) {
                runningBalance += debitAmount;
    
                const isPaid = transaction.due === 0;
                const daysDue = calculateDaysDue(
                    transaction.dateTime, 
                    transaction.dueFinishedDate,
                    isPaid
                );
    
                const invoiceRow = {
                    invoiceNo: invoiceNumbers[transaction.invoice_invoiceId] || 'N/A',
                    chequeDetails: '',
                    soldDate: transactionDate.toLocaleDateString(),
                    debit: debitAmount,
                    credit: 0,
                    balance: runningBalance,
                    totalDue: transaction.due,
                    status: transaction.due > 0 ? 'No' : 'Yes',
                    isMainRow: true,
                    invoice_invoiceId: transaction.invoice_invoiceId,
                    daysDue: daysDue
                };
    
                // Apply filters based on checkbox states
                if ((showPaidInvoices && invoiceRow.status === 'Yes') || 
                    (showUnpaidInvoices && invoiceRow.status === 'No') || 
                    (!showPaidInvoices && !showUnpaidInvoices)) {
                    finalRows.push(invoiceRow);
                }
    
                // Process payments for this invoice
                const paymentsForInvoice = invoiceDetails.filter(
                    payment => payment.invoiceId === transaction.invoice_invoiceId
                );
    
                paymentsForInvoice.forEach(payment => {
                    const paymentDate = new Date(payment.dueDate);
                    
                    // Only include payments within the date range
                    if (isDateInRange(paymentDate)) {
                        runningBalance -= parseFloat(payment.paidAmount);
    
                        const relatedPayments = invoiceDetails.filter(
                            p => p.chequeDetail === payment.chequeDetail && 
                            p.payType === payment.payType &&
                            new Date(p.dueDate).getTime() === paymentDate.getTime()
                        );
    
                        const paymentRow = {
                            invoiceNo: '',
                            chequeDetails: payment.chequeDetail || payment.payType,
                            soldDate: '',
                            debit: 0,
                            credit: parseFloat(payment.paidAmount),
                            balance: runningBalance,
                            paymentDate: paymentDate.toLocaleDateString(),
                            datedCheque: payment.datedCheque ? new Date(payment.datedCheque).toLocaleDateString() : '',
                            isPaymentRow: true,
                            totalPaidByThisMethod: relatedPayments.reduce((sum, p) => sum + parseFloat(p.paidAmount), 0),
                            involvedInvoices: relatedPayments.map(p => p.invoiceId)
                        };
    
                        if (payment.datedCheque) {
                            const datedChequeDate = new Date(payment.datedCheque);
                            const today = new Date();
                            const timeDiff = datedChequeDate - today;
                            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
                            paymentRow.daysLeftText = daysLeft > 0 ? `${daysLeft} days left` : "Overdue";
                            paymentRow.daysLeftColor = daysLeft > 0 ? "green" : "red";
                        }
    
                        finalRows.push(paymentRow);
                    }
                });
            }
        });
    
        return finalRows;
    };

    // Combine transactionDetails and invoiceDetails into a single dataset
    const combinedData = transactionDetails.map(transaction => {
        const payment = invoiceDetails.find(inv => inv.invoiceId === transaction.invoice_invoiceId);
    
        // Use OgDue from the transaction table for Debit
        const debitAmount = transaction.OgDue; // Updated to use OgDue
    
        // Convert Dated Cheque to date format
        const datedChequeDate = payment?.datedCheque ? new Date(payment.datedCheque) : null;
        const today = new Date();
    
        let daysLeftText = "-";
        let daysLeftColor = "black";
    
        if (datedChequeDate) {
            const timeDiff = datedChequeDate - today;
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
            if (daysLeft > 0) {
                daysLeftText = `${daysLeft} days left`;
                daysLeftColor = "green";
            } else {
                daysLeftText = "Overdue";
                daysLeftColor = "red";
            }
        }
    
        // Fetch payment details for this invoice
        const payments = invoiceDetails.filter(inv => inv.invoiceId === transaction.invoice_invoiceId);
    
        // Calculate total paid amount for this invoice
        const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.paidAmount), 0);
    
        // Calculate balance
        const balance = debitAmount - totalPaid;
    
        return {
            invoiceNo: invoiceNumbers[transaction.invoice_invoiceId] || 'N/A',
            chequeDetails: payment?.chequeDetail || 'N/A',
            soldDate: new Date(transaction.dateTime).toLocaleDateString(),
            chequeGivenDate: payment ? new Date(payment.dueDate).toLocaleDateString() : '',
            datedCheque: payment?.datedCheque ? new Date(payment.datedCheque).toLocaleDateString() : '',
            paymentType: payment?.payType || '',
            debit: debitAmount, // Updated to use OgDue
            totalDue: transaction.due,
            paid: totalPaid,
            balance: balance,
            status: balance > 0 ? 'No' : 'Yes',
            daysLeftText,
            daysLeftColor,
            payments: payments // Store all payments for this invoice
        };
    });
    
    // Group payments by chequeDetail or payType
    const paymentGroups = new Map();
    
    invoiceDetails.forEach(payment => {
        const key = payment.chequeDetail || payment.payType;
        if (!paymentGroups.has(key)) {
            paymentGroups.set(key, {
                chequeDetails: payment.chequeDetail || payment.payType,
                totalPaid: 0,
                invoices: []
            });
        }
        const group = paymentGroups.get(key);
        group.totalPaid += parseFloat(payment.paidAmount);
        group.invoices.push(payment.invoiceId);
    });
    
    // Insert summary rows under relevant invoices
    const finalData = [];
    
    combinedData.forEach(row => {
        // Add the invoice row
        finalData.push(row);
    
        // Check if there are payments for this invoice
        const paymentsForInvoice = row.payments;
    
        if (paymentsForInvoice.length > 0) {
            paymentsForInvoice.forEach(payment => {
                const key = payment.chequeDetail || payment.payType;
                const group = paymentGroups.get(key);
    
                if (group) {
                    // Add the summary row under the relevant invoice
                    finalData.push({
                        invoiceNo: '', // Empty for summary row
                        chequeDetails: group.chequeDetails,
                        soldDate: '', // Empty for summary row
                        chequeGivenDate: '', // Empty for summary row
                        datedCheque: '', // Empty for summary row
                        paymentType: '', // Empty for summary row
                        debit: '', // Empty for summary row
                        totalDue: '', // Empty for summary row
                        paid: group.totalPaid,
                        balance: '', // Empty for summary row
                        status: '', // Empty for summary row
                        daysLeftText: '', // Empty for summary row
                        daysLeftColor: '', // Empty for summary row
                        isSummaryRow: true // Flag to identify summary rows
                    });
    
                    // Remove the group from the map to avoid duplicate summary rows
                    paymentGroups.delete(key);
                }
            });
        }
    });

    const groupedData = [];
    const paymentSummaryMap = new Map();

    combinedData.forEach(row => {
        // Add the individual transaction row
        groupedData.push(row);

        // Check if there are payments for this invoice
        if (row.payments.length > 0) {
            row.payments.forEach(payment => {
                const key = payment.chequeDetail || payment.payType;
                if (!paymentSummaryMap.has(key)) {
                    paymentSummaryMap.set(key, {
                        chequeDetails: payment.chequeDetail || payment.payType,
                        totalPaid: 0,
                        invoices: []
                    });
                }
                const summary = paymentSummaryMap.get(key);
                summary.totalPaid += parseFloat(payment.paidAmount);
                summary.invoices.push(row.invoiceNo);
            });
        }
    });

    // Add summary rows
    paymentSummaryMap.forEach((summary, key) => {
        groupedData.push({
            invoiceNo: '', // Empty for summary row
            chequeDetails: summary.chequeDetails,
            soldDate: '', // Empty for summary row
            chequeGivenDate: '', // Empty for summary row
            datedCheque: '', // Empty for summary row
            paymentType: '', // Empty for summary row
            debit: '', // Empty for summary row
            totalDue: '', // Empty for summary row
            paid: summary.totalPaid,
            balance: '', // Empty for summary row
            status: '', // Empty for summary row
            daysLeftText: '', // Empty for summary row
            daysLeftColor: '', // Empty for summary row
            isSummaryRow: true // Flag to identify summary rows
        });
    });


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container my-4 p-3">
            <h3 className="text-primary mb-4">Due Details for Customer: {customer?.cusName}</h3>

            {/* Success and Error Messages */}
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {errorMessage}
                    <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
                </div>
            )}

            <div className="row g-4">
                {/* Left Section: Customer Details */}
                <div className="col-lg-7">
                    {/* Customer Name */}
                    <div className="form-group row mb-3">
                        <label className="col-sm-3 col-form-label">Customer Name:</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" value={customer?.cusName || ''} readOnly />
                        </div>
                    </div>

                    {/* Customer Company */}
                    <div className="form-group row mb-3">
                        <label className="col-sm-3 col-form-label">Customer Company:</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" value={customer?.cusOffice || ''} readOnly />
                        </div>
                    </div>

                    {/* No. of unpaid invoices */}
                    <div className="form-group row mb-3">
                        <label className="col-sm-3 col-form-label">No. of unpaid invoices:</label>
                        <div className="col-sm-9">
                            <input type="number" className="form-control" value={unpaidInvoices} readOnly />
                        </div>
                    </div>

                    {/* Total Due of this customer */}
                    <div className="form-group row mb-3">
                        <label className="col-sm-3 col-form-label">Total Due of this customer:</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" value={totalDebts} readOnly />
                        </div>
                    </div>
                </div>

                {/* Right Section: Print Options */}
                <div className="col-lg-5">
                <h2 className="text-secondary mb-3">Print</h2>
                <div className="form-check mb-2">
    <input
        type="checkbox"
        className="form-check-input"
        id="showPaidInvoices"
        checked={showPaidInvoices}
        onChange={() => setShowPaidInvoices(!showPaidInvoices)}
    />
    
    <button 
        className="btn btn-primary ms-3" 
        onClick={() => Navigate(`/dueinvoice/${cusId}`)}
    >
        View Paid Invoices
    </button>
</div>
<div className="form-check mb-2">
    <input
        type="checkbox"
        className="form-check-input"
        id="showUnpaidInvoices"
        checked={showUnpaidInvoices}
        onChange={() => setShowUnpaidInvoices(!showUnpaidInvoices)}
    />
    
    <button 
        className="btn btn-primary ms-3" 
        onClick={() => Navigate(`/unpaidinvoice/${cusId}`)}
    >
        View Unpaid Invoices 
    </button>
</div>
                <div className="mb-4">
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="startDate" className="form-label">Start Date:</label>
                            <input
                                type="date"
                                id="startDate"
                                className="form-control"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange(prev => ({
                                    ...prev,
                                    startDate: e.target.value
                                }))}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="endDate" className="form-label">End Date:</label>
                            <input
                                type="date"
                                id="endDate"
                                className="form-control"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange(prev => ({
                                    ...prev,
                                    endDate: e.target.value
                                }))}
                            />
                        </div>
                    </div>
                </div>
            </div>
            </div>



            <div className="d-flex justify-content-end mb-3">
                {/* Make Payment Button (Conditional Rendering) */}
                {isAnyCheckboxChecked && (
                    <div className="d-flex justify-content-start mb-3">
                        <button className="btn btn-success" onClick={handleMakePayment}>
                            Make a Bulk Payment
                        </button>
                    </div>
                )}
                <div className="dropdown">
                    <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="columnToggleDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Toggle Columns
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end p-3" aria-labelledby="columnToggleDropdown">
                        {Object.keys(showColumns).map((colKey) => (
                            <li key={colKey} className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={colKey}
                                    checked={showColumns[colKey]}
                                    onChange={() => toggleColumn(colKey)}
                                />
                                <label className="form-check-label ms-2" htmlFor={colKey}>
                                    {columnLabels[colKey]}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        {showColumns.date && <th>Date</th>}
                        {showColumns.invoiceNo && <th>Invoice No</th>}
                        {showColumns.chequeDetails && <th>Cheque Details</th>}
                        {showColumns.chequeDate && <th>Payment Date</th>}
                        {showColumns.datedCheque && <th>Dated Cheque</th>}
                        {showColumns.daysLeft && <th>Days Left</th>}
                        {/* <th>Days Left</th> */}
                        {showColumns.daysOfDue && <th>No of Days Due</th>}
                        {showColumns.debit && <th>Debit (Rs)</th>}
                        {showColumns.credit && <th>Credit (Rs)</th>}
                        {showColumns.balance && <th>Balance (Rs)</th>}
                        {showColumns.paid && <th>Status</th>}
                    </tr>
                </thead>
                <tbody>
                    {processTransactionData().map((row, index) => {
                        const isOldInvoice = row.isMainRow && 
                            ((new Date() - new Date(row.soldDate)) / (1000 * 60 * 60 * 24) >= 30) && 
                            row.status === 'No';

                        return (
                            <tr
                                key={index}
                                style={{
                                    backgroundColor: isOldInvoice ? '#ffcccc' : 
                                                   row.isPaymentRow ? '#f0f0f0' : 'inherit'
                                }}
                            >
                                {showColumns.date && <td>{row.soldDate}</td>}
                                {showColumns.invoiceNo && <td>{row.invoiceNo}</td>}
                                {showColumns.chequeDetails && <td>{row.chequeDetails}</td>}
                                {showColumns.chequeDate && <td>{row.paymentDate}</td>}
                                {showColumns.datedCheque && <td>{row.datedCheque}</td>}
                                {showColumns.daysLeft && <td style={{ 
                                    color: row.daysLeftColor || 'inherit', 
                                    fontWeight: "bold" 
                                }}>
                                    {row.daysLeftText || '-'}
                                </td>}
                                
                                {showColumns.daysOfDue && (
                                    <td>{row.isMainRow ? row.daysDue : '-'}</td>
                                )}
                                {showColumns.debit && <td>{row.debit || ''}</td>}
                                {showColumns.credit && <td>{row.credit || ''}</td>}
                                {showColumns.balance && <td>{row.balance}</td>}
                                {showColumns.paid && (
                                    <td>
                                        {row.isMainRow && (
                                            <>
                                                <span style={{ 
                                                    color: row.status === 'No' ? 'red' : 'green',
                                                    fontWeight: row.status === 'Yes' ? 'bold' : 'normal'
                                                }}>
                                                    {row.status}
                                                </span>
                                                {row.status === 'No' && (
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input ms-2"
                                                        checked={checkedRows[index] || false}
                                                        onChange={() => handleCheckboxChange(index)}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>


{/* <PaginatedTransactionTable
    data={processTransactionData()}
    showColumns={showColumns}
    columnLabels={columnLabels}
    checkedRows={checkedRows}
    onCheckboxChange={handleCheckboxChange}
/> */}
            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentModal
                    selectedInvoices={selectedInvoices}
                    onClose={handleCloseModal}
                    onSubmit={handlePaymentSubmit}
                />
            )}
        </div>
    );
}

export default CusDue;
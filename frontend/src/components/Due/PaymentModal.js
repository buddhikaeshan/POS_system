// import React, { useState } from 'react';
// import './PaymentModal.css'; 

// const PaymentModal = ({ selectedInvoices, onClose, onSubmit }) => {
//     const [chequeDetail, setChequeDetail] = useState('');
//     const [payments, setPayments] = useState(
//         selectedInvoices.map(invoice => ({
//             invoiceNo: invoice.invoiceNo,
//             dueAmount: invoice.totalDue,
//             payingAmount: ''
//         }))
//     );

//     const handlePaymentChange = (index, value) => {
//         const updatedPayments = [...payments];
//         updatedPayments[index].payingAmount = value;
//         setPayments(updatedPayments);
//     };

//     const handleSubmit = () => {
//         onSubmit(payments, chequeDetail);
//         onClose();
//     };

//     return (
//         <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//             <div className="modal-dialog modal-dialog-centered">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title">Make Payment</h5>
//                         <button type="button" className="btn-close" onClick={onClose}></button>
//                     </div>
//                     <div className="modal-body">
//                         <div className="mb-3">
//                             <label htmlFor="chequeDetail" className="form-label fw-bold">Cheque Detail:</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 id="chequeDetail"
//                                 value={chequeDetail}
//                                 onChange={(e) => setChequeDetail(e.target.value)}
//                                 placeholder="Enter cheque details"
//                             />
//                         </div>
//                         {payments.map((payment, index) => (
//                             <div key={index} className="mb-3">
//                                 <label htmlFor={`payment-${index}`} className="form-label fw-bold">
//                                     Invoice No: {payment.invoiceNo} (Due: {payment.dueAmount})
//                                 </label>
//                                 <input
//                                     type="number"
//                                     className="form-control"
//                                     id={`payment-${index}`}
//                                     value={payment.payingAmount}
//                                     onChange={(e) => handlePaymentChange(index, e.target.value)}
//                                     placeholder="Enter paying amount"
//                                     min="0"
//                                     max={payment.dueAmount}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                     <div className="modal-footer">
//                         <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
//                         <button type="button" className="btn btn-success" onClick={handleSubmit}>Submit</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PaymentModal;



//---------------------------------------------------------------------------------------------------------------

// import React, { useState } from 'react';
// import './PaymentModal.css'; 

// const PaymentModal = ({ selectedInvoices, onClose, onSubmit }) => {
//     const [chequeDetail, setChequeDetail] = useState('');
//     const [paymentType, setPaymentType] = useState('cash');  // State to track payment type
//     const [datedCheque, setdatedCheque] = useState('');  // State to track cheque date
//     const [payments, setPayments] = useState(
//         selectedInvoices.map(invoice => ({
//             invoiceNo: invoice.invoiceNo,
//             dueAmount: invoice.totalDue,
//             payingAmount: ''
//         }))
//     );

//     const handlePaymentChange = (index, value) => {
//         const updatedPayments = [...payments];
//         updatedPayments[index].payingAmount = value;
//         setPayments(updatedPayments);
//     };

//     const handleSubmit = () => {
//         const paymentData = {
//             payments,
//             chequeDetail,
//             paymentType,
//             datedCheque: paymentType === 'cheque' ? datedCheque : null  // Only include chequeDate if payment type is cheque
//         };
//         onSubmit(paymentData);
//         onClose();
//     };

//     return (
//         <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//             <div className="modal-dialog modal-dialog-centered">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title">Make Payment</h5>
//                         <button type="button" className="btn-close" onClick={onClose}></button>
//                     </div>
//                     <div className="modal-body">
//                         {/* Radio buttons for payment type */}
//                         <div className="mb-3">
//                             <label className="form-label fw-bold">Payment Type:</label><br />
//                             <div className="form-check form-check-inline">
//                                 <input
//                                     type="radio"
//                                     id="cash"
//                                     name="paymentType"
//                                     value="cash"
//                                     checked={paymentType === 'cash'}
//                                     onChange={() => setPaymentType('cash')}
//                                     className="form-check-input"
//                                 />
//                                 <label htmlFor="cash" className="form-check-label">Cash</label>
//                             </div>
//                             <div className="form-check form-check-inline">
//                                 <input
//                                     type="radio"
//                                     id="cheque"
//                                     name="paymentType"
//                                     value="cheque"
//                                     checked={paymentType === 'cheque'}
//                                     onChange={() => setPaymentType('cheque')}
//                                     className="form-check-input"
//                                 />
//                                 <label htmlFor="cheque" className="form-check-label">Cheque</label>
//                             </div>
//                         </div>

//                         {/* Show cheque detail input if cheque is selected */}
//                         {paymentType === 'cheque' && (
//                             <div className="mb-3">
//                                 <label htmlFor="chequeDetail" className="form-label fw-bold">Cheque Detail:</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="chequeDetail"
//                                     value={chequeDetail}
//                                     onChange={(e) => setChequeDetail(e.target.value)}
//                                     placeholder="Enter cheque details"
//                                 />
//                             </div>
//                         )}

//                         {/* Show date picker if cheque is selected */}
//                         {paymentType === 'cheque' && (
//                             <div className="mb-3">
//                                 <label htmlFor="datedCheque" className="form-label fw-bold">Dated Cheque:</label>
//                                 <input
//                                     type="date"
//                                     className="form-control"
//                                     id="datedCheque"
//                                     value={datedCheque}
//                                     onChange={(e) => setdatedCheque(e.target.value)}
//                                 />
//                             </div>
//                         )}

//                         {/* Payment details */}
//                         {payments.map((payment, index) => (
//                             <div key={index} className="mb-3">
//                                 <label htmlFor={`payment-${index}`} className="form-label fw-bold">
//                                     Invoice No: {payment.invoiceNo} (Due: {payment.dueAmount})
//                                 </label>
//                                 <input
//                                     type="number"
//                                     className="form-control"
//                                     id={`payment-${index}`}
//                                     value={payment.payingAmount}
//                                     onChange={(e) => handlePaymentChange(index, e.target.value)}
//                                     placeholder="Enter paying amount"
//                                     min="0"
//                                     max={payment.dueAmount}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                     <div className="modal-footer">
//                         <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
//                         <button type="button" className="btn btn-success" onClick={handleSubmit}>Submit</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PaymentModal;


import React, { useEffect, useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ selectedInvoices, onClose, onSubmit }) => {
    const [chequeDetail, setChequeDetail] = useState('');
    const [paymentType, setPaymentType] = useState('cheque');
    const [datedCheque, setDatedCheque] = useState('');
    const [payments, setPayments] = useState(
        selectedInvoices.map(invoice => ({
            invoiceNo: invoice.invoiceNo,
            dueAmount: invoice.totalDue,
            payingAmount: ''
        }))
    );

    useEffect(() => {
        document.body.classList.add('modal-open'); // Prevent scrolling

        return () => {
            document.body.classList.remove('modal-open'); // Restore scrolling
        };
    }, []);

    const handlePaymentChange = (index, value) => {
        const updatedPayments = [...payments];
        updatedPayments[index].payingAmount = value;
        setPayments(updatedPayments);
    };

    const handleSubmit = () => {
        const paymentData = {
            payments,
            chequeDetail,
            paymentType,
            datedCheque: paymentType === 'cheque' ? datedCheque : null
        };
        onSubmit(paymentData);
        onClose();
    };

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Make Payment</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Payment Type Selection */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">Payment Type:</label><br />
                            <div className="form-check form-check-inline">
                                <input
                                    type="radio"
                                    id="cash"
                                    name="paymentType"
                                    value="cash"
                                    checked={paymentType === 'cash'}
                                    onChange={() => setPaymentType('cash')}
                                    className="form-check-input"
                                />
                                <label htmlFor="cash" className="form-check-label">Cash</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    type="radio"
                                    id="cheque"
                                    name="paymentType"
                                    value="cheque"
                                    checked={paymentType === 'cheque'}
                                    onChange={() => setPaymentType('cheque')}
                                    className="form-check-input"
                                />
                                <label htmlFor="cheque" className="form-check-label">Cheque</label>
                            </div>
                        </div>

                        {/* Cheque Details */}
                        {paymentType === 'cheque' && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="chequeDetail" className="form-label fw-bold">Cheque Detail:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="chequeDetail"
                                        value={chequeDetail}
                                        onChange={(e) => setChequeDetail(e.target.value)}
                                        placeholder="Enter cheque details"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="datedCheque" className="form-label fw-bold">Dated Cheque:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="datedCheque"
                                        value={datedCheque}
                                        onChange={(e) => setDatedCheque(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {/* Payment details */}
                        {payments.map((payment, index) => (
                            <div key={index} className="mb-3">
                                <label htmlFor={`payment-${index}`} className="form-label fw-bold">
                                    Invoice No: {payment.invoiceNo} (Due: {payment.dueAmount})
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id={`payment-${index}`}
                                    value={payment.payingAmount}
                                    onChange={(e) => handlePaymentChange(index, e.target.value)}
                                    placeholder="Enter paying amount"
                                    min="0"
                                    max={payment.dueAmount}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-success" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;

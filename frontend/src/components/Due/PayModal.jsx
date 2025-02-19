// import React, { useState } from 'react';
// import './PayModal.css';
// import config from '../../config';

// const PayModal = ({ show, handleClose, invoiceData }) => {
//   const [payingAmount, setPayingAmount] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate all required fields
//     if (!invoiceData.invoiceId || !payingAmount || !invoiceData.cusId) {
//       setError("Missing required fields. Please check all values.");
//       console.log("Debug values:", {
//         invoiceId: invoiceData.invoiceId,
//         payingAmount,
//         cusId: invoiceData.cusId
//       });
//       return;
//     }

//     if (!payingAmount || payingAmount <= 0) {
//       setError("Please enter a valid amount.");
//       return;
//     }

//     if (parseFloat(payingAmount) > parseFloat(invoiceData.dueAmount)) {
//       setError("Paying amount cannot be greater than due amount.");
//       return;
//     }

//     setIsSubmitting(true);
//     setError('');

//     try {
//       const response = await fetch(`${config.BASE_URL}/due/pay/${invoiceData.invoiceId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           payingAmount: parseFloat(payingAmount),
//           cusId: invoiceData.cusId
//         }),
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || data.message || 'Payment failed');
//       }

//       alert('Payment successful');
//       handleClose();
//       window.location.reload();
//     } catch (error) {
//       console.error('Error:', error);
//       setError(error.message || 'Payment failed. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="pay-modal">
//       <div className="pay-modal-content">
//         <h4>Pay Invoice</h4>
//         <div>
//           <p><strong>Invoice Number:</strong> {invoiceData.invoiceNo}</p>
//           <p className='visually-hidden'><strong>Customer ID:</strong> {invoiceData.cusId}</p>  
//           <br />
//           <p><strong>Total Amount:</strong> {invoiceData.totalAmount}</p>
//           <p><strong>Total Paid Amount:</strong> {invoiceData.paidAmount}</p>
//           <p><strong>Total Due Amount:</strong> {invoiceData.dueAmount}</p>
         
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="payingAmount">Paying Amount</label>
//             <input
//               type="number"
//               id="payingAmount"
//               className="form-control"
//               value={payingAmount}
//               onChange={(e) => setPayingAmount(e.target.value)}
//               placeholder="Enter amount"
//               required
//               max={invoiceData.dueAmount}
//               min="0.01"
//               step="0.01"
//               disabled={isSubmitting}
//             />
//           </div>
//           {error && <div className="alert alert-danger mt-2">{error}</div>}
//           <div className="modal-actions">
//             <button 
//               type="button" 
//               className="btn btn-secondary" 
//               onClick={handleClose}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               className="btn btn-success"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Processing...' : 'Submit'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PayModal;


//------------------------------------------------------------------------------------------------------2

// import React, { useState } from 'react';
// import './PayModal.css';
// import config from '../../config';

// const PayModal = ({ show, handleClose, invoiceData }) => {
//   const [payingAmount, setPayingAmount] = useState('');
//   const [payType, setPayType] = useState('cash'); // Default to cash
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate all required fields
//     if (!invoiceData.invoiceId || !payingAmount || !invoiceData.cusId) {
//       setError("Missing required fields. Please check all values.");
//       return;
//     }

//     if (!payingAmount || payingAmount <= 0) {
//       setError("Please enter a valid amount.");
//       return;
//     }

//     if (parseFloat(payingAmount) > parseFloat(invoiceData.dueAmount)) {
//       setError("Paying amount cannot be greater than due amount.");
//       return;
//     }

//     setIsSubmitting(true);
//     setError('');

//     try {
//       const response = await fetch(`${config.BASE_URL}/due/pay/${invoiceData.invoiceId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           payingAmount: parseFloat(payingAmount),
//           cusId: invoiceData.cusId,
//           payType: payType, // Include payment type
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || data.message || 'Payment failed');
//       }

//       alert('Payment successful');
//       handleClose();
//       window.location.reload();
//     } catch (error) {
//       console.error('Error:', error);
//       setError(error.message || 'Payment failed. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="pay-modal">
//       <div className="pay-modal-content">
//         <h4>Pay Invoice</h4>
//         <div>
//           <p><strong>Invoice Number:</strong> {invoiceData.invoiceNo}</p>
//           <p className='visually-hidden'><strong>Customer ID:</strong> {invoiceData.cusId}</p>  
//           <br />
//           <p><strong>Total Amount:</strong> {invoiceData.totalAmount}</p>
//           <p><strong>Total Paid Amount:</strong> {invoiceData.paidAmount}</p>
//           <p><strong>Total Due Amount:</strong> {invoiceData.dueAmount}</p>
//         </div>
//         <form onSubmit={handleSubmit}>

//         <div>
//             <label htmlFor="payType">Payment Type</label>
//             <select
//               id="payType"
//               className="form-control"
//               value={payType}
//               onChange={(e) => setPayType(e.target.value)}
//               required
//               disabled={isSubmitting}
//             >
//               {/* <option value="select">Select Option</option> */}
//               <option value="cash">Cash</option>
//               <option value="cheque">Cheque</option>
//             </select>
//           </div>

//           <div>
//             <label htmlFor="payingAmount">Paying Amount</label>
//             <input
//               type="number"
//               id="payingAmount"
//               className="form-control"
//               value={payingAmount}
//               onChange={(e) => setPayingAmount(e.target.value)}
//               placeholder="Enter amount"
//               required
//               max={invoiceData.dueAmount}
//               min="0.01"
//               step="0.01"
//               disabled={isSubmitting}
//             />
//           </div>
          
//           {error && <div className="alert alert-danger mt-2">{error}</div>}
//           <div className="modal-actions">
//             <button 
//               type="button" 
//               className="btn btn-secondary" 
//               onClick={handleClose}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               className="btn btn-success"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Processing...' : 'Submit'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PayModal;



//--------------------------------------------------------------------------------------------------3

// import React, { useState } from 'react';
// import './PayModal.css';
// import config from '../../config';

// const PayModal = ({ show, handleClose, invoiceData }) => {
//   const [payingAmount, setPayingAmount] = useState('');
//   const [payType, setPayType] = useState(''); // Default to cash
//   const [datedCheque, setDatedCheque] = useState('');
//   const [chequeDetail, setChequeDetail] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate all required fields
//     if (!invoiceData.invoiceId || !payingAmount || !invoiceData.cusId) {
//       setError("Missing required fields. Please check all values.");
//       return;
//     }

//     if (!payingAmount || payingAmount <= 0) {
//       setError("Please enter a valid amount.");
//       return;
//     }

//     if (parseFloat(payingAmount) > parseFloat(invoiceData.dueAmount)) {
//       setError("Paying amount cannot be greater than due amount.");
//       return;
//     }

//     // Additional validation for cheque payments
//     if (payType === 'cheque' && (!datedCheque || !chequeDetail)) {
//       setError("Please fill in all cheque details.");
//       return;
//     }

//     setIsSubmitting(true);
//     setError('');

//     try {
//       const response = await fetch(`${config.BASE_URL}/due/pay/${invoiceData.invoiceId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           payingAmount: parseFloat(payingAmount),
//           cusId: invoiceData.cusId,
//           payType: payType,
//           datedCheque: payType === 'cheque' ? datedCheque : null, // Include cheque details if payment type is cheque
//           chequeDetail: payType === 'cheque' ? chequeDetail : null,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || data.message || 'Payment failed');
//       }

//       alert('Payment successful');
//       handleClose();
//       window.location.reload();
//     } catch (error) {
//       console.error('Error:', error);
//       setError(error.message || 'Payment failed. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="pay-modal">
//       <div className="pay-modal-content">
//         <h4>Pay Invoice</h4>
//         <div>
//           <p><strong>Invoice Number:</strong> {invoiceData.invoiceNo}</p>
//           <p className='visually-hidden'><strong>Customer ID:</strong> {invoiceData.cusId}</p>  
//           <br />
//           <p><strong>Total Amount:</strong> {invoiceData.totalAmount}</p>
//           <p><strong>Total Paid Amount:</strong> {invoiceData.paidAmount}</p>
//           <p><strong>Total Due Amount:</strong> {invoiceData.dueAmount}</p>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="payingAmount">Paying Amount</label>
//             <input
//               type="number"
//               id="payingAmount"
//               className="form-control"
//               value={payingAmount}
//               onChange={(e) => setPayingAmount(e.target.value)}
//               placeholder="Enter amount"
//               required
//               max={invoiceData.dueAmount}
             
//               disabled={isSubmitting}
//             />
//           </div>
//           {/* <div>
//             <label htmlFor="payType">Payment Type</label>
//             <select
//               id="payType"
//               className="form-control"
//               value={payType}
//               onChange={(e) => setPayType(e.target.value)}
//               required
//               disabled={isSubmitting}
//             >
//               <option value="cash">Cash</option>
//               <option value="cheque">Cheque</option>
//             </select>
//           </div> */}

// <div>
//   <label htmlFor="payType">Select Payment Type</label>
//   <select
//     id="payType"
//     className="form-control"
//     value={payType}
//     onChange={(e) => setPayType(e.target.value)}
//     required
//     disabled={isSubmitting}
//   >
//     <option selected >
//       -- Select Payment Type --
//     </option>
//     <option value="cash">Cash</option>
//     <option value="cheque">Cheque</option>
//   </select>
// </div>


//           {payType === 'cheque' && (
//             <>
//               <div>
//                 <label htmlFor="datedCheque">Dated Cheque</label>
//                 <input
//                   type="date"
//                   id="datedCheque"
//                   className="form-control"
//                   value={datedCheque}
//                   onChange={(e) => setDatedCheque(e.target.value)}
//                   required
//                   disabled={isSubmitting}
//                 />
//               </div>
//               <div>
//                 <label htmlFor="chequeDetail">Cheque Detail</label>
//                 <input
//                   type="text"
//                   id="chequeDetail"
//                   className="form-control"
//                   value={chequeDetail}
//                   onChange={(e) => setChequeDetail(e.target.value)}
//                   placeholder="Enter cheque details"
//                   required
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </>
//           )}
//           {error && <div className="alert alert-danger mt-2">{error}</div>}
//           <div className="modal-actions">
//             <button 
//               type="button" 
//               className="btn btn-secondary" 
//               onClick={handleClose}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               className="btn btn-success"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Processing...' : 'Submit'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PayModal;


import React, { useState } from 'react';
import './PayModal.css'; // Ensure you have this CSS file
import config from '../../config';

const PayModal = ({ show, handleClose, invoiceData }) => {
  const [payingAmount, setPayingAmount] = useState('');
  const [payType, setPayType] = useState('cash'); // Default to cash
  const [datedCheque, setDatedCheque] = useState('');
  const [chequeDetail, setChequeDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handler for payment type change
  const handlePaymentTypeChange = (e) => {
    const selectedType = e.target.value;
    setPayType(selectedType);
    // Reset cheque details if payment type is not cheque
    if (selectedType !== 'cheque') {
      setDatedCheque('');
      setChequeDetail('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!invoiceData.invoiceId || !payingAmount || !invoiceData.cusId) {
      setError("Missing required fields. Please check all values.");
      return;
    }

    if (!payingAmount || payingAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (parseFloat(payingAmount) > parseFloat(invoiceData.dueAmount)) {
      setError("Paying amount cannot be greater than due amount.");
      return;
    }

    // Additional validation for cheque payments
    if (payType === 'cheque' && (!datedCheque || !chequeDetail)) {
      setError("Please fill in all cheque details.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${config.BASE_URL}/due/pay/${invoiceData.invoiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          payingAmount: parseFloat(payingAmount),
          cusId: invoiceData.cusId,
          payType: payType,
          datedCheque: payType === 'cheque' ? datedCheque : null, // Include cheque details if payment type is cheque
          chequeDetail: payType === 'cheque' ? chequeDetail : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Payment failed');
      }

      alert('Payment successful');
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="pay-modal-overlay">
      <div className="pay-modal">
        <div className="pay-modal-content">
          <h4>Pay Invoice</h4>
          <div className="invoice-details">
            <p><strong>Invoice Number:</strong> {invoiceData.invoiceNo}</p>
            <p className='visually-hidden'><strong>Customer ID:</strong> {invoiceData.cusId}</p>  
            <br />
            <p><strong>Total Amount:</strong> {invoiceData.totalAmount}</p>
            <p><strong>Total Paid Amount:</strong> {invoiceData.paidAmount}</p>
            <p><strong>Total Due Amount:</strong> {invoiceData.dueAmount}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="payingAmount">Paying Amount</label>
              <input
                type="number"
                id="payingAmount"
                className="form-control"
                value={payingAmount}
                onChange={(e) => setPayingAmount(e.target.value)}
                placeholder="Enter amount"
                required
                max={invoiceData.dueAmount}
                disabled={isSubmitting}
              />
            </div>

            {/* Payment Type Selection */}
            <div className="payment-details">
              <div className="payment-details-amount">
                <input
                  type="radio"
                  name="payType"
                  id="cash"
                  value="cash"
                  checked={payType === 'cash'}
                  onChange={handlePaymentTypeChange}
                  disabled={isSubmitting}
                  className="payment-method"
                />
                <label htmlFor="cash" id="label" className="payment-card">
                  Cash Payment
                </label>
              </div>
              <div className="payment-details-amount">
                <input
                  type="radio"
                  name="payType"
                  id="cheque"
                  value="cheque"
                  checked={payType === 'cheque'}
                  onChange={handlePaymentTypeChange}
                  disabled={isSubmitting}
                  className="payment-method"
                />
                <label htmlFor="cheque" id="label" className="payment-card">
                  Cheque Payment
                </label>
              </div>
            </div>

            {/* Cheque Details (Conditional Rendering) */}
            {payType === 'cheque' && (
              <div className="cheque-details">
                <div className="form-group">
                  <label htmlFor="datedCheque">Dated Cheque</label>
                  <input
                    type="date"
                    id="datedCheque"
                    className="form-control"
                    value={datedCheque}
                    onChange={(e) => setDatedCheque(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="chequeDetail">Cheque Detail</label>
                  <input
                    type="text"
                    id="chequeDetail"
                    className="form-control"
                    value={chequeDetail}
                    onChange={(e) => setChequeDetail(e.target.value)}
                    placeholder="Enter cheque details"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            {error && <div className="alert alert-danger mt-2">{error}</div>}
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayModal;
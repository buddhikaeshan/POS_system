import React, { useState, useEffect } from 'react';
import config from '../../config';

function StockPaymentModel({ showModal, closeModal, onSave, stockPayment }) {
    const [error, setError] = useState(null);
    const [chequeDetails, setChequeDetails] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        chequeAmount: '',
        cashAmount: '',
        total: '',
        due: '',

        payment: '',
    });

    useEffect(() => {
        if (stockPayment) {
            setFormData({
                name: stockPayment.supplier?.supplierName || '-',
                chequeAmount: stockPayment.chequeAmount || '0',
                cashAmount: stockPayment.cashAmount || '0',
                total: stockPayment.total || '0',
                due: stockPayment.due || '0',
                date: '',
                payment: '',
            });
        }
    }, [stockPayment]);

    useEffect(() => {
        const totalChequeAmount = chequeDetails.reduce(
            (sum, detail) => sum + (parseFloat(detail.chequeAmounts) || 0),
            0
        );

        const initialCashAmount = parseFloat(stockPayment?.cashAmount) || 0;
        const payment = parseFloat(formData.payment) || 0;
        const initialDue = parseFloat(stockPayment?.due) || 0;

        setFormData((prevData) => ({
            ...prevData,
            chequeAmount: totalChequeAmount.toFixed(2),
            cashAmount: (initialCashAmount + payment).toFixed(2),
            due: (initialDue - payment - totalChequeAmount).toFixed(2),
        }));

    }, [chequeDetails, formData.payment, stockPayment?.cashAmount, stockPayment?.due]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value,
            };

            if (name === "payment" || name === "cashAmount") {
                const totalChequeAmount = chequeDetails.reduce(
                    (sum, detail) => sum + (parseFloat(detail.chequeAmounts) || 0),
                    0
                );

                const cashAmount = parseFloat(updatedData.cashAmount) || 0;
                const payment = parseFloat(updatedData.payment) || 0;

                const totalPaid = totalChequeAmount + cashAmount;

                updatedData.due = (totalPaid - payment).toFixed(2);
            }

            return updatedData;
        });
    };

    const handleAddChequeField = () => {
        setChequeDetails((prevDetails) => [
            ...prevDetails,
            { chequeNumber: '', chequeAmounts: '', chequeDate: '' },
        ]);
    };

    const handleDynamicFieldChange = (index, name, value) => {
        setChequeDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index][name] = value;
            return updatedDetails;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { payment, chequeAmount, cashAmount } = formData;
            const stockPaymentId = stockPayment?.stockPaymentId;

            // Function to get the current Sri Lankan time
            const getSriLankanTime = () => {
                const now = new Date();
                const sriLankanOffset = 5.5 * 60 * 60 * 1000;
                const sriLankanTime = new Date(now.getTime() + sriLankanOffset);
                return sriLankanTime.toISOString().slice(0, 16);
            };

            if (payment > 0) {
                // Step 1: Create Supplier Payment
                const supplierPaymentResponse = await fetch(`${config.BASE_URL}/supplierPayment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        payDate: getSriLankanTime(),
                        payAmount: payment,
                        stockPaymentId,
                    }),
                });

                if (!supplierPaymentResponse.ok) {
                    const error = await supplierPaymentResponse.json();
                    throw new Error(error.message || 'Failed to create supplier payment.');
                }

                const supplierPaymentData = await supplierPaymentResponse.json();
                console.log('Supplier Payment Created:', supplierPaymentData);
            } else {
                console.log("Skipping Supplier Payment Creation as payment is 0 or condition not met");
            }

            // Step 2: Add Cheque Details (if applicable)
            if (chequeDetails.length > 0) {
                const chequeResponse = await fetch(`${config.BASE_URL}/cheque`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        chequeDetails.map((cheque) => ({
                            chequeNumber: cheque.chequeNumber,
                            chequeAmount: cheque.chequeAmounts,
                            issuedDate: getSriLankanTime(),
                            chequeDate: cheque.chequeDate,
                            supplierId: stockPayment.supplierId,
                            stockPaymentId,
                        }))
                    ),
                });

                if (!chequeResponse.ok) {
                    const error = await chequeResponse.json();
                    throw new Error(error.message || 'Failed to add cheque details.');
                }

                const chequeData = await chequeResponse.json();
                console.log('Cheques Added:', chequeData);
            }

            // Step 3: Update Stock Payment
            const stockPaymentResponse = await fetch(`${config.BASE_URL}/stockPayment/${stockPaymentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chequeAmount,
                    cashAmount,
                    due: formData.due,
                    stockPayDate: getSriLankanTime(),
                }),
            });

            if (!stockPaymentResponse.ok) {
                const error = await stockPaymentResponse.json();
                throw new Error(error.message || 'Failed to update stock payment.');
            }

            const stockPaymentData = await stockPaymentResponse.json();
            console.log('Stock Payment Updated:', stockPaymentData);

            onSave({ ...formData, chequeDetails });
            closeModal();
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err.message);
        }
    };



    if (!showModal) return null;

    return (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "5%", zIndex: 1000, }}>
            <div className="p-3" style={{ position: "relative", background: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", width: "50%", maxHeight: "85%", padding: "20px", overflowY: "auto", }}>
                <h4>Supplier Payment</h4>
                {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="mt-2">

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="supplierName">Supplier Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="supplierName"
                                name="name"
                                value={formData.name}
                                disabled
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="total">Total</label>
                            <input
                                type="text"
                                className="form-control"
                                id="total"
                                name="total"
                                value={formData.total}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="due">Due</label>
                            <input
                                type="text"
                                className="form-control"
                                id="due"
                                name="due"
                                value={formData.due}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="chequeAmount">Cheque Amount</label>
                            <input
                                type="number"
                                className="form-control"
                                id="chequeAmount"
                                name="chequeAmount"
                                value={formData.chequeAmount}
                                onChange={handleChange}
                                disabled
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="cashAmount">Cash Amount</label>
                            <input
                                type="number"
                                className="form-control"
                                id="cashAmount"
                                name="cashAmount"
                                value={formData.cashAmount}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="payment">Payment</label>
                            <input
                                type="number"
                                className="form-control"
                                id="payment"
                                name="payment"
                                value={formData.payment}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mb-3">
                        <button type="button" className="btn btn-primary btn-md" onClick={handleAddChequeField} >
                            Add Cheques
                        </button>
                    </div>

                    {chequeDetails.map((detail, index) => (
                        <div className="row mb-4" key={index}>
                            <div className="col-md-4">
                                <label className="form-label">Cheque Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="chequeNumber"
                                    value={detail.chequeNumber}
                                    onChange={(e) =>
                                        handleDynamicFieldChange(index, 'chequeNumber', e.target.value)
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Cheque Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="chequeAmounts"
                                    value={detail.chequeAmounts}
                                    onChange={(e) =>
                                        handleDynamicFieldChange(index, 'chequeAmounts', e.target.value)
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Cheque Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="chequeDate"
                                    value={detail.chequeDate}
                                    onChange={(e) =>
                                        handleDynamicFieldChange(index, 'chequeDate', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    ))}

                    <div className="modal-footer d-flex">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="btn btn-warning"
                        >
                            {stockPayment ? 'Pay' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}

export default StockPaymentModel;

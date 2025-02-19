import React, { useEffect, useState } from 'react'

function DueCusForm({ closeModal, showModal, onSave, transaction }) {
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        cusName: "",
        cusCode: "",
        amount: "",
        due: "",
        paidAmount: "",
        payment: "",
    });

    useEffect(() => {
        if (transaction) {
            setFormData({
                cusName: transaction.cusName || "",
                cusCode: transaction.cusCode || "",
                paidAmount: transaction.paidAmount || "0",
                amount: transaction.amount || "0",
                due: transaction.due || "0",
                payment: "",
            });
        }
    }, [transaction]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => {
            let updatedData = { ...prevFormData, [name]: value };

            if (name === "payment") {
                const paymentValue = parseFloat(value) || 0;
                const initialAmount = parseFloat(transaction.paidAmount) || 0;
                const initialDue = parseFloat(transaction.due) || 0;

                updatedData.paidAmount = (initialAmount + paymentValue).toFixed(2);
                updatedData.due = (initialDue - paymentValue).toFixed(2);
            }
            return updatedData;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.payment || isNaN(formData.payment)) {
            setError("Please enter a valid payment amount");
            return;
        }
        onSave({
            ...transaction,
            amount: parseFloat(formData.amount),
            due: parseFloat(formData.due),
        });
    };

    return (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "150px", zIndex: 1000, }}>
            <div className="p-3" style={{ background: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", width: "100%", maxWidth: "400px", padding: "20px" }}>
                {error && <p className="error">{error}</p>}
                <h4>Due Payment</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="cusName">Customer Name</label>
                        <input type="text" className="form-control" value={formData.cusName} onChange={handleChange} name="cusName" id="cusName" disabled />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cusCode">Customer Code</label>
                        <input type="text" className="form-control" value={formData.cusCode} onChange={handleChange} name="cusCode" id="cusCode" disabled />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Total Amount</label>
                        <input type="number" className="form-control" value={formData.amount} onChange={handleChange} name="amount" id="amount" disabled />
                    </div>
                    <div className="form-group">
                        <label htmlFor="paidAmount">Paid Amount</label>
                        <input type="number" className="form-control" value={formData.paidAmount} onChange={handleChange} name="paidAmount" id="paidAmount" disabled />
                    </div>
                    <div className="form-group">
                        <label htmlFor="due">Due Amount</label>
                        <input type="number" className="form-control" value={formData.due} onChange={handleChange} name="due" id="due" disabled />
                    </div>
                    <div className="form-group">
                        <label htmlFor="payment">Payment </label>
                        <input type="number" className="form-control" value={formData.payment} onChange={handleChange} name="payment" id="payment" />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" style={{ backgroundColor: "red", color: "white", borderRadius: "nome", padding: "10px ,20px ", }} onClick={closeModal}>Close</button>
                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: "yellow", color: "black", borderRadius: "nome", padding: "10px ,20px ", }}>Save Changes</button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default DueCusForm
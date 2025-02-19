import React, { useEffect, useState } from 'react'
import Table from '../../components/Table/Table'
import config from '../../config';
import { X } from 'lucide-react';

function AllSupplierPayments({ closeModal, showModal, supplierName, supplierId }) {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const columns = ['Stock Qty', 'Stock Total', 'CashAmount', 'Cheque Amount', 'Payment Date', 'Due', 'Stock Pay Status'];

    useEffect(() => {
        if (showModal && supplierId) {
            fetchSupplierPayments(supplierId);
        }
    }, [showModal, supplierId]);

    const fetchSupplierPayments = async (supplierId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/stockPayments/${supplierId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch supplier payments: ${response.status} ${response.statusText}`);
            }
            const payments = await response.json();

            const formattedData = await Promise.all(payments.map(async (payment) => {
                const stockPayDate = new Date(payment.stockPayDate);
                const formattedStockPayDate = `${stockPayDate.getFullYear()}-${String(stockPayDate.getMonth() + 1).padStart(2, '0')}-${String(stockPayDate.getDate()).padStart(2, '0')} ${String(stockPayDate.getHours()).padStart(2, '0')}:${String(stockPayDate.getMinutes()).padStart(2, '0')}`;

                // Auto-update to "Paid" if due is 0 and the status isn't already "Paid"
                if (payment.due === 0 && payment.stockPaymentStatus !== "Paid") {
                    await handleStatusChange(payment.stockPaymentId, "Paid");
                }

                return {
                    stockPaymentId: payment.stockPaymentId,
                    stockQty: payment.stockQty,
                    total: payment.total,
                    cashAmount: payment.cashAmount,
                    chequeAmount: payment.chequeAmount,
                    formattedStockPayDate,
                    due: payment.due,
                    stockPaymentStatus: payment.due === 0 ? "Paid" : payment.stockPaymentStatus,
                };
            }));

            const sortedData = formattedData.sort((a, b) => (a.due === 0) - (b.due === 0));

            const tableData = sortedData.map((item) => [
                item.stockQty,
                item.total,
                item.cashAmount,
                item.chequeAmount,
                item.formattedStockPayDate,
                item.due,
                <span style={{ color: item.stockPaymentStatus === "Paid" ? "green" : "red", fontWeight: "bold" }}>
                    {item.stockPaymentStatus}
                </span>
            ]);

            setData(tableData);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching payments.');
        }
    };

    const handleStatusChange = async (stockPaymentId, newStatus) => {
        try {
            const response = await fetch(`${config.BASE_URL}/stockPayment/${stockPaymentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stockPaymentStatus: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update payment status');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    if (!showModal) return null;

    const title = `Stock Payment History - ${supplierName || 'unknown'}`;
    const invoice = 'Supplier Payment History.pdf';

    return (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "5%", zIndex: 1000, }}>
            <div className="p-3" style={{ position: "relative", background: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", width: "50%", maxHeight: "85%", padding: "20px", overflowY: "auto", }}>
                <button onClick={closeModal} style={{ position: "absolute", top: "-20px", right: "20px", background: "transparent", border: "none", fontSize: "50px", cursor: "pointer", color: "red", }} aria-label="Close" >  <X /> </button>
                <h4>Payment History Of {supplierName || 'unknown'}</h4>
                <div className='mt-3'>
                    <Table
                        search="Search by Stock Name"
                        data={data}
                        columns={columns}
                        showButton={false}
                        showDate={true}
                        title={title}
                        invoice={invoice}
                        showActions={false}
                        showDelete={false}
                    />
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" style={{ backgroundColor: "red", color: "white", borderRadius: "nome", padding: "10px ,20px ", }} onClick={closeModal}>Close</button>
                </div>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div >
    )
}

export default AllSupplierPayments
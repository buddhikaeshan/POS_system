import React, { useEffect, useState } from "react";
import config from "../../config";
import Table from "../Table/Table";
import DueCusForm from "../../Models/Form/DueCusForm";

function DueCustomer() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const columns = [
        "#",
        "Customer Code",
        "Customer Name",
        "Payment Date",
        "Payment Type",
        "Price",
        "Paid Amount",
        "Due Payment",
    ];

    useEffect(() => {
        fetchDueCustomer();
    }, []);

    const fetchDueCustomer = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/transactions`);
            if (!response.ok) throw new Error("Failed to fetch Due Customer list");

            const transactions = await response.json();

            const filteredTransactions = transactions.filter((transaction) => transaction.due > 0);

            const formattedData = filteredTransactions.map((transaction) => {
                const dateTime = new Date(transaction.dateTime);
                const formattedDate = `${dateTime.getFullYear()}-${String(dateTime.getMonth() + 1).padStart(2, '0')}-${String(dateTime.getDate()).padStart(2, '0')} ${String(dateTime.getHours()).padStart(2, '0')}:${String(dateTime.getMinutes()).padStart(2, '0')}`;

                return [
                    transaction.transactionId,
                    transaction.customer?.cusCode || "-",
                    transaction.customer?.cusName || "-",
                    formattedDate,
                    transaction.transactionType,
                    transaction.price,
                    transaction.paid,
                    transaction.due,
                ];
            });

            setData(formattedData);
        } catch (err) {
            setError(err.message);
            console.error(err.message);
        }
    };


    const handleEdit = (rowIndex) => {
        const selectedRow = data[rowIndex];
        setSelectedTransaction({
            transactionId: selectedRow[0],
            cusCode: selectedRow[1],
            cusName: selectedRow[2],
            dateTime: selectedRow[3],
            transactionType: selectedRow[4],
            paidAmount: selectedRow[6],
            amount: selectedRow[5],
            due: selectedRow[7],
        });
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedTransaction(null);
    };

    const handleSave = async (updatedTransaction) => {
        try {
            const updatedData = {
                paid: updatedTransaction.amount,
                due: updatedTransaction.due,
            };

            const response = await fetch(
                `${config.BASE_URL}/transaction/${updatedTransaction.transactionId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedData),
                }
            );

            if (!response.ok) throw new Error("Failed to update the transaction");

            console.log("Updated Transaction:", await response.json());
            fetchDueCustomer();
            setShowModal(false);
        } catch (error) {
            console.error("Error updating transaction:", error.message);
        }
    };

    const title = "Due Customer List";
    const invoice = "dueCustomer_list.pdf";

    return (
        <div>
            <div className="scrolling-container">
                <h4>Customer List</h4>
                <Table
                    data={data}
                    columns={columns}
                    showButton={false}
                    onEdit={handleEdit}
                    showDate={false}
                    showDelete={false}
                    title={title}
                    invoice={invoice}
                />
            </div>
            {showModal && (
                <DueCusForm
                    closeModal={handleModalClose}
                    onSave={handleSave}
                    transaction={selectedTransaction}
                />
            )}
        </div>
    );
}

export default DueCustomer;

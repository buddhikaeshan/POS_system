import React, { useEffect, useState } from 'react';
import Table from '../Table/Table';
import config from '../../config';

function SupplierChequePayments() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState(null);
    const [pendingChequeAmount, setPendingChequeAmount] = useState(0);
    const [clearedChequeAmount, setClearedChequeAmount] = useState(0);
    const [pendingChequeCount, setPendingChequeCount] = useState(0);
    const [statusFilter, setStatusFilter] = useState('all');

    const columns = ['Date of Issue', 'Date of the Cheque', 'Supplier Name', 'Cheque Number', 'Cheque Amount', 'Cheque Status'];

    useEffect(() => {
        fetchChequeList();
        fetchPendingChequeCount();
    },);

    useEffect(() => {
        filterData();
    }, [statusFilter, data]);

    const filterData = () => {
        if (statusFilter === 'all') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(row =>
                // Change row[6] to row[5] - status is in the 6th column (index 5)
                row[5].props.value === statusFilter
            );
            setFilteredData(filtered);
        }
    };

    const fetchChequeList = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/cheques`);
            if (!response.ok) throw new Error(`Failed to fetch cheques: ${response.status}`);
            const cheques = await response.json();

            const updatePromises = cheques.map(async (cheque) => {
                if (cheque.chequeStatus === "Pending") {
                    const chequeDate = new Date(cheque.chequeDate);
                    const today = new Date();

                    chequeDate.setHours(0, 0, 0, 0);
                    const twoDaysLater = new Date(chequeDate);
                    twoDaysLater.setDate(chequeDate.getDate() + 2);

                    today.setHours(0, 0, 0, 0);

                    if (today > twoDaysLater) {
                        try {
                            await fetch(`${config.BASE_URL}/cheque/${cheque.chequeId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ chequeStatus: "Cleared" })
                            });
                        } catch (error) {
                            console.error("Update failed:", error);
                        }
                    }
                }
            });

            await Promise.all(updatePromises);

            const updatedResponse = await fetch(`${config.BASE_URL}/cheques`);
            if (!updatedResponse.ok) throw new Error('Failed to fetch updated cheques');
            const updatedCheques = await updatedResponse.json();

            const sortedCheques = [...updatedCheques].sort((a, b) => {
                if (a.chequeStatus === "Cleared" && b.chequeStatus !== "Cleared") return 1;
                if (a.chequeStatus !== "Cleared" && b.chequeStatus === "Cleared") return -1;
                return new Date(a.chequeDate) - new Date(b.chequeDate);
            });


            const formattedData = sortedCheques.map((cheque) => {

                const issuedDate = new Date(cheque.issuedDate);
                const formattedIssuedDate = `${issuedDate.getFullYear()}-${String(issuedDate.getMonth() + 1).padStart(2, '0')}-${String(issuedDate.getDate()).padStart(2, '0')} ${String(issuedDate.getHours()).padStart(2, '0')}:${String(issuedDate.getMinutes()).padStart(2, '0')}`;

                const chequeDate = new Date(cheque.chequeDate);
                const formattedChequeDate = `${chequeDate.getFullYear()}-${String(chequeDate.getMonth() + 1).padStart(2, '0')}-${String(chequeDate.getDate()).padStart(2, '0')}`;

                return [
                    // cheque.chequeId || '-',  
                    formattedIssuedDate || '-',
                    formattedChequeDate || '-',
                    cheque.supplier?.supplierName || '-',
                    cheque.chequeNumber || '-',
                    `LKR ${Number(cheque.chequeAmount).toLocaleString()}`,
                    <select
                        className="form-control"
                        value={cheque.chequeStatus}
                        onChange={(e) => handleStatusChange(cheque.chequeId, e.target.value)}
                        disabled={cheque.chequeStatus === "Cleared"}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Cleared">Cleared</option>
                    </select>,
                ]
            });

            setData(formattedData);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleStatusChange = async (chequeId, newStatus) => {
        try {
            const response = await fetch(`${config.BASE_URL}/cheque/${chequeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chequeStatus: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update cheque status');
            }
            fetchChequeList();
            fetchPendingChequeCount();
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchPendingChequeCount = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/countCheques`);
            if (!response.ok) {
                throw new Error('Failed to fetch pending cheque count');
            }
            const result = await response.json();
            setPendingChequeCount(result.count);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const fetchChequeData = async () => {
            try {
                const pendingResponse = await fetch(`${config.BASE_URL}/pendingChequeTotal`);
                const clearedResponse = await fetch(`${config.BASE_URL}/clearedChequeTotal`);

                if (!pendingResponse.ok || !clearedResponse.ok) {
                    throw new Error('Failed to fetch cheque amounts');
                }

                const pendingResult = await pendingResponse.json();
                const clearedResult = await clearedResponse.json();

                setPendingChequeAmount(pendingResult.totalAmount || 0);
                setClearedChequeAmount(clearedResult.totalAmount || 0);
            } catch (error) {
                console.error('Error fetching cheque data:', error);
            }
        };

        fetchChequeData();
    },);

    return (
        <div>
            <div className="scrolling-container">
                <div className="mt-4">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: "20px" }}>
                        <div style={{ paddingLeft: "10px", width: "100%" }}>

                            <h4 style={{ marginBottom: "24px", fontSize: "24px", color: "#2d3436", fontWeight: "600" }}>
                                Cheques Drawn
                            </h4>

                            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "nowrap", overflowX: "auto", paddingBottom: "10px" }}>

                                <div style={{ flex: "0 0 240px", backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                                    <div style={{ fontSize: "14px", color: "#636e72", marginBottom: "8px" }}>Filter</div>
                                    <select style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #dfe6e9", fontSize: "14px", backgroundColor: "#f8f9fa", outline: "none", cursor: "pointer" }}
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all">All Cheques</option>
                                        <option value="Pending">Pending Cheques</option>
                                        <option value="Cleared">Cleared Cheques</option>
                                    </select>
                                </div>

                                <div style={{ flex: "1", backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", minWidth: "220px" }}>
                                    <div style={{ fontSize: "14px", color: "#636e72", marginBottom: "12px" }}>Cheques To Be Honoured</div>
                                    <input
                                        type="text"
                                        style={{ width: "100%", padding: "12px", fontSize: "18px", fontWeight: "600", color: "#2ecc71", border: "none", backgroundColor: "transparent", textAlign: "right" }}
                                        value={pendingChequeCount}
                                        disabled
                                    />
                                </div>

                                <div style={{ flex: "1", backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", minWidth: "220px" }}>
                                    <div style={{ fontSize: "14px", color: "#636e72", marginBottom: "12px" }}>Pending Cheque Amount</div>
                                    <input
                                        type="text"
                                        style={{ width: "100%", padding: "12px", fontSize: "18px", fontWeight: "600", color: "#2ecc71", border: "none", backgroundColor: "transparent", textAlign: "right" }}
                                        value={`LKR ${pendingChequeAmount.toLocaleString()}`}
                                        disabled
                                    />
                                </div>

                                <div style={{ flex: "1", backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", minWidth: "220px" }}>
                                    <div style={{ fontSize: "14px", color: "#636e72", marginBottom: "12px" }}>Cleared Cheque Amount</div>
                                    <input
                                        type="text"
                                        style={{ width: "100%", padding: "12px", fontSize: "18px", fontWeight: "600", color: "#2ecc71", border: "none", backgroundColor: "transparent", textAlign: "right" }}
                                        value={`LKR ${clearedChequeAmount.toLocaleString()}`}
                                        disabled
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <Table
                    search="Search by Supplier Name"
                    data={filteredData}
                    columns={columns}
                    showButton={false}
                    showDate={true}
                    showActions={false}
                    showDelete={false}
                />
            </div>
        </div>
    );
}

export default SupplierChequePayments;
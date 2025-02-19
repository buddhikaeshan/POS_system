import React, { useEffect, useState } from 'react';
import config from '../../config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useLocation, useParams } from 'react-router';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SupplierVisePayments() {
    const { supplierId } = useParams();
    const location = useLocation();
    const { supplierName } = location.state || { supplierName: 'Unknown Supplier' };

    const [totalChequeAmount, setTotalChequeAmount] = useState(0);
    const [dueAmount, setDueAmount] = useState(0);
    const [dueCount, setDueCount] = useState(0);
    const [error, setError] = useState(null);
    const [stocksGrouped, setStocksGrouped] = useState([]);
    const [cheques, setCheques] = useState([]);
    const [showPaidInvoices, setShowPaidInvoices] = useState(true);
    const [showUnpaidInvoices, setShowUnpaidInvoices] = useState(true);
    const [showPayments, setShowPayments] = useState(true);
    const [groupedData, setGroupedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [payStatus, setPayStatus] = useState({});

    useEffect(() => {
        if (supplierId) {
            fetchStocksBySupplier(supplierId);
            fetchDueAmount(supplierId);
            fetchChequeAmount(supplierId);
            fetchDueAmountCount(supplierId);
            fetchCheques(supplierId);
        }
    }, [supplierId]);

    const fetchCheques = async (supplierId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/cheques/supplier/${supplierId}`);
            if (!response.ok) throw new Error("Failed to fetch cheques");
            const data = await response.json();
            setCheques(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchStocksBySupplier = async (supplier_supplierId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/stock/supplier/${supplier_supplierId}`);
            if (!response.ok) throw new Error('Failed to fetch stocks');
            const stocks = await response.json();

            const grouped = {};

            for (const stock of stocks) {
                await fetchSupplier(stock.stockId, grouped);
                console.log("StockID", stock.stockId);
                fetchStockPayment(stock.stockId);
            }

            setGroupedData(Object.entries(grouped));
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchStockPayment = async (stockId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/stockPayment/stock/${stockId}`);
            if (!response.ok) throw new Error('Failed to fetch stock payment');
            const stockPayments = await response.json();

            console.log("Fetched Stock Payments: ", stockPayments);

            if (stockPayments.length > 0) {
                const latestPayment = stockPayments[stockPayments.length - 1];
                console.log("Latest Payment Status: ", latestPayment.stockPaymentStatus);

                setPayStatus(prevStatus => {
                    const updatedStatus = {
                        ...prevStatus,
                        [stockId]: latestPayment.stockPaymentStatus || 'Unpaid'
                    };
                    console.log("Updated Pay Status: ", updatedStatus);
                    return updatedStatus;
                });
            } else {
                setPayStatus(prevStatus => ({
                    ...prevStatus,
                    [stockId]: 'Unpaid'
                }));
            }
        } catch (error) {
            console.error("Error fetching stock payment:", error);
            setPayStatus(prevStatus => ({
                ...prevStatus,
                [stockId]: 'Unpaid'
            }));
        }
    };

    const fetchSupplier = async (stockId, grouped) => {
        try {
            const response = await fetch(`${config.BASE_URL}/invoiceProduct/stock/${stockId}`);
            if (!response.ok) throw new Error('Failed to fetch data');
            const invoiceProducts = await response.json();

            for (const item of invoiceProducts) {
                const date = new Date(item.stock.stockDate).toLocaleDateString('en-GB');

                if (!grouped[date]) grouped[date] = { items: [], total: 0 };

                const total = item.invoiceQty * item.stock.unitPrice;

                let customerName = "Unknown Customer";
                if (item.invoice?.invoiceId) {
                    const invoiceData = await fetchInvoice(item.invoice.invoiceId);
                    customerName = invoiceData?.customerName || "Unknown Customer";
                }

                grouped[date].items.push({
                    product: item.product?.productName || "Unknown Product",
                    qty: item.invoiceQty,
                    unitRate: item.stock.unitPrice,
                    total: total,
                    customer: customerName,
                    stock: item.stockId,
                });

                grouped[date].total += total;
            }
        } catch (error) {
            setError(error.message || "Error fetching payments");
        }
    };

    const fetchInvoice = async (invoiceId) => {
        if (!invoiceId) {
            setError('Invalid invoice ID');
            return null;
        }

        try {
            const invoiceResponse = await fetch(`${config.BASE_URL}/invoice/${invoiceId}`);
            if (!invoiceResponse.ok) throw new Error('Failed to fetch invoice data');
            const invoice = await invoiceResponse.json();

            const cusId = invoice.cusId;

            if (!cusId) {
                return { customerName: 'Unknown Customer' };
            }

            const customerResponse = await fetch(`${config.BASE_URL}/customer/${cusId}`);
            if (!customerResponse.ok) throw new Error('Failed to fetch customer data');
            const customer = await customerResponse.json();

            return {
                customerName: customer.cusName || 'Unknown Customer'
            };

        } catch (error) {
            setError(error.message || 'Error fetching invoice');
            return null;
        }
    };

    const formatCurrency = (value) =>
        Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 });

    const fetchChequeAmount = async (supplierId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/cheques/pendingTotal/${supplierId}`);
            const data = await response.json();
            setTotalChequeAmount(data.totalAmount);
        } catch (error) {
            console.error('Error fetching dated cheques amount:', error);
            return 0;
        }
    };

    const fetchDueAmount = async (supplierId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/stockPayments/totalDues/${supplierId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch unpaid invoice amount');
            }
            const result = await response.json();
            setDueAmount(result.totalDue);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchDueAmountCount = async (supplierId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/stockPayments/duePayments/${supplierId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch unpaid invoices');
            }
            const result = await response.json();
            setDueCount(result.unpaidInvoices);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const merged = {};

        stocksGrouped.forEach(([date, group]) => {
            merged[date] = { ...group, items: [...group.items] };
        });

        cheques.forEach((cheque) => {
            const date = new Date(cheque.chequeDate).toLocaleDateString("en-GB");
            if (!merged[date]) merged[date] = { items: [], total: 0 };
            merged[date].items.push({
                type: "cheque",
                chequeDate: cheque.chequeDate,
                chequeNo: cheque.chequeNumber,
                amount: cheque.chequeAmount,
            });

            merged[date].total -= cheque.chequeAmount;
        });

        const sorted = Object.entries(merged).sort((a, b) => {
            const dateA = new Date(a[0].split("/").reverse().join("-"));
            const dateB = new Date(b[0].split("/").reverse().join("-"));
            return dateB - dateA;
        });

        setGroupedData(sorted);
    }, [stocksGrouped, cheques]);


    const calculateCumulativeBalance = () => {
        let cumulativeBalance = 0;
        const updatedGroupedData = groupedData.map(([date, group]) => {
            cumulativeBalance += group.total;
            return [date, { ...group, cumulativeBalance }];
        });
        return updatedGroupedData;
    };

    const groupedDataWithBalance = calculateCumulativeBalance();

    const getChequeBalance = (chequeDate, chequeAmount, currentIndex) => {
        const purchaseBalance = groupedDataWithBalance.reduce((maxBalance, [date, group]) => {
            const currentDate = new Date(date.split('/').reverse().join('-')).getTime();
            const checkDate = new Date(chequeDate).getTime();

            if (currentDate <= checkDate && group.cumulativeBalance > maxBalance) {
                return group.cumulativeBalance;
            }
            return maxBalance;
        }, 0);

        const previousChequesTotal = cheques
            .slice(0, currentIndex)
            .reduce((total, cheque) => total + cheque.chequeAmount, 0);

        return purchaseBalance - previousChequesTotal - chequeAmount;
    };

    useEffect(() => {
        if (groupedData.length > 0) {
            const totalPages = Math.ceil(groupedData.length / itemsPerPage);
            setCurrentPage(totalPages);
        }
    }, [groupedData, itemsPerPage]);

    const filteredData = startDate && endDate
        ? groupedDataWithBalance.filter(([date]) => {
            const [dd, mm, yyyy] = date.split('/');
            const currentDate = new Date(`${yyyy}-${mm}-${dd}`);
            return currentDate >= startDate && currentDate <= endDate;
        })
        : groupedDataWithBalance;

    const paidFilteredData = filteredData.filter(([date, group]) => {
        const hasPaid = group.items.some(item => payStatus[item.stock] === 'Paid');
        const hasUnpaid = group.items.some(item => payStatus[item.stock] !== 'Paid');

        return (
            (showPaidInvoices && hasPaid) ||
            (showUnpaidInvoices && hasUnpaid)
        );
    });

    const totalPages = Math.ceil(paidFilteredData.length / itemsPerPage);
    const currentGroups = paidFilteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleShowPaidChange = (e) => setShowPaidInvoices(e.target.checked);
    const handleShowUnpaidChange = (e) => setShowUnpaidInvoices(e.target.checked);
    const handleShowPaymentsChange = (e) => setShowPayments(e.target.checked);


    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        let yPos = 15;

        doc.setFontSize(18);
        doc.text(`Payment History - ${supplierName}`, 14, yPos);
        yPos += 15;

        const summaryData = [
            ['Supplier Name', supplierName],
            ['No. of unpaid invoices', dueCount],
            ['Total Credit', `LKR ${Number(dueAmount).toLocaleString('en-US')}`],
            ['Dated Cheques', `LKR ${Number(totalChequeAmount).toLocaleString('en-US')}`],
            ['Total Payable', `LKR ${(Number(totalChequeAmount) + Number(dueAmount)).toLocaleString('en-US')}`]
        ];

        doc.autoTable({
            head: [['Field', 'Value']],
            body: summaryData,
            startY: yPos,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            styles: { fontSize: 10 }
        });
        yPos = doc.lastAutoTable.finalY + 10;

        const filteredDataForPDF = startDate && endDate
            ? groupedDataWithBalance.filter(([date]) => {
                const [dd, mm, yyyy] = date.split('/');
                const currentDate = new Date(`${yyyy}-${mm}-${dd}`);
                return currentDate >= startDate && currentDate <= endDate;
            })
            : groupedDataWithBalance;

        const paidFilteredDataForPDF = filteredDataForPDF.filter(([date, group]) => {
            const isPaid = payStatus[date] || false;
            return (showPaidInvoices && isPaid) || (showUnpaidInvoices && !isPaid);
        });

        let cumulativeBalance = 0;
        const filteredDataWithBalance = paidFilteredDataForPDF.map(([date, group]) => {
            cumulativeBalance += group.total;
            return [date, { ...group, cumulativeBalance }];
        });

        const purchaseData = [];
        const chequeItems = [];

        filteredDataWithBalance.forEach(([date, group]) => {
            group.items.forEach(item => {
                if (item.type === 'cheque') {
                    chequeItems.push({
                        date: date,
                        chequeNo: item.chequeNo,
                        amount: item.amount,
                        balance: item.amount - group.cumulativeBalance,
                    });
                } else {
                    purchaseData.push([
                        date,
                        item.product,
                        item.qty,
                        formatCurrency(item.unitRate),
                        formatCurrency(item.total),
                        item.customer,
                        formatCurrency(group.cumulativeBalance),
                        payStatus[date] ? 'Paid' : 'Unpaid'
                    ]);
                }
            });

            purchaseData.push([
                date,
                'TOTAL',
                '',
                '',
                formatCurrency(group.total),
                '',
                formatCurrency(group.cumulativeBalance),
                ''
            ]);
        });

        doc.autoTable({
            head: [['Date', 'Product', 'QTY', 'Unit Rate', 'Total', 'Customer', 'Balance', 'Paid']],
            body: purchaseData,
            startY: yPos,
            theme: 'grid',
            didParseCell: function (data) {
                if (data.row.section === 'body' && data.cell.raw === 'TOTAL') {
                    data.cell.styles.fillColor = [241, 241, 241];
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });
        yPos = doc.lastAutoTable.finalY + 10;

        if (showPayments && chequeItems.length > 0) {
            const chequeData = chequeItems.map(cheque => [
                cheque.date,
                cheque.chequeNo,
                formatCurrency(cheque.amount),
                formatCurrency(cheque.balance)
            ]);

            doc.autoTable({
                head: [['Cheque Date', 'Cheque No', 'Amount', 'Balance']],
                body: chequeData,
                startY: yPos,
                theme: 'grid'
            });
        }

        doc.save(`${supplierName}-payment-history.pdf`);
    };

    const compactCheckboxLabel = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        color: '#444',
        cursor: 'pointer'
    };

    return (
        <div>
            <div className="scrolling-container">
                <div className="mt-4">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: "20px" }}>
                        <div style={{ paddingLeft: "10px", width: "100%" }}>

                            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>Payment History {supplierName || 'Unknown Supplier'}</h3>
                            </div>

                            <div className='row' style={{ display: 'grid', gridTemplateColumns: 'auto 1px 1fr', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                                <div className='col-md-6'>
                                    <table className="table table-hover table-striped mb-0" style={{ width: '100px' }}>

                                        <tbody className="bg-light">
                                            <tr>
                                                <td className="text-start ps-4 fw-bold">Supplier Name</td>
                                                <td className="text-end pe-4 font-monospace">{supplierName}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start ps-4 fw-bold">No. of unpaid invoices</td>
                                                <td className="text-end pe-4 font-monospace">{dueCount}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start ps-4 fw-bold">Total Credit</td>
                                                <td className="text-end pe-4 font-monospace">
                                                    LKR {Number(dueAmount).toLocaleString('en-US')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-start ps-4 fw-bold">Dated Cheques</td>
                                                <td className="text-end pe-4 font-monospace">
                                                    LKR {Number(totalChequeAmount).toLocaleString('en-US')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-start ps-4 fw-bold">Total Payable</td>
                                                <td className="text-end pe-4 font-monospace fw-bold text-success">
                                                    LKR {(Number(totalChequeAmount) + Number(dueAmount)).toLocaleString('en-US')}
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>

                                <div className='col-md-2'>
                                    <div style={{ backgroundColor: 'white', height: '100%', width: '1px' }}></div>
                                </div>

                                <div className='col-md-6' style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>

                                        <h4 className='text-center' style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0', color: '#444', width: '100%', justifyContent: 'start' }}>
                                            Show Transactions
                                        </h4>
                                        <label style={{ ...compactCheckboxLabel, justifyContent: 'start' }}>
                                            <input
                                                type="checkbox"
                                                checked={showPaidInvoices}
                                                onChange={handleShowPaidChange}
                                                style={{ width: '14px', height: '14px', accentColor: '#007bff' }}
                                            />
                                            <span style={{ fontSize: '0.8rem' }}>Paid Invoices</span>
                                        </label>
                                        <label style={{ ...compactCheckboxLabel, justifyContent: 'start' }}>
                                            <input
                                                type="checkbox"
                                                checked={showUnpaidInvoices}
                                                onChange={handleShowUnpaidChange}
                                                style={{ width: '14px', height: '14px', accentColor: '#007bff' }}
                                            />
                                            <span style={{ fontSize: '0.8rem' }}>Unpaid Invoices</span>
                                        </label>
                                        <label style={{ ...compactCheckboxLabel, justifyContent: 'start' }}>
                                            <input
                                                type="checkbox"
                                                checked={showPayments}
                                                onChange={handleShowPaymentsChange}
                                                style={{ width: '14px', height: '14px', accentColor: '#007bff' }}
                                            />
                                            <span style={{ fontSize: '0.8rem' }}>Payments</span>
                                        </label>

                                        <div className='row'>
                                            <div>
                                                <label style={{ ...compactCheckboxLabel, justifyContent: 'start' }}>
                                                    Filter by Date Range
                                                </label>
                                                <DatePicker
                                                    selectsRange
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    onChange={(update) => {
                                                        setStartDate(update[0]);
                                                        setEndDate(update[1]);
                                                    }}
                                                    placeholderText="Select Date Range"
                                                    className="form-control"
                                                    dateFormat="yyyy-MM-dd"
                                                    style={{
                                                        width: '250px',
                                                        height: '40px',
                                                        fontSize: "14px",
                                                        padding: "8px 12px"
                                                    }}
                                                    isClearable
                                                />
                                            </div>

                                            <div>
                                                <button
                                                    onClick={generatePDF}
                                                    style={{
                                                        margin: '10px 0',
                                                        padding: '10px 20px',
                                                        backgroundColor: '#007bff',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Print PDF
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <h5 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>
                                    Purchase Details
                                </h5>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Date of Purchase</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>QTY</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Unit Rate</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Balance (Rs)</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Paid / Unpaid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentGroups.map(([date, group], groupIndex) => (
                                            <React.Fragment key={date}>
                                                {group.items.map((item, index) => (
                                                    <tr key={`${date}-${index}`} style={{ borderBottom: '1px solid #dee2e6' }}>
                                                        {index === 0 && (
                                                            <td rowSpan={group.items.length} style={{ padding: '12px', verticalAlign: 'top' }}>
                                                                {date}
                                                            </td>
                                                        )}
                                                        <td style={{ padding: '12px' }}>{item.product}</td>
                                                        <td style={{ padding: '12px' }}>{item.qty}</td>
                                                        <td style={{ padding: '12px' }}>{formatCurrency(item.unitRate)}</td>
                                                        <td style={{ padding: '12px' }}>{formatCurrency(item.total)}</td>
                                                        <td style={{ padding: '12px' }}>{item.customer}</td>
                                                    </tr>
                                                ))}
                                                < tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                                                    <td colSpan="3"></td>
                                                    <td style={{ padding: '12px' }}>TOTAL</td>
                                                    <td style={{ padding: '12px' }}>{formatCurrency(group.total)}</td>
                                                    <td colSpan="1"></td>
                                                    <td style={{ padding: '12px' }}>{formatCurrency(group.cumulativeBalance)}</td>
                                                    <td style={{ padding: '12px' }}>
                                                        {group.items.every(item => payStatus[item.stock] === 'Paid') ? 'Paid' : 'Unpaid'}
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {showPayments && (
                                <div style={{ marginTop: '20px' }}>
                                    <h5 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>
                                        Cheque Details
                                    </h5>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                                <th style={{ padding: '12px', textAlign: 'left' }}>Cheque Date</th>
                                                <th style={{ padding: '12px', textAlign: 'left' }}>Cheque No</th>
                                                <th style={{ padding: '12px', textAlign: 'left' }}>Amount</th>
                                                <th style={{ padding: '12px', textAlign: 'left' }}>Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cheques.map((cheque, index) => {
                                                const balance = getChequeBalance(cheque.chequeDate, cheque.chequeAmount, index);
                                                return (
                                                    <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                                                        <td style={{ padding: '12px' }}>
                                                            {new Date(cheque.chequeDate).toLocaleDateString("en-GB")}
                                                        </td>
                                                        <td style={{ padding: '12px' }}>{cheque.chequeNumber}</td>
                                                        <td style={{ padding: '12px' }}>{formatCurrency(cheque.chequeAmount)}</td>
                                                        <td style={{ padding: '12px' }}>{formatCurrency(balance)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {groupedData.length > 0 && (
                                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            backgroundColor: currentPage === 1 ? '#f8f9fa' : 'white',
                                            color: currentPage === 1 ? '#6c757d' : 'black'
                                        }}
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => totalPages - i).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            style={{
                                                padding: '0.4rem 0.8rem',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                backgroundColor: currentPage === page ? '#007bff' : 'white',
                                                color: currentPage === page ? 'white' : 'black',
                                                cursor: 'pointer',
                                                fontWeight: currentPage === page ? 'bold' : 'normal'
                                            }}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                            backgroundColor: currentPage === totalPages ? '#f8f9fa' : 'white',
                                            color: currentPage === totalPages ? '#6c757d' : 'black'
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {error && <p style={{ color: '#dc3545', fontSize: '0.9rem', margin: '1rem 0 0 0', textAlign: 'center' }}>{error}</p>}
        </div >
    )
}

export default SupplierVisePayments
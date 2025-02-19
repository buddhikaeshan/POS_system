import { useEffect, useState } from "react";
import config from '../../config';
import { ChevronDown, ChevronUp } from "lucide-react";
import './DueCus.css';
import PayModal from './PayModal';

const DueCus = () => {
  const columns = ['Customer Code', 'Customer', 'Total Amount', 'Total Paid Amount', 'Total Due Amount', 'Actions'];
  const expandedColumns = ['Invoice Number', 'Store', 'Sold Date', 'Total Amount', 'Paid Amount', 'Due Amount', 'Actions'];
  
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchDueCustomer();
  }, []);

  const fetchDueCustomer = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoices`);
      if (!response.ok) {
        setError('Failed to fetch Sales Invoices');
        return;
      }
      const invoices = await response.json();

      const transactionPromises = invoices.map(async (invoice) => {
        const transactionResponse = await fetch(`${config.BASE_URL}/transaction/invoice/${invoice.invoiceId}`);
        if (transactionResponse.ok) {
          return await transactionResponse.json();
        }
        return [];
      });

      const transactionsData = await Promise.all(transactionPromises);

      const formattedData = invoices.map((invoice, index) => {
        const invoiceTransactions = transactionsData[index] || [];
        const creditTransactions = invoiceTransactions.filter(transaction => transaction.transactionType === 'credit');
        if (creditTransactions.length === 0) return null;

        const transactionPaid = creditTransactions.reduce((total, transaction) => total + transaction.paid, 0);
        const transactionDue = creditTransactions.reduce((total, transaction) => total + transaction.due, 0);
        const transactionPrice = creditTransactions.reduce((total, transaction) => total + transaction.price, 0);

        return {
          invoiceId: invoice.invoiceId,
          invoiceNo: invoice.invoiceNo,
          customerCode: invoice.customer.cusCode,
          customerName: invoice.customer.cusName,
          cusId: invoice.customer.cusId, 
          store: invoice.store,
          date: invoice.invoiceDate,
          totalAmount: transactionPrice,
          paidAmount: transactionPaid,
          dueAmount: transactionDue,
        };
      }).filter(Boolean);

      setData(formattedData);
      updateGroupedData(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGroupedData = (currentData) => {
    const grouped = currentData.reduce((acc, item) => {
      const existing = acc.find(row => row.customerCode === item.customerCode);
      if (existing) {
        existing.totalAmount += Number(item.totalAmount);  
        existing.paidAmount += Number(item.paidAmount);  
        existing.dueAmount += Number(item.dueAmount);  
      } else {
        acc.push({ 
          ...item, 
          totalAmount: Number(item.totalAmount), 
          paidAmount: Number(item.paidAmount), 
          dueAmount: Number(item.dueAmount) 
        });
      }
      return acc;
    }, []);
    setGroupedData(grouped);
  };

  const toggleRowExpansion = (customerCode) => {
    if (expandedRows.includes(customerCode)) {
      setExpandedRows(expandedRows.filter(code => code !== customerCode));
    } else {
      setExpandedRows([...expandedRows, customerCode]);
    }
  };

  const handlePayClick = (invoice) => {
    setSelectedInvoice({
      ...invoice,
      cusId: invoice.customer?.cusId // Get cusId from customer object in invoice data
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
  };

  return (
    <div>
      <div className="scrolling-container">
        <div className="new-sales-container">
          <h4>Due Customers</h4>

          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : null}
          
          <table className="due-cus-table">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {groupedData
    .filter(row => row.dueAmount > 0) // Filter rows with Total Due Amount > 0
    .map((row) => (
                <>
                  <tr key={row.customerCode}>
                    <td>{row.customerCode}</td>
                    <td>{row.customerName}</td>
                    <td>{row.totalAmount}</td>
                    <td>{row.paidAmount}</td>
                    <td>{row.dueAmount}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => toggleRowExpansion(row.customerCode)}
                      >
                        {expandedRows.includes(row.customerCode) ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.includes(row.customerCode) && (
                    <tr className="expanded-row">
                      <td colSpan={columns.length}>
                        <table className="expanded-table">
                          <thead>
                            <tr>
                              {expandedColumns.map((column, index) => (
                                <th key={index}>{column}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                          {data
  .filter(item => item.customerCode === row.customerCode)
  .map((item, index) => (
    <tr key={index}>
      <td>{item.invoiceNo}</td>
      <td>{item.store}</td>
      <td>{new Date(item.date).toLocaleString()}</td>
      <td>{item.totalAmount}</td>
      <td>{item.paidAmount}</td>
      <td>{item.dueAmount}</td>
      <td>
        <button
          className="btn btn-success"
          onClick={() => handlePayClick({
            ...item,
            customer: { cusId: row.cusId } // Include customer ID from the row data
          })}
        >
          Make a Payment
        </button>
      </td>
    </tr>
  ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          
          {showModal && selectedInvoice && (
            <PayModal
              show={showModal}
              handleClose={handleCloseModal}
              invoiceData={selectedInvoice}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DueCus;
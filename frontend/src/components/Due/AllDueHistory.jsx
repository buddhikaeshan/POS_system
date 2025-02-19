import { useEffect, useState } from "react";
import config from '../../config';
import './DueCus.css'; // Ensure this CSS file contains styling for the Status column if needed.
import PayModal from './PayModal';

const AllDueHistory = () => {
  const expandedColumns = ['Invoice Number', 'Customer Name', 'Sold Date', 'Total Amount', 'Paid Amount', 'Due Amount', 'Status', ];

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchDueCustomer();
  }, []);

  const fetchCustomerName = async (cusId) => {
    try {
      const response = await fetch(`${config.BASE_URL}/customer/${cusId}`);
      if (response.ok) {
        const customer = await response.json();
        return customer.cusName;
      }
      return 'Unknown Customer';
    } catch {
      return 'Unknown Customer';
    }
  };

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

      const customerNameCache = {}; // Cache to avoid redundant API calls for the same cusId

      const formattedData = await Promise.all(
        invoices.map(async (invoice, index) => {
          const invoiceTransactions = transactionsData[index] || [];
          const creditTransactions = invoiceTransactions.filter(transaction => transaction.transactionType === 'credit');
          if (creditTransactions.length === 0) return null;

          const transactionPaid = creditTransactions.reduce((total, transaction) => total + transaction.paid, 0);
          const transactionDue = creditTransactions.reduce((total, transaction) => total + transaction.due, 0);
          const transactionPrice = creditTransactions.reduce((total, transaction) => total + transaction.price, 0);

          let customerName = customerNameCache[invoice.customer.cusId];
          if (!customerName) {
            customerName = await fetchCustomerName(invoice.customer.cusId);
            customerNameCache[invoice.customer.cusId] = customerName; // Store in cache
          }

          return {
            invoiceId: invoice.invoiceId,
            invoiceNo: invoice.invoiceNo,
            customerName, // Dynamically fetched customer name
            cusId: invoice.customer.cusId,
            store: invoice.store,
            date: invoice.invoiceDate,
            totalAmount: transactionPrice,
            paidAmount: transactionPaid,
            dueAmount: transactionDue,
          };
        })
      );

      setData(formattedData.filter(Boolean));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayClick = (invoice) => {
    setSelectedInvoice({
      ...invoice,
      cusId: invoice.cusId // Pass the cusId to the payment modal
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
          <h4>View All Paid and Unpaid Due History</h4>

          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : null}

          <table className="due-cus-table">
            <thead>
              <tr>
                {expandedColumns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.invoiceNo}</td>
                  <td>{item.customerName}</td>
                  <td>{new Date(item.date).toLocaleString()}</td>
                  <td>{item.totalAmount}</td>
                  <td>{item.paidAmount}</td>
                  <td>{item.dueAmount}</td>
                  <td>
                    <span
                      style={{
                        color: item.dueAmount === 0 ? 'green' : 'orange',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.dueAmount === 0 ? 'Payments Clear' : 'Pending'}
                    </span>
                  </td>
                  {/* <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handlePayClick(item)}
                    >
                      Payment
                    </button>
                  </td> */}
                </tr>
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

export default AllDueHistory;

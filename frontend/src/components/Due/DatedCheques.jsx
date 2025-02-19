import { useEffect, useState } from "react";
import config from '../../config';
import './DueCus.css';

const DatedCheques = () => {
  const expandedColumns = ['Invoice Number', 'Customer Name', 'Cheque Details', 'Dated Cheques', 'Paid Amount', 'Days Left']; // Added 'Days Left'

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchInvoiceNumber = async (invoiceId) => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoice/${invoiceId}`);
      if (response.ok) {
        const invoice = await response.json();
        return invoice.invoiceNo;
      }
      return 'Unknown Invoice';
    } catch {
      return 'Unknown Invoice';
    }
  };

  // Function to calculate days left for the cheque
  const calculateDaysLeft = (datedCheque) => {
    const today = new Date();
    const chequeDate = new Date(datedCheque);

    // Set both dates to the start of the day (midnight) for accurate comparison
    today.setHours(0, 0, 0, 0);
    chequeDate.setHours(0, 0, 0, 0);

    const timeDifference = chequeDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
      return { text: "Due Today", color: "orange" };
    } else if (daysDifference < 0) {
      return { text: "Overdue", color: "red" };
    } else {
      return { text: `${daysDifference} Days Left`, color: "green" };
    }
  };

  const fetchDueCustomer = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/duecustomers`); // Fetch from dueCustomer table
      if (!response.ok) {
        setError('Failed to fetch Due Customers');
        return;
      }
      const dueCustomers = await response.json();

      // Filter only rows where payType is 'cheque'
      const chequeDueCustomers = dueCustomers.filter(dueCustomer => dueCustomer.payType === 'cheque');

      const customerNameCache = {}; // Cache to avoid redundant API calls for the same cusId
      const invoiceNumberCache = {}; // Cache to avoid redundant API calls for the same invoiceId

      const formattedData = await Promise.all(
        chequeDueCustomers.map(async (dueCustomer) => {
          let customerName = customerNameCache[dueCustomer.cusId];
          if (!customerName) {
            customerName = await fetchCustomerName(dueCustomer.cusId);
            customerNameCache[dueCustomer.cusId] = customerName; // Store in cache
          }

          let invoiceNo = invoiceNumberCache[dueCustomer.invoiceId];
          if (!invoiceNo) {
            invoiceNo = await fetchInvoiceNumber(dueCustomer.invoiceId);
            invoiceNumberCache[dueCustomer.invoiceId] = invoiceNo; // Store in cache
          }

          return {
            invoiceId: dueCustomer.invoiceId,
            invoiceNo, // Fetch invoice number
            customerName, // Dynamically fetched customer name
            cusId: dueCustomer.cusId,
            chequeDetail: dueCustomer.chequeDetail,
            datedCheque: dueCustomer.datedCheque, // Fetch datedCheque from dueCustomer table
            paidAmount: dueCustomer.paidAmount, // Fetch paidAmount from dueCustomer table
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

  return (
    <div>
      <div className="scrolling-container">
        <div className="new-sales-container">
          <h4>Dated Cheques</h4>

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
              {data.map((item, index) => {
                const daysLeftInfo = calculateDaysLeft(item.datedCheque);
                return (
                  <tr key={index}>
                    <td>{item.invoiceNo}</td> {/* Display invoice number */}
                    <td>{item.customerName}</td> {/* Display customer name */}

                    <td>{item.chequeDetail}</td>  
                    
                    <td>{new Date(item.datedCheque).toLocaleString()}</td> {/* Display datedCheque */}
                   
                    <td>{item.paidAmount}</td> {/* Display paidAmount */}
                    <td style={{ color: daysLeftInfo.color }}>{daysLeftInfo.text}</td> {/* Display days left with color */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DatedCheques;
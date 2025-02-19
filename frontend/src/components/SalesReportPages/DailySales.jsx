import { useEffect, useState } from 'react';
import Table from '../Table/Table';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

function DailySales() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = ['#', 'Invoice No', 'Date & Time', 'Product Name', 'Quantity', 'Sold Price', 'Total Price', 'Profit/Loss'];
  const btnName = '+ New Sale';

  useEffect(() => {
    fetchSummery();
  }, []);

  const fetchSummery = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoiceProducts`);
      if (!response.ok) {
        setError('Failed to fetch Summery');
      }
      const inv = await response.json();

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      const formattedData = inv
        .filter(inv => inv.invoice?.invoiceDate && inv.invoice.invoiceDate.split('T')[0] === today)
        .map(inv => {

          const invoiceDate = new Date(inv.invoice?.invoiceDate);

          // Format dates to "YYYY-MM-DD HH:mm"
          const formattedInvoiceDate = `${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}-${String(invoiceDate.getDate()).padStart(2, '0')} ${String(invoiceDate.getHours()).padStart(2, '0')}:${String(invoiceDate.getMinutes()).padStart(2, '0')}`;

          // Calculate total profit
          const totalProfit = (inv.product?.productProfit) * (inv.invoiceQty);

          return [
            inv.id,
            inv.invoice?.invoiceNo || ' - ',
            formattedInvoiceDate,
            inv.product?.productName || ' - ',
            inv.invoiceQty,
            inv.product?.productSellingPrice || "Unknown",
            inv.totalAmount,
            totalProfit,
          ];
        });

      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleNewSale = () => {
    navigate('/sales/new/invoice');
  };
  const title = 'Day Job Report';
  const invoice = 'Day Job Report.pdf';

  return (
    <div>
      <div className="scrolling-container">
        <h4>Day Job Report</h4>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <Table
            search={'Search by Customer Name , Product Name'}
            data={data}
            columns={columns}
            btnName={btnName}
            onAdd={handleNewSale}
            showActions={false}
            title={title}
            invoice={invoice}
            showDate={false}
          />
        )}
      </div>
    </div>
  );
}

export default DailySales;

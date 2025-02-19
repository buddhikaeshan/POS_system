import { useState, useEffect } from 'react';
import Table from '../../components/Table/Table';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

function CurrentStock() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const columns = ['#', 'Stock Name', 'Stocked Date', 'Product Name', 'Category', 'Quantity', 'Value', 'Status'];
  const btnName = '+ New Stock';

  useEffect(() => {
    fetchStock();
  },);

  const fetchStock = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/stocks`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock list');
      }
      const stock = await response.json();
      const formattedData = stock.map(stock => {

        const stockDate = new Date(stock.stockDate);
        const formattedStockDate = `${stockDate.getFullYear()}-${String(stockDate.getMonth() + 1).padStart(2, '0')}-${String(stockDate.getDate()).padStart(2, '0')} ${String(stockDate.getHours()).padStart(2, '0')}:${String(stockDate.getMinutes()).padStart(2, '0')}`;

        return [
          stock.stockId,
          stock.stockName,
          formattedStockDate,
          stock.product?.productName || 'Unknown',
          stock.category?.categoryName || "Unknown",
          stock.stockQty,
          stock.stockPrice,
          <select
            className='form-control'
            value={stock.stockStatus}
            onChange={(e) => handleStatusChange(stock.stockId, e.target.value)}
            disabled={stock.stockQty === 0}
          >
            <option value="In stock">In stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        ]
      });

      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };
  const handleStatusChange = async (stockId, newStatus) => {
    try {
      const response = await fetch(`${config.BASE_URL}/stock/${stockId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stockStatus: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to update stock status: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
      }
      await fetchStock();
    } catch (error) {
      setError(`Error updating stock status: ${error.message}`);
    }
  };

  const navigate = useNavigate();

  const handleNewStockClick = () => {
    navigate('/stock/new-stock');
  };

  const title = 'Current Stock';
  const invoice = 'Current Stock.pdf';

  return (
    <div>
      <div className="scrolling-container">
        <h4>Current Stock</h4>
        <Table
          search={'Search by Product Name'}
          data={data}
          columns={columns}
          btnName={btnName}
          onAdd={handleNewStockClick}
          showActions={false}
          onMarkOutOfStock={null}
          title={title}
          invoice={invoice}
          showDate={false}
        />
      </div>
    </div>
  )
}

export default CurrentStock;
import React, { useState, useEffect } from 'react'
import Table from '../Table/Table';
import config from '../../config';

function StockHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const columns = ['#', 'Stock Name', 'Product Name', 'Price per Item', 'Supplied Quantity','Stock Price'];

  useEffect(() => {
    fetchStock();
  });

  const fetchStock = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/stockHistory`);
      if (!response.ok) {
        setError('Failed to fetch stock History');
      }
      const stock = await response.json();

      const formattedData = stock.map(stock => {
        return [
          stock.stockHistoryId,
          stock.stock?.stockName,
          stock.product?.productName || "Unknown",
          stock.product?.productBuyingPrice,
          stock.stockHistoryQty,
          stock.stock?.stockPrice || "-",
        ];
      });
      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const title = 'Stock History';
  const invoice = 'Stock History.pdf';

  return (
    <div>
      <div className="scrolling-container">
        <h4>Stock History</h4>
        <Table
          search={'Search by Product Name'}
          data={data}
          showActions={false}
          columns={columns}
          title={title}
          showButton={false}
          invoice={invoice}
        />
      </div>
    </div>
  )
}

export default StockHistory;
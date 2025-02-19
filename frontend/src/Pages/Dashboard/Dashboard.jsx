import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CardOne from './CardOne';
import CardTwo from './CardTwo';
import CardThree from './CardThree';
import CardFour from './CardFour';
import config from '../../config';
import Header from '../../components/SideBar/Header';
import CardFive from './CardFive';

const Dashboard = () => {
  const base_url = config.BASE_URL;
  const [pendingChequeCount, setPendingChequeCount] = useState(0);
  const [pendingChequeAmount, setPendingChequeAmount] = useState(0);
  const [clearedChequeAmount, setClearedChequeAmount] = useState(0);

  const [reportData, setReportData] = useState({
    TodayTotal: "0",
    YesterdayTotal: "0",
    ThisMonthTotal: '0',
    LastMonthTotal: '0',
    totalCheques: '0',
    clearCheque: '0',
    pendingCheque: '0',
    todayTotalSales: [],
    monthTotalSales: [],
    monthlyRevenue: [],
    monthlySales: [],
    mostSellingItemsMonth: []
  });

  const [stockSize, setStockSize] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchChequeData = async () => {
      try {
        const pendingResponse = await fetch(`${base_url}/pendingChequeTotal`);
        const clearedResponse = await fetch(`${base_url}/clearedChequeTotal`);

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
  }, [base_url]);

  useEffect(() => {
    const fetchPendingChequeCount = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/countCheques`);
        if (!response.ok) {
          throw new Error('Failed to fetch pending cheque count');
        }
        const result = await response.json();
        setPendingChequeCount(result.count);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchPendingChequeCount();
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${base_url}/getReports`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setReportData(data.message);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchReports();
  }, [base_url]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`${base_url}/productStock`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (result.message_type === "success") {
          const stock = result.message;
          const stockLabels = stock.map(item => item['product.productName']);
          const stockQty = stock.map(item => item.totalQty);

          setLabels(stockLabels);
          setStockSize(stockQty);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, [base_url]);

  const topSellingLabels = (reportData.mostSellingItemsMonth || []).map(item => item.productName);
  const topSellingValues = (reportData.mostSellingItemsMonth || []).map(item => parseInt(item.totalQuantity));

  return (
    <div>
      <div className='show-Header'><Header /></div>
      <div className="scrolling-container">
        <div className="container-fluid my-4">
          <h1 className="h2 mb-4">Dashboard</h1>

          <div className="row">
            <div className="col-lg-3 col-md-12 mb-4">
              <div className="h-100">
                <CardOne
                  TodayTotal={reportData.revenueToday}
                  YesterdayTotal={reportData.revenueYesterday}
                  ThisMonthTotal={reportData.revenueMonth}
                  LastMonthTotal={reportData.revenueLastMonth}
                  todayTotalSales={reportData.salesToday}
                  monthTotalSales={reportData.salesMonth}
                  totalCheques={pendingChequeCount}
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-12 mb-4">
              <div className="h-100">
                <CardFive
                  totalCheques={pendingChequeCount}
                  clearCheque={clearedChequeAmount}
                  pendingCheque={pendingChequeAmount}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-12 mb-4">
              <div className="h-100">
                <CardTwo
                  monthlyRevenue={reportData.monthlyRevenue}
                  monthlySales={reportData.monthlySales}
                />
              </div>
            </div>
          </div>

          <div className='row'>
            <div className="col-lg-6 col-sm-12">
              <CardThree
                stockSize={stockSize}
                labels={labels}
              />
            </div>

            <div className="col-lg-6 col-sm-12">
              <CardFour
                dataValues={topSellingValues}
                labels={topSellingLabels}
                title="Top Selling Items This Month"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

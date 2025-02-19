import React, { useEffect, useState } from 'react';
import Table from '../../components/Table/Table';
import config from '../../config';
import StockPaymentModel from '../../Models/StockPayment/StockPaymentModel';
import AllSupplierPayments from '../../Models/SupplierForm/AllSupplierPayments';
import { Eye, Plus } from 'lucide-react';

function SupplierPayments() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [selectedStockPay, setSelectedStockPay] = useState(null);
  const [dueFilter, setDueFilter] = useState('all');
  const [totalDue, setTotalDue] = useState(0);
  const [duePaymentsCount, setDuePaymentsCount] = useState(0);

  const columns = [
    // '#',
    'Supplier Name',
    'Company Name',
    'Cheque Amount',
    'Cash Amount',
    'Total Quantity',
    'Vat %',
    'Total Amount',
    'Due Amount',
    'Actions',
  ];

  const btnName = ['Add Product'];

  useEffect(() => {
    fetchStockPaymentsList();
    fetchDuePaymentsCount();
    fetchTotalDueAmount();
  },);

  useEffect(() => {
    filterData();
  }, [dueFilter, data]);

  const filterData = () => {
    switch (dueFilter) {
      case 'withDue':
        setFilteredData(data.filter((row) => parseFloat(row[7]) > 0));
        break;
      case 'noDue':
        setFilteredData(data.filter((row) => parseFloat(row[7]) <= 0 || row[7] === '0'));
        break;
      default:
        setFilteredData(data);
    }
  };

  const fetchStockPaymentsList = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/stockPayments`);
      if (!response.ok) {
        throw new Error(`Failed to fetch supplier payments list: ${response.status} ${response.statusText}`);
      }
      const stockPay = await response.json();
      const sortedData = stockPay.sort((a, b) =>
        parseFloat(b.due || 0) - parseFloat(a.due || 0)
      );

      const formattedData = sortedData.map((item) => {
        return [
          // item.stockPaymentId || '-',
          item.supplier?.supplierName || '-',
          item.supplier?.supplierCompany || '-',
          item.chequeAmount || '0',
          item.cashAmount || '0',
          item.stockQty || '0',
          item.vat || '0',
          item.total || '0',
          item.due || '0',
          <div className='d-flex' style={{ justifyContent: 'center' }}>
            <button className='btn btn-primary' onClick={() => handleEditStockPay(item)}>
              <Plus /> Make A Payment
            </button>
            <button className='btn btn-info' onClick={() => handleViewClick(item.supplierId, item.supplier?.supplierName || 'unknown')}>
              <Eye />
            </button>
          </div>
        ];
      });

      setData(formattedData);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchDuePaymentsCount = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/stockPayments/dueCount`);
      if (!response.ok) {
        throw new Error('Failed to fetch due payments count');
      }
      const result = await response.json();
      setDuePaymentsCount(result.count || 0);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchTotalDueAmount = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/stockPayments/totalDues`);
      if (!response.ok) {
        throw new Error('Failed to fetch total due amount');
      }
      const result = await response.json();
      setTotalDue(result.totalDue || 0);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewClick = (supplierId, supplierName) => {
    setSelectedStockPay({ supplierId, supplierName });
    setShowPaymentHistoryModal(true);
    setShowEditModal(false);
  };

  const handleEditStockPay = (item) => {
    console.log("Editing Item:", item);
    setSelectedStockPay(item);
    setShowEditModal(true);
    setShowPaymentHistoryModal(false);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowPaymentHistoryModal(false);
  };

  const title = 'Suppliers Due';
  const invoice = 'Suppliers Due.pdf';

  return (
    <div>
      <div className="scrolling-container">
        <div className="mt-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: "20px" }}>
            <div style={{ paddingLeft: "10px", width: "100%" }}>

              <h4 style={{ marginBottom: "24px", fontSize: "24px", color: "#2d3436", fontWeight: "600" }}>
                Supplier Payable
              </h4>

              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "nowrap", overflowX: "auto", paddingBottom: "10px" }}>
                <div style={{ flex: "0 0 240px", backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>

                  <div style={{ fontSize: "14px", color: "#636e72", marginBottom: "8px" }}>
                    Filter
                  </div>

                  <select
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #dfe6e9", fontSize: "14px", backgroundColor: "#f8f9fa", outline: "none", cursor: "pointer" }}
                    value={dueFilter}
                    onChange={(e) => setDueFilter(e.target.value)}
                  >
                    <option value="all">All Payments</option>
                    <option value="withDue">With Due Amount</option>
                    <option value="noDue">No Due Amount</option>
                  </select>
                </div>

                <div style={{ flex: "1", backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", minWidth: "220px" }}>
                  <div style={{ fontSize: "14px", color: "#636e72", marginBottom: "12px" }}>
                    Total Due Payments
                  </div>

                  <input
                    type="text"
                    style={{ width: "100%", padding: "12px", fontSize: "25px", fontWeight: "600", color: "#e74c3c", border: "none", backgroundColor: "transparent", textAlign: "right" }}
                    value={duePaymentsCount}
                    disabled
                  />
                </div>

                <div style={{ flex: "1", backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", minWidth: "220px" }}>
                  <div style={{ fontSize: "14px", color: "#636e72", marginBottom: "12px" }}>
                    Total Due Amount
                  </div>

                  <input
                    type="text"
                    style={{ width: "100%", padding: "12px", fontSize: "25px", fontWeight: "600", color: "#e74c3c", border: "none", backgroundColor: "transparent", textAlign: "right" }}
                    value={`LKR ${totalDue.toLocaleString()}`}
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
          btnName={btnName}
          columns={columns}
          showButton={false}
          showDate={false}
          title={title}
          invoice={invoice}
          showActions={false}
          showDelete={false}
        />

        {showEditModal && (
          <StockPaymentModel
            showModal={showEditModal}
            closeModal={handleCloseModal}
            onSave={fetchStockPaymentsList}
            stockPayment={selectedStockPay}
          />
        )}

        {showPaymentHistoryModal && (
          <AllSupplierPayments
            showModal={showPaymentHistoryModal}
            closeModal={handleCloseModal}
            supplierName={selectedStockPay?.supplierName}
            supplierId={selectedStockPay?.supplierId}
          />
        )}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default SupplierPayments;
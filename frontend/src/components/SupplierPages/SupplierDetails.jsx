import React, { useEffect, useState } from 'react';
import Table from '../../components/Table/Table';
import config from '../../config';
import SupplierForm from '../../Models/SupplierForm/SupplierForm';
import ConfirmModal from '../../Models/ConfirmModal';
import SupplierVisePayments from '../../Models/SupplierForm/SupplierVisePayments';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router';

function SupplierDetails() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSupplierPayModal, setShowSupplierPayModal] = useState(false);
  const [selectedSupplierForPayment, setSelectedSupplierForPayment] = useState({ supplierId: null, supplierName: null });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedSup, setSelectedSup] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [totalChequeAmount, setTotalChequeAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);

  const navigate = useNavigate();

  const columns = ['#', 'Supplier Name', 'Supplier Address', 'NIC', 'Email', 'Contact 1', 'Contact 2', 'Company', 'Status', 'View'];
  const btnName = ' + New Supplier ';

  useEffect(() => {
    fetchSuppliers();
    fetchChequeAmount();
    fetchDueAmount();
  });

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/suppliers`);
      if (!response.ok) {
        setError('Failed to fetch supplier list');
        return;
      }
      const supplier = await response.json();
      const formattedData = supplier.map(supplier => [
        supplier.supplierId,
        supplier.supplierName,
        supplier.supplierAddress,
        supplier.supplierNic || "-",
        supplier.supplierEmail || "-",
        supplier.supplierTP,
        supplier.supplierSecondTP || "-",
        supplier.supplierCompany || "-",
        <select
          className="form-control"
          value={supplier.supplierStatus}
          onChange={(e) => handleStatusChange(supplier.supplierId, e.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>,
        <div className='d-flex' style={{ justifyContent: 'center' }}>
          <button className='btn btn-info' onClick={() => handleViewClick(supplier.supplierId, supplier.supplierName || 'unknown')} ><Eye /> </button>
        </div>
      ]);
      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleViewClick = (supplierId, supplierName) => {
    navigate(`/supplier-payments/${supplierId}`, { state: { supplierName } });
  };;

  const handleStatusChange = async (supplierId, newStatus) => {
    try {
      const response = await fetch(`${config.BASE_URL}/supplier/${supplierId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplierStatus: newStatus }),
      });

      if (!response.ok) {
        setError('Failed to update supplier status');
      }
      fetchSuppliers();
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchChequeAmount = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/pendingChequeTotal`);
      if (!response.ok) {
        throw new Error('Failed to fetch total cheque amount');
      }
      const result = await response.json();
      setTotalChequeAmount(result.totalAmount);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchDueAmount = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/stockPayments/totalDues`);
      if (!response.ok) {
        throw new Error('Failed to fetch total due amount');
      }
      const result = await response.json();
      setDueAmount(result.totalDue);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (rowIndex) => {
    const SupplierData = data[rowIndex];
    setSelectedSup({
      supplierId: SupplierData[0],
      supplierName: SupplierData[1],
      supplierAddress: SupplierData[2],
      supplierNic: SupplierData[3],
      supplierEmail: SupplierData[4],
      supplierTP: SupplierData[5],
      supplierSecondTP: SupplierData[6],
      supplierPaid: SupplierData[7],
      supplierBalance: SupplierData[8],
      supplierPaymentDate: SupplierData[9],
    });
    setShowModal(true);
  };

  const openDeleteConfirmModal = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    setShowConfirmModal(false);
    try {
      const supplierId = data[selectedRowIndex][0];
      const response = await fetch(`${config.BASE_URL}/supplier/${supplierId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        alert('Supplier is used for creating stock');
      } else {
        fetchSuppliers();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = () => {
    setSelectedSup(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowSupplierPayModal(false);
  };

  const title = 'Supplier Details';
  const invoice = 'Supplier Details.pdf';

  return (
    <div>
      <div className="scrolling-container">
        <div className='row mt-4'>
          <div className='col-md-3' style={{ paddingLeft: '50px' }}>
            <h4>Supplier List</h4>
          </div>

          <div className='col-md-6'>
            <table className="table table-hover table-striped mb-0" style={{ width: '100px' }}>
              <tbody className="bg-light">
                <tr>
                  <td className="text-start ps-4 fw-bold">Total Credit</td>
                  <td className="text-end pe-4 font-monospace">
                    LKR {Number(dueAmount).toLocaleString('en-US')}
                  </td>
                </tr>
                <tr>
                  <td className="text-start ps-4 fw-bold">Cheques to be honoured</td>
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

        </div>

        <Table
          search={'Search by Supplier Name'}
          data={data}
          columns={columns}
          btnName={btnName}
          onAdd={openModal}
          onEdit={handleEdit}
          onDelete={openDeleteConfirmModal}
          title={title}
          invoice={invoice}
          showDate={false}
        />

        <SupplierForm
          showModal={showModal}
          closeModal={closeModal}
          onSave={fetchSuppliers}
          supplier={selectedSup}
        />

        {showConfirmModal && (
          <ConfirmModal
            onConfirm={handleDelete}
            onClose={() => setShowConfirmModal(false)}
          />
        )}

      </div>
    </div >
  );
}

export default SupplierDetails;

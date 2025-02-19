import React, { useState } from 'react';
import config from '../../config';
import './DueModal.css';

const DueModal = ({ customerData, onClose, showModal }) => {
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  if (!showModal) return null;

  const handleEdit = (index) => {
    setEditingRow(index);
    setEditedData(customerData[index]);
  };

  const handleSave = async (index) => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoice/${editedData.invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update invoice');
      }

      setEditingRow(null);
      onClose();
    } catch (err) {
      console.error('Error updating invoice:', err);
      alert('Failed to update invoice. Please try again.');
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      const invoiceId = customerData[index].invoiceId;
      const response = await fetch(`${config.BASE_URL}/invoice/${invoiceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }

      onClose();
    } catch (err) {
      console.error('Error deleting invoice:', err);
      alert('Failed to delete invoice. Please try again.');
    }
  };

  const handleInputChange = (e, field) => {
    setEditedData({
      ...editedData,
      [field]: field === 'totalAmount' || field === 'paidAmount' || field === 'dueAmount' 
        ? parseFloat(e.target.value) 
        : e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-centered">
        <div className="modal-header">
          <h4>Customer Details</h4>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Invoice Number</th>
                <th>Customer Code</th>
                <th>Customer</th>
                <th>Store</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Due Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customerData.map((row, index) => (
                <tr key={row.invoiceId}>
                  {editingRow === index ? (
                    <>
                      <td><input type="text" className="form-control" value={editedData.invoiceNo} onChange={(e) => handleInputChange(e, 'invoiceNo')} /></td>
                      <td><input type="text" className="form-control" value={editedData.customerCode} onChange={(e) => handleInputChange(e, 'customerCode')} /></td>
                      <td><input type="text" className="form-control" value={editedData.customerName} onChange={(e) => handleInputChange(e, 'customerName')} /></td>
                      <td><input type="text" className="form-control" value={editedData.store} onChange={(e) => handleInputChange(e, 'store')} /></td>
                      <td><input type="datetime-local" className="form-control" value={editedData.date} onChange={(e) => handleInputChange(e, 'date')} /></td>
                      <td><input type="number" className="form-control" value={editedData.totalAmount} onChange={(e) => handleInputChange(e, 'totalAmount')} /></td>
                      <td><input type="number" className="form-control" value={editedData.paidAmount} onChange={(e) => handleInputChange(e, 'paidAmount')} /></td>
                      <td><input type="number" className="form-control" value={editedData.dueAmount} onChange={(e) => handleInputChange(e, 'dueAmount')} /></td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-success btn-sm me-1" onClick={() => handleSave(index)}>Save</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingRow(null)}>Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{row.invoiceNo}</td>
                      <td>{row.customerCode}</td>
                      <td>{row.customerName}</td>
                      <td>{row.store}</td>
                      <td>{new Date(row.date).toLocaleString()}</td>
                      <td>{row.totalAmount}</td>
                      <td>{row.paidAmount}</td>
                      <td>{row.dueAmount}</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(index)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DueModal;
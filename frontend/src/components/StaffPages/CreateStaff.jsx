import React, { useState, useEffect } from 'react';
import Table from '../Table/Table';
import StaffModal from '../../Models/StaffModel/StaffModal';
import ConfirmModal from '../../Models/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import config from '../../config';
import './CreateStaff.css';

const CreateStaff = () => {
  const [data, setData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const columns = ["Title", "Full Name", "Department / Job Position", "User Type", "User Name", "Email", "Contact 1", "Contact 2", "Address", "Nic", 'Image', "Status"];
  const btnName = 'Add New Staff Member';

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/users?is_hidden=0`);
      if (!response.ok) {
        throw new Error('Failed to fetch user list');
      }
      const users = await response.json();
      const formattedData = users.map(user => [
        // user.userId,
        user.userTitle,
        user.userFullName,
        user.store?.storeName || "Unknown",
        user.userType,
        user.userName,
        user.userEmail,
        user.userTP,
        user.userSecondTP || "Unknown",
        user.userAddress,
        user.userNIC,
        <FontAwesomeIcon
          icon={faImage}
          style={{ cursor: 'pointer' }}
          onClick={() => handleImageClick(user.userImage)}
        />,
        <select
          className='form-control'
          value={user.userStatus}
          onChange={(e) => handleStatusChange(user.userId, e.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      ]);
      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch(`${config.BASE_URL}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      fetchStaff();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteRequest = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const userId = data[selectedRowIndex][0];
      const response = await fetch(`${config.BASE_URL}/user/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setData(prevData => prevData.filter((_, index) => index !== selectedRowIndex));
      fetchStaff();
    } catch (err) {
      setError(err.message);
    } finally {
      setShowConfirmModal(false);
      setSelectedRowIndex(null);
    }
  };

  const handleAddNewStaff = () => {
    setSelectedStaff(null);
    setShowEditModal(true);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setShowImageModal(false);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedRowIndex(null);
  };

  const handleEdit = (rowIndex) => {
    const selectedStaffData = data[rowIndex];
    setSelectedStaff({
      userId: selectedStaffData[0],
      title: selectedStaffData[1],
      department: selectedStaffData[3],
      fullName: selectedStaffData[2],
      userType: selectedStaffData[4],
      userName: selectedStaffData[5],
      email: selectedStaffData[6],
      contact1: selectedStaffData[7],
      contact2: selectedStaffData[8],
      address: selectedStaffData[9],
      nic: selectedStaffData[10],
      photo: selectedStaffData[11]
    });
    setShowEditModal(true);
  };

  const title = 'Staff List';
  const invoice = 'Staff List.pdf';

  return (
    <div>
      <div className='scrolling-container'>
        <h4>Staff</h4>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table
            data={data}
            columns={columns}
            btnName={btnName}
            onAdd={handleAddNewStaff}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            showDate={false}
            title={title}
            invoice={invoice}
          />
        )}

        {/* Edit Modal */}
        <StaffModal
          showModal={showEditModal}
          closeModal={closeEditModal}
          onSave={fetchStaff}
          staff={selectedStaff}
        />

        {/* Image Modal */}
        {showImageModal && selectedImage && (
          <div className="image-modal">
            <div className="image-modal-content">
              <span className="close" onClick={closeImageModal}>&times;</span>
              <h4>User Image</h4>
              <img src={selectedImage} alt="User" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        {showConfirmModal && (
          <ConfirmModal
            onConfirm={confirmDelete}
            onClose={closeConfirmModal}
          />
        )}
      </div>
    </div>
  );
};

export default CreateStaff;

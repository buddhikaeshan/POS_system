// import React, { useEffect, useState } from 'react';
// import Table from '../Table/Table';
// import Form from '../../Models/Form/Form';
// import Modal from 'react-modal';
// import ConfirmModal from '../../Models/ConfirmModal';
// import config from '../../config';

// const CustomerList = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [selectedCus, setSelectedCus] = useState(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [deleteRowIndex, setDeleteRowIndex] = useState(null);

//   const columns = ['#', 'Customer Code', 'Name', 'Job', 'Office Name', 'Address', 'Phone Number', 'Email', 'Store'];

//   useEffect(() => {
//     fetchCustomer();
//   }, []);

//   const fetchCustomer = async () => {
//     try {
//       const response = await fetch(`${config.BASE_URL}/customers`);
//       if (!response.ok) {
//         setError('Failed to fetch Customer list');
//         return;
//       }
//       const customers = await response.json();

//       const formattedData = customers.map(cus => [
//         cus.cusId,
//         cus.cusCode,
//         cus.cusName,
//         cus.cusJob,
//         cus.cusOffice,
//         cus.cusAddress,
//         cus.cusPhone,
//         cus.cusEmail,
//         cus.cusStore,
//       ]);
//       setData(formattedData);
//       setIsLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const cusId = data[deleteRowIndex][0];
//       const response = await fetch(`${config.BASE_URL}/customer/${cusId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete customer');
//       }

//       setData(prevData => prevData.filter((_, index) => index !== deleteRowIndex));
//       fetchCustomer();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setShowConfirmModal(false);
//     }
//   };

//   const confirmDelete = (rowIndex) => {
//     setDeleteRowIndex(rowIndex);
//     setShowConfirmModal(true);
//   };

//   const handleEdit = (rowIndex) => {
//     const selectedCusData = data[rowIndex];
//     setSelectedCus({
//       cusId: selectedCusData[0],
//       cusName: selectedCusData[2],
//       cusJob: selectedCusData[3],
//       cusOffice: selectedCusData[4],
//       cusAddress: selectedCusData[5],
//       cusPhone: selectedCusData[6],
//       cusEmail: selectedCusData[7],
//       cusStore: selectedCusData[8],
//     });
//     setModalIsOpen(true);
//   };

//   const openModal = () => {
//     setSelectedCus(null);
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//     fetchCustomer();
//   };

//   const title = 'Customer List';
//   const invoice = 'customer_list.pdf';

//   return (
//     <div>
//       <div className="scrolling-container">
//         <h4>Customer List</h4>
//         {isLoading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p>Error: {error}</p>
//         ) : (
//           <Table
//             data={data}
//             columns={columns}
//             showButton={true}
//             btnName={"Add New Customer"}
//             onAdd={openModal}
//             onDelete={confirmDelete}
//             onEdit={handleEdit}
//             showDate={false}
//             title={title}
//             invoice={invoice}
//           />
//         )}
//         <Modal
//           isOpen={modalIsOpen}
//           onRequestClose={closeModal}
//           contentLabel="Customer Form"
//         >
//           <Form
//             closeModal={closeModal}
//             onSave={fetchCustomer}
//             cus={selectedCus}
//             style={{
//               content: {
//                 width: '30%',
//                 height: '90%',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//               },
//             }}
//           />
//         </Modal>
//         {showConfirmModal && (
//           <ConfirmModal
//             onConfirm={handleDelete}
//             onClose={() => setShowConfirmModal(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomerList;


import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react'; // Import the Eye icon from lucide-react
import Table from '../Table/Table';
import Form from '../../Models/Form/Form';
import Modal from 'react-modal';
import ConfirmModal from '../../Models/ConfirmModal';
import config from '../../config';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const CustomerList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCus, setSelectedCus] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(null);

  const navigate = useNavigate(); // Initialize navigate for redirection

  const columns = ['#', 'Customer Code', 'Name', 'Job', 'Office Name', 'Address', 'Phone Number', 'Email', 'Store', 'Due'];

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/customers`);
      if (!response.ok) {
        setError('Failed to fetch Customer list');
        return;
      }
      const customers = await response.json();

      const formattedData = customers.map(cus => [
        cus.cusId,
        cus.cusCode,
        cus.cusName,
        cus.cusJob,
        cus.cusOffice,
        cus.cusAddress,
        cus.cusPhone,
        cus.cusEmail,
        cus.cusStore,
        // Add the "Action" column with the eye icon button
        <button 
          className="btn btn-primary" 
          onClick={() => handleViewCustomer(cus.cusId)}
        >
          <Eye />
        </button>
      ]);
      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleViewCustomer = (cusId) => {
    navigate(`/cus-due/${cusId}`); // Use navigate to go to the new route
  };

  const handleDelete = async () => {
    try {
      const cusId = data[deleteRowIndex][0];
      const response = await fetch(`${config.BASE_URL}/customer/${cusId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        // Check if it's a foreign key constraint error
        if (responseData.error && responseData.error.includes('foreign key constraint fails')) {
          alert('Customer has data, cannot delete this customer');
          return;
        }
        throw new Error(responseData.error || responseData.message || 'Failed to delete customer');
      }
  
      // If deletion was successful
      setData(prevData => prevData.filter((_, index) => index !== deleteRowIndex));
      await fetchCustomer();
      
    } catch (err) {
      console.error('Error deleting customer:', err);
      // Show generic error for other types of errors
      alert(err.message);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const confirmDelete = (rowIndex) => {
    setDeleteRowIndex(rowIndex);
    setShowConfirmModal(true);
  };

  const handleEdit = (rowIndex) => {
    const selectedCusData = data[rowIndex];
    setSelectedCus({
      cusId: selectedCusData[0],
      cusName: selectedCusData[2],
      cusJob: selectedCusData[3],
      cusOffice: selectedCusData[4],
      cusAddress: selectedCusData[5],
      cusPhone: selectedCusData[6],
      cusEmail: selectedCusData[7],
      cusStore: selectedCusData[8],
    });
    setModalIsOpen(true);
  };

  const openModal = () => {
    setSelectedCus(null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    fetchCustomer();
  };

  const title = 'Customer List';
  const invoice = 'customer_list.pdf';

  return (
    <div>
      <div className="scrolling-container">
        <h4>Customer List</h4>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <Table
            data={data}
            columns={columns}
            showButton={true}
            btnName={"Add New Customer"}
            onAdd={openModal}
            onDelete={confirmDelete}
            onEdit={handleEdit}
            showDate={false}
            title={title}
            invoice={invoice}
          />
        )}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Customer Form"
        >
          <Form
            closeModal={closeModal}
            onSave={fetchCustomer}
            cus={selectedCus}
            style={{
              content: {
                width: '30%',
                height: '90%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              },
            }}
          />
        </Modal>
        {showConfirmModal && (
          <ConfirmModal
            onConfirm={handleDelete}
            onClose={() => setShowConfirmModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerList;

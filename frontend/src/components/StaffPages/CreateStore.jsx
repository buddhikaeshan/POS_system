import React, { useState, useEffect } from 'react';
import Table from '../Table/Table';
import StoreForm from '../../Models/StoreModel/StoreForm';
import ConfirmModal from '../../Models/ConfirmModal';
import config from '../../config';

const CreateStore = () => {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [storeToDelete, setStoreToDelete] = useState(null);

    const columns = ['id', 'Head name', 'Address', 'Status'];
    const btnName = 'Add Head';

    useEffect(() => {
        fetchStores();
    });

    const fetchStores = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${config.BASE_URL}/stores`);
            if (!response.ok) {
                throw new Error('Failed to fetch store list');
            }
            const stores = await response.json();
            const formattedData = stores.map(store => [
                store.storeId,
                store.storeName,
                store.storeAddress,
                <select
                    className='form-control'
                    value={store.storeStatus}
                    onChange={(e) => handleStatusChange(store.storeId, e.target.value)}
                >
                    <option value="Active">Active</option>
                    <option value="Close">Close</option>
                </select>,
            ]);
            setData(formattedData);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (storeId, newStatus) => {
        try {
            const response = await fetch(`${config.BASE_URL}/store/${storeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ storeStatus: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update store status');
            }
            fetchStores();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (rowIndex) => {
        const selectStoreData = data[rowIndex];
        setSelectedStore({
            storeId: selectStoreData[0],
            storeName: selectStoreData[1],
            storeAddress: selectStoreData[2],
        });
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!storeToDelete) return;

        try {
            const response = await fetch(`${config.BASE_URL}/store/${storeToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                alert('Failed to delete the Head, it has an active staff member.');
            }
            fetchStores();
            setShowConfirmModal(false);
        } catch (err) {
            setError(err.message);
            setShowConfirmModal(false);
        }
    };

    const openConfirmModal = (rowIndex) => {
        const storeId = data[rowIndex][0];
        setStoreToDelete(storeId);
        setShowConfirmModal(true);
    };

    const openModal = () => {
        setSelectedStore(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const title = 'Head';
    const invoice = 'Head.pdf';

    return (
        <div>
            <div className="scrolling-container">
                <h4>Head</h4>
                <Table
                    data={data}
                    columns={columns}
                    btnName={btnName}
                    onAdd={openModal}
                    onDelete={openConfirmModal}
                    onEdit={handleEdit}
                    showDate={false}
                    title={title}
                    invoice={invoice}
                />
                <StoreForm
                    showModal={showModal}
                    closeModal={closeModal}
                    onSave={fetchStores}
                    store={selectedStore}
                />

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

export default CreateStore;

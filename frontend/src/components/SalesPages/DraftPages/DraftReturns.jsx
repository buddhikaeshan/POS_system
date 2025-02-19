import React, { useEffect, useState } from 'react'
import Table from '../../Table/Table';
import ConfirmModal from '../../../Models/ConfirmModal';
import config from '../../../config';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

function DraftReturns() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReturnIndex, setSelectedReturnIndex] = useState(null);
    const [selectedReturnId, setSelectedReturnId] = useState(null);

    const Columns = [
        "Invoice No",
        "Customer Name",
        "Product Name",
        "Return Qty",
        "Return Amount",
        "Return Type",
        "Return Date",
        "Return Note",
        "Stock Name/Batch No",
        "Draft"
    ];

    const navigate = useNavigate();

    const handleCreateReturn = () => {
        navigate('/return/create');
    };

    useEffect(() => {
        fetchReturn();
    },);

    const getCustomerName = async (invoiceId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/invoice/${invoiceId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch customer details');
            }
            const invoiceData = await response.json();
            return invoiceData.customer?.cusName || '-';
        } catch (error) {
            console.error('Error fetching customer name:', error);
            return '-';
        }
    };

    const fetchReturn = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/returnProducts`);
            if (!response.ok) {
                throw new Error(`Failed to fetch return products list: ${response.status} ${response.statusText}`);
            }
            const returnProd = await response.json();

            const draftedReturns = returnProd.filter(item => item.return?.draft === false);

            const formattedData = await Promise.all(draftedReturns.map(async (returnProd, index) => {
                const stockDate = new Date(returnProd.returnDate);
                const formattedReturnDate = `${String(stockDate.getHours()).padStart(2, '0')}:${String(stockDate.getMinutes()).padStart(2, '0')} ${String(stockDate.getDate()).padStart(2, '0')}-${String(stockDate.getMonth() + 1).padStart(2, '0')}-${stockDate.getFullYear()}`;

                const invoiceId = returnProd?.invoiceProduct?.invoiceId;
                const customerName = invoiceId ? await getCustomerName(invoiceId) : 'N/A';

                return {
                    displayData: [
                        returnProd.invoiceProduct?.invoiceNo,
                        customerName,
                        returnProd.product?.productName,
                        returnProd.returnQty,
                        returnProd.returnAmount,
                        returnProd.returnItemType,
                        formattedReturnDate,
                        returnProd.returnNote || "-",
                        returnProd.stock?.stockName || "-",
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(index)}
                            style={{ fontSize: "12px" }}
                        >
                            Draft
                        </button>
                    ],
                    returnProductId: returnProd.returnProductId,
                    invoiceProductId: returnProd.invoiceProduct?.id,
                    stockId: returnProd.stock?.stockId,
                    productId: returnProd.product?.productId,
                    returnItemId: returnProd.return.returnItemId
                };
            }));

            setData(formattedData);
            setIsLoading(false);
        } catch (err) {
            setError(`Error fetching product list: ${err.message}`);
            setIsLoading(false);
        }
    };

    const handleDelete = (rowIndex) => {
        const returnProductId = data[rowIndex].returnProductId;
        setSelectedReturnIndex(rowIndex);
        setSelectedReturnId(returnProductId);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedReturnId) return;

        try {
            const response = await fetch(`${config.BASE_URL}/returnProduct/${selectedReturnId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(`Failed to delete Return Product: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
                return;
            }

            setData(prevData => prevData.filter((_, index) => index !== selectedReturnIndex));
        } catch (err) {
            setError(`Error deleting product: ${err.message}`);
        } finally {
            setIsModalOpen(false);
            setSelectedReturnIndex(null);
            setSelectedReturnId(null);
        }
    };

    const handleEdit = async (rowIndex) => {
        const returnProduct = data[rowIndex];

        try {
            const response = await fetch(`${config.BASE_URL}/returnProduct/${returnProduct.returnProductId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch return details');
            }
            const returnDetails = await response.json();

            console.log("Return Details:", returnDetails);

            navigate('/return/create', {
                state: {
                    isEditing: true,
                    returnData: {
                        returnProductId: returnProduct.returnProductId,
                        invoiceNo: returnDetails.invoiceProduct?.invoiceNo || returnProduct.displayData[0],
                        customerName: returnProduct.displayData[1],
                        productName: returnProduct.displayData[2],
                        returnQty: returnProduct.displayData[3],
                        returnAmount: returnProduct.displayData[4],
                        returnType: returnProduct.displayData[5],
                        returnDate: returnProduct.displayData[6],
                        returnNote: returnProduct.displayData[7],
                        stockName: returnProduct.displayData[8],
                        invoiceProductId: returnDetails.invoiceProduct?.id || returnProduct.invoiceProductId,
                        stockId: returnDetails.stock?.stockId || returnProduct.stockId || '',
                        productId: returnDetails.product?.productId || returnProduct.productId
                    }
                }
            });

        } catch (error) {
            console.error("Error in handleEdit:", error);
            setError(`Error fetching return details: ${error.message}`);
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
        setSelectedReturnIndex(null);
        setSelectedReturnId(null);
    };

    const title = 'Returned Product List';
    const invoice = 'Returned Product List.pdf';
    return (
        <div>
            <div className="scrolling-container">
                <h4>Draft Returns</h4>
                <div className="payment-form-button d-grid d-md-flex me-md-2 justify-content-end">
                    <button onClick={handleCreateReturn} className="btn btn-warning" style={{ fontSize: "12px" }}>
                        Create Credit Note
                    </button>
                </div>
                <div>
                    <Table
                        data={data.map(item => item.displayData)}
                        columns={Columns}
                        showButton={false}
                        showActions={true}
                        title={title}
                        invoice={invoice}
                        showDate={false}
                        showEdit={false}
                        onDelete={handleDelete}
                    />
                    {isModalOpen && (
                        <ConfirmModal
                            onConfirm={confirmDelete}
                            onClose={cancelDelete}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default DraftReturns
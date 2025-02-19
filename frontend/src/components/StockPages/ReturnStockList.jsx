import { useEffect, useState } from "react";
import ConfirmModal from "../../Models/ConfirmModal"
import Table from "../Table/Table"
import config from "../../config";
import { useNavigate } from "react-router";

function ReturnStockList() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReturnIndex, setSelectedReturnIndex] = useState(null);
    const navigate = useNavigate();

    const Columns = [
        "Id",
        "Stock Name / Batch No",
        "Product Name",
        "Return Quantity",
        "Return Type",
        "Returned Date",
        "Return Note",
    ];

    useEffect(() => {
        fetchReturnStocks();
    })

    const fetchReturnStocks = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/stocksReturns`);
            if (!response.ok) {
                setError(`Failed to fetch return products list: ${response.status} ${response.statusText}`);
            }
            const returnProd = await response.json();
            const formattedData = returnProd.map(returnProd => {

                const stockDate = new Date(returnProd.returnStockDate);
                const formattedReturnDate = `${stockDate.getFullYear()}-${String(stockDate.getMonth() + 1).padStart(2, '0')}-${String(stockDate.getDate()).padStart(2, '0')} ${String(stockDate.getHours()).padStart(2, '0')}:${String(stockDate.getMinutes()).padStart(2, '0')}`;

                return [
                    returnProd.returnStockId,
                    returnProd.stock?.stockName,
                    returnProd.product?.productName,
                    returnProd.returnStockQty,
                    returnProd.returnStockType,
                    formattedReturnDate,
                    returnProd.returnStockNote || "-",
                ]
            });
            setData(formattedData);
            setIsLoading(false);
        } catch (err) {
            setError(`Error fetching product list: ${err.message}`);
            setIsLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (selectedReturnIndex === null) return;

        try {
            const returnItem = data[selectedReturnIndex][0];
            const response = await fetch(`${config.BASE_URL}/stocksReturn/${returnItem}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(`Failed to delete return product: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
            }

            setData(prevData => prevData.filter((_, index) => index !== selectedReturnIndex));

            fetchReturnStocks();
        } catch (err) {
            setError(`Error deleting return product: ${err.message}`);
            setError('This product is used for creating invoices.');
        } finally {
            setIsModalOpen(false);
            setSelectedReturnIndex(null);
        }
    };

    const handleEdit = async (rowIndex) => {
        try {

            const returnStockId = data[rowIndex][0];

            const response = await fetch(`${config.BASE_URL}/stocksReturn/${returnStockId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch return stock details: ${response.status}`);
            }

            const returnStockDetails = await response.json();

            const editData = {
                returnStockId: returnStockDetails.returnStockId,
                stockId: returnStockDetails.stock?.stockId,
                stockName: returnStockDetails.stock?.stockName,
                productId: returnStockDetails.product?.productId,
                productName: returnStockDetails.product?.productName,
                returnQty: returnStockDetails.returnStockQty,
                returnType: returnStockDetails.returnStockType,
                returnDate: returnStockDetails.returnStockDate,
                returnNote: returnStockDetails.returnStockNote || "",
            };

            navigate('/stock/returnStock', {
                state: {
                    mode: 'edit',
                    returnStockData: editData
                }
            });
        } catch (err) {
            setError(`Error fetching return stock details: ${err.message}`);
        }
    };

    const handleDelete = (rowIndex) => {
        setSelectedReturnIndex(rowIndex);
        setIsModalOpen(true);
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
        setSelectedReturnIndex(null);
    };


    const handleCreateReturn = () => {
        navigate('/stock/returnStock');
    };

    const title = 'Returned Stock List';
    const invoice = 'Returned Stock List.pdf';

    return (
        <div>
            <div className="scrolling-container">
                <h4>Return Stocks</h4>

                <div className="payment-form-button d-grid d-md-flex me-md-2 justify-content-end">
                    <button onClick={handleCreateReturn} className="btn btn-warning" style={{ fontSize: "12px" }}>
                        Return stock
                    </button>
                </div>

                <div>
                    <Table
                        data={data}
                        columns={Columns}
                        showButton={false}
                        showActions={true}
                        title={title}
                        invoice={invoice}
                        showDate={false}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
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

export default ReturnStockList
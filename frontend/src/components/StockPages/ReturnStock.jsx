import { useEffect, useState } from "react";
import Table from "../Table/Table";
import config from "../../config";
import { useLocation, useNavigate } from "react-router";

function ReturnStock() {
    const location = useLocation();
    const navigate = useNavigate();
    const isEditMode = location.state?.mode === 'edit';
    const editData = location.state?.returnStockData;

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [data, setData] = useState([]);
    const [returnDetails, setReturnDetails] = useState([]);
    const [stockNameSearch, setStockNameSearch] = useState('');
    const [stockNameSuggestions, setStockNameSuggestions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const Columns = ["#", "product", "Qty", "price", "Stocked Date",];

    const getSriLankanTime = () => {
        const now = new Date();
        const sriLankanOffset = 5.5 * 60 * 60 * 1000;
        const sriLankanTime = new Date(now.getTime() + sriLankanOffset);
        return sriLankanTime.toISOString().slice(0, 16);
    };

    const initialFormData = {
        stockName: '',
        returnStockDate: isEditMode ? editData?.returnDate?.slice(0, 16) : getSriLankanTime(),
        prodName: '',
        returnQty: '',
        returnType: '',
        returnNote: '',
        stock: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (formData.stock) {
            fetchReturnStocks(formData.stock);
        }
    }, [formData.stock]);

    useEffect(() => {
        if (isEditMode && editData) {
            const originalDate = new Date(editData.returnDate);
            const formattedDate = originalDate.toISOString().slice(0, 16);

            setStockNameSearch(editData.stockName);

            setFormData({
                stockName: editData.stockName,
                returnStockDate: formattedDate,
                stock: editData.stockId,
            });

            setReturnDetails([{
                prodName: editData.productName,
                returnQty: editData.returnQty,
                returnType: editData.returnType,
                returnNote: editData.returnNote,
                productId: editData.productId
            }]);

            fetchReturnStocks(editData.stockId);
        }
    }, [isEditMode, editData]);


    const handleRowClick = (rowData) => {
        setReturnDetails([{
            prodName: rowData[1],
            returnQty: '',
            returnType: '',
            returnNote: '',
            productId: rowData.productId
        }]);
    };

    const handleDynamicFieldChange = (index, name, value) => {
        const updatedDetails = [...returnDetails];
        updatedDetails[index][name] = value;
        setReturnDetails(updatedDetails);
    };

    const handleStockNameSearch = async (e) => {
        const query = e.target.value;
        setStockNameSearch(query);

        if (query.length >= 2) {
            try {
                const response = await fetch(`${config.BASE_URL}/stocks/suggestions?query=${query}`);
                if (response.ok) {
                    const suggestions = await response.json();
                    setStockNameSuggestions(suggestions);
                } else {
                    console.error('Failed to fetch stock name suggestions');
                }
            } catch (error) {
                console.error('Error fetching Stock name suggestions:', error);
            }
        } else {
            setStockNameSuggestions([]);
        }
    };

    const handleStockNameSelect = async (stockName) => {
        setStockNameSearch(stockName);
        setStockNameSuggestions([]);

        try {
            const response = await fetch(`${config.BASE_URL}/stock/stockName/${stockName}`);
            if (response.ok) {
                const stock = await response.json();
                setFormData(prevData => ({
                    ...prevData,
                    stock: stock.stockId,
                    stockName: stock.stockName,
                }));
            } else {
                console.error('stock not found');
            }
        } catch (error) {
            console.error('Error fetching stock details:', error);
        }
    };

    const fetchReturnStocks = async (stockId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/stock/${stockId}`);
            console.log('stockId', stockId);

            if (response.ok) {
                const stock = await response.json();
                const formattedData = stock.map((stock) => {
                    const stockDate = new Date(stock.stockDate);
                    const formattedStockDate = `${stockDate.getFullYear()}-${String(stockDate.getMonth() + 1).padStart(2, '0')}-${String(stockDate.getDate()).padStart(2, '0')} ${String(stockDate.getHours()).padStart(2, '0')}:${String(stockDate.getMinutes()).padStart(2, '0')}`;

                    const visibleData = [
                        stock.stockId,
                        stock.product?.productName || "Unknown",
                        stock.stockQty,
                        stock.unitPrice,
                        formattedStockDate,
                    ];

                    Object.defineProperty(visibleData, 'productId', {
                        value: stock.product?.productId,
                        enumerable: false,
                        configurable: true,
                        writable: true
                    });

                    return visibleData;
                });
                setData(formattedData);
            } else {
                console.error('stock not found');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const validateForm = () => {
        if (!formData.stock) {
            setError("Please select a stock");
            return false;
        }
        if (returnDetails.length === 0) {
            setError("Please select at least one product to return");
            return false;
        }

        const detail = returnDetails[0];
        if (!detail.returnQty || detail.returnQty <= 0) {
            setError("Please enter a valid return quantity");
            return false;
        }
        if (!detail.returnType || detail.returnType === " ") {
            setError("Please select a return type");
            return false;
        }

        const stockItem = data.find(item => item[1] === detail.prodName);
        if (!stockItem) {
            setError("Selected product not found in stock");
            return false;
        }
        if (detail.returnQty > stockItem[2]) {
            setError("Return quantity cannot exceed stock quantity");
            return false;
        }

        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!validateForm()) {
                setIsSubmitting(false);
                return;
            }

            const detail = returnDetails[0];
            const stockItem = data.find(item => item[1] === detail.prodName);

            const returnStockData = {
                returnStockDate: formData.returnStockDate,
                returnStockQty: parseInt(detail.returnQty),
                returnStockAmount: stockItem[3] * parseInt(detail.returnQty),
                returnStockType: detail.returnType,
                returnStockNote: detail.returnNote || "",
                stockId: formData.stock,
                productId: stockItem.productId
            };

            const url = isEditMode
                ? `${config.BASE_URL}/stocksReturn/${editData.returnStockId}`
                : `${config.BASE_URL}/stocksReturn`;

            const requestBody = isEditMode ? returnStockData : [returnStockData];

            console.log('Submitting data:', requestBody);

            const response = await fetch(url, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit return stock');
            }

            setSuccessMessage(result.message);
            setTimeout(() => {
                navigate('/stock/returnStockList');
            }, 1500);

        } catch (error) {
            console.error('Error submitting return stock:', error);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData((prev) => ({
            ...prev,
            stockName: '',
            prodName: '',
            returnQty: '',
            returnType: '',
            returnNote: '',
        }));
        setData([]);
        setReturnDetails([]);
        setStockNameSearch([]);
    };

    return (
        <div className="scrolling-container">
            <h4 className="mb-4">{isEditMode ? 'Edit Return Stock' : 'Return Stock'}</h4>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className='mb-2' style={{ paddingLeft: '20px' }}>
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Stock Name/ Batch No</label>
                        <input
                            type="text"
                            name="stockNameSearch"
                            className="form-control"
                            value={stockNameSearch}
                            onChange={handleStockNameSearch}
                            placeholder="Enter the Stock Name or Batch No"
                            required
                        />
                        {stockNameSuggestions.length > 0 && (
                            <ul className="list-group mt-0">
                                {stockNameSuggestions.map((stock, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleStockNameSelect(stock.stockName)}
                                    >
                                        <strong>{stock.stockName}</strong> - {stock.product?.productName || "Unknown Product"}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="col-md-3 mb-3">
                        <label className="form-label">Date/Time</label>
                        <input type="datetime-local" className="form-control" name="returnStockDate" value={formData.returnStockDate} disabled={!isEditMode} />
                    </div>

                    <div className="col-md-12">
                        <div className="product-table">
                            <Table
                                data={data || []}
                                columns={Columns}
                                showSearch={false}
                                showButton={false}
                                showActions={false}
                                showRow={false}
                                showDate={false}
                                showPDF={false}
                                onRowClick={handleRowClick}
                            />
                        </div>
                    </div>

                    {returnDetails.map((detail, index) => (
                        <div className='row' key={index}>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="prodName"
                                    value={detail.prodName}
                                    onChange={(e) => handleDynamicFieldChange(index, 'prodName', e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Stock Return Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="returnQty"
                                    value={detail.returnQty}
                                    onChange={(e) => handleDynamicFieldChange(index, 'returnQty', e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Stock Return Type</label>
                                <select
                                    name="returnType"
                                    className='form-control'
                                    value={detail.returnType}
                                    onChange={(e) => handleDynamicFieldChange(index, 'returnType', e.target.value)}
                                >
                                    <option value=" ">Select Options</option>
                                    <option value="Refund">Refund</option>
                                    <option value="Damage">Damage</option>
                                    <option value="Exchange ">Exchange </option>
                                    <option value="Warranty">Warranty Claim</option>
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Stock Return Note</label>
                                <textarea
                                    className="form-control"
                                    name="returnNote"
                                    value={detail.returnNote}
                                    onChange={(e) => handleDynamicFieldChange(index, 'returnNote', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                </div>
            </form>

            <div className="d-grid d-md-flex me-md-2 justify-content-end px-5">
                <button className="btn btn-danger btn-md mb-2" type="reset" onClick={resetForm}>Clear</button>
                <button className="btn btn-primary btn-md mb-2" type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : (isEditMode ? 'Update' : 'Proceed')}
                </button>
            </div>
        </div>
    );
}

export default ReturnStock;

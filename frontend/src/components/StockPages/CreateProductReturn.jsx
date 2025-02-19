import React, { useEffect, useState } from 'react';
import config from '../../config';
import Table from '../Table/Table';
import { useLocation, useNavigate } from 'react-router';

const CreateProductReturn = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const isEditing = location.state?.isEditing;
    const editData = location.state?.returnData;

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [stores, setStores] = useState([]);
    const [users, setUsers] = useState([]);
    const [data, setData] = useState([]);
    const [returnDetails, setReturnDetails] = useState([]);
    const [isDraft, setIsDraft] = useState(false);
    const Columns = ["#", "product", "Qty", "price", "Warranty",];

    const getSriLankanTime = () => {
        const now = new Date();
        const sriLankanOffset = 5.5 * 60 * 60 * 1000;
        const sriLankanTime = new Date(now.getTime() + sriLankanOffset);
        return sriLankanTime.toISOString().slice(0, 16);
    };

    const initialFormData = {
        invoiceNo: '',
        user: '',
        userName: '',
        store: '',
        returnDate: getSriLankanTime(),
        prodName: '',
        returnQty: '',
        returnType: '',
        returnNote: '',
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        purchaseNo: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchStores();
        fetchUsers();
        fetchUserId();

        if (isEditing && editData) {
            console.log("Setting edit data:", editData);
            setFormData(prev => ({
                ...prev,
                invoiceNo: editData.invoiceNo,
                returnDate: getSriLankanTime(),
            }));

            setReturnDetails([{
                prodName: editData.productName,
                returnQty: editData.returnQty,
                returnType: editData.returnType,
                returnNote: editData.returnNote,
                invoiceProductId: editData.invoiceProductId,
                stockId: editData.stockId,
                productId: editData.productId
            }]);

            const initializeEditData = async () => {
                try {
                    await fetchInvoiceData(editData.invoiceNo);
                    await fetchCusData(editData.invoiceNo);
                } catch (error) {
                    console.error("Error initializing edit data:", error);
                    setError("Failed to load customer and invoice data");
                }
            };

            initializeEditData();
        }
    }, [isEditing, editData]);

    const handleRowClick = (rowData) => {
        setReturnDetails((prevDetails) => [
            ...prevDetails,
            {
                prodName: rowData[1],
                returnQty: '',
                returnType: '',
                returnNote: '',
                invoiceProductId: rowData.invoiceProductId,
                stockId: rowData.stockId,
                productId: rowData[0]
            },
        ]);
    };

    const handleDynamicFieldChange = (index, name, value) => {
        const updatedDetails = [...returnDetails];
        updatedDetails[index][name] = value;
        setReturnDetails(updatedDetails);
    };

    const fetchInvoiceData = async (invoiceNo) => {
        try {
            const response = await fetch(`${config.BASE_URL}/invoiceProduct/${invoiceNo}`);
            if (response.ok) {
                const invoiceData = await response.json();
                const formattedData = invoiceData.map((inv) => {
                    const rowData = [
                        inv.product?.productId,
                        inv.product?.productName,
                        inv.invoiceQty,
                        inv.unitAmount,
                        inv.product?.productWarranty || " - ",
                    ];

                    Object.defineProperties(rowData, {
                        invoiceProductId: {
                            value: inv.id,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        },
                        stockId: {
                            value: inv.stock?.stockId,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        },
                        productId: {
                            value: inv.product?.productId,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });

                    return rowData;
                });
                setData(formattedData);
                return invoiceData;
            } else {
                // throw new Error('Invoice not found');
            }
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    const fetchUserId = async () => {
        const userName = localStorage.getItem('userName');
        if (userName) {
            try {
                const response = await fetch(`${config.BASE_URL}/user/name/${userName}`);
                if (!response.ok) throw new Error('User not found');
                const userData = await response.json();

                setFormData(prev => ({
                    ...prev,
                    user: userData.userId,
                    userName: userData.userName,
                }));
            } catch (err) {
                setError(err.message);
            }
        } else {
            setError('No username found in local storage.');
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            if (name === "invoiceNo" && value.length < (prev.invoiceNo?.length || 0)) {
                resetForm();
                return {};
            }

            return {
                ...prev,
                [name]: value,
            };
        });

        if (name === "invoiceNo" && value) {
            await fetchInvoiceData(value);
            await fetchCusData(value);
        }
    };

    const fetchInvoiceId = async (invoiceNo) => {
        try {
            const response = await fetch(`${config.BASE_URL}/invoice/invoiceNo/${invoiceNo}`);
            if (response.ok) {
                const invoiceData = await response.json();
                return invoiceData.invoiceId;
            } else {
                throw new Error('Invoice not found');
            }
        } catch (error) {
            setError(error.message);
            return null;
        }
    };

    const fetchCusData = async (invoiceNo) => {
        try {
            const response = await fetch(`${config.BASE_URL}/invoice/invoiceNo/${invoiceNo}`);

            if (!response.ok) {
                console.error('Failed to fetch customer data');
            }

            const inv = await response.json();
            const invData = Array.isArray(inv) ? inv[0] : inv;

            if (!invData) {
                throw new Error('No invoice data found');
            }

            setFormData(prev => ({
                ...prev,
                customerName: invData.customer?.cusName || '',
                customerPhone: invData.customer?.cusPhone || '',
                customerAddress: invData.customer?.cusAddress || '',
                purchaseNo: invData.purchaseNo || ''
            }));

        } catch (error) {
            console.error('Error in fetchCusData:', error);
            // setError(`Failed to fetch customer data: ${error.message}`);
        }
    };

    const changeStatus = async () => {
        try {
            if (!formData.invoiceNo) {
                setError("Please enter an invoice number");
                return;
            }

            if (returnDetails.length === 0) {
                setError("Please provide return details for the products.");
                return;
            }

            setIsDraft(true);

            if (isEditing && editData) {
                const returnProductResponse = await fetch(`${config.BASE_URL}/returnProduct/${editData.returnProductId}`);
                const returnProductData = await returnProductResponse.json();
                const returnItemId = returnProductData[0]?.returnItemId;

                if (!returnItemId) {
                    throw new Error("Return item ID not found in returnProduct table.");
                }

                const returnUpdateResponse = await fetch(`${config.BASE_URL}/return/${returnItemId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        returnItemDate: formData.returnDate,
                        storeId: formData.store,
                        userId: formData.user,
                        draft: false
                    })
                });

                if (!returnUpdateResponse.ok) {
                    const errorData = await returnUpdateResponse.json();
                    throw new Error(errorData.message || 'Failed to update return status');
                }

                const detail = returnDetails[0];
                const matchingRow = data.find(row => row[1] === detail.prodName);
                if (!matchingRow) {
                    throw new Error(`No matching row found for product: ${detail.prodName}`);
                }

                const unitAmount = parseFloat(matchingRow[3]);
                const returnAmount = unitAmount * parseFloat(detail.returnQty);

                const updateData = {
                    returnQty: parseInt(detail.returnQty, 10),
                    returnItemType: detail.returnType,
                    returnNote: detail.returnNote || "",
                    returnAmount: returnAmount,
                    returnDate: formData.returnDate,
                    stockId: detail.stockId || '',
                    productId: detail.productId,
                    invoiceProductId: detail.invoiceProductId,
                    returnItemId: returnItemId
                };

                const returnProductUpdateResponse = await fetch(`${config.BASE_URL}/returnProduct/${editData.returnProductId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                });

                if (!returnProductUpdateResponse.ok) {
                    const errorData = await returnProductUpdateResponse.json();
                    throw new Error(errorData.message || 'Failed to update return product');
                }

                setSuccessMessage("Return has been updated successfully!");
                setTimeout(() => {
                    navigate('/return/list');
                }, 1500);

            } else {
                const invoiceId = await fetchInvoiceId(formData.invoiceNo);
                if (!invoiceId) {
                    setError("Invoice ID not found for the entered invoice number");
                    return;
                }

                const returnResponse = await fetch(`${config.BASE_URL}/return`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        returnItemDate: formData.returnDate,
                        storeId: formData.store,
                        userId: formData.user,
                        invoiceId,
                        draft: false
                    }),
                });

                if (!returnResponse.ok) {
                    const errorData = await returnResponse.json();
                    throw new Error(errorData.message || "Failed to save draft.");
                }

                const createdReturn = await returnResponse.json();

                const returnItems = await Promise.all(returnDetails.map(async (detail) => {
                    const matchingRow = data.find(row => row[1] === detail.prodName);
                    if (!matchingRow) {
                        throw new Error(`No matching row found for product: ${detail.prodName}`);
                    }

                    const unitAmount = parseFloat(matchingRow[3]);
                    const returnAmount = unitAmount * parseFloat(detail.returnQty);

                    return {
                        returnQty: parseInt(detail.returnQty, 10),
                        returnItemType: detail.returnType,
                        returnNote: detail.returnNote || "",
                        invoiceProductId: matchingRow.invoiceProductId,
                        stockId: matchingRow.stockId,
                        returnItemId: createdReturn.returnItemId,
                        returnAmount,
                        returnDate: formData.returnDate,
                        productId: matchingRow[0],
                    };
                }));

                const returnProductResponse = await fetch(`${config.BASE_URL}/returnProduct`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(returnItems),
                });

                if (!returnProductResponse.ok) {
                    const errorData = await returnProductResponse.json();
                    throw new Error(errorData.message || "Failed to save draft products.");
                }

                setSuccessMessage("Return has been saved successfully!✅");
                setTimeout(() => {
                    resetForm();
                }, 1500);
            }
        } catch (error) {
            console.error("Error saving draft:", error);
            setError(error.message);
            setIsDraft(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!formData.invoiceNo) {
            setError("Please enter an invoice number");
            return;
        }

        if (returnDetails.length === 0) {
            setError("Please provide return details for the products.");
            return;
        }

        for (const detail of returnDetails) {
            if (!detail.returnQty || detail.returnQty <= 0) {
                setError("Return quantity must be greater than 0");
                return;
            }
            if (!detail.returnType || detail.returnType.trim() === "") {
                setError("Please select a return type for all products");
                return;
            }
        }

        try {
            if (isEditing) {
                const detail = returnDetails[0];

                const returnProductResponse = await fetch(`${config.BASE_URL}/returnProduct/${editData.returnProductId}`);
                const returnProductData = await returnProductResponse.json();
                const returnItemId = returnProductData[0]?.returnItemId;

                if (!returnItemId) {
                    throw new Error("Return item ID not found in returnProduct table.");
                }
                console.log("Fetched returnItemId:", returnItemId);

                const returnUpdateResponse = await fetch(`${config.BASE_URL}/return/${returnItemId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        returnItemDate: formData.returnDate,
                        storeId: formData.store,
                        userId: formData.user,
                        draft: true
                    })
                });

                if (!returnUpdateResponse.ok) {
                    const errorData = await returnUpdateResponse.json();
                    throw new Error(errorData.message || 'Failed to update return status');
                }

                const matchingRow = data.find(row => row[1] === detail.prodName);
                if (!matchingRow) {
                    throw new Error(`No matching row found for product: ${detail.prodName}`);
                }

                const unitAmount = parseFloat(matchingRow[3]);
                const returnAmount = unitAmount * parseFloat(detail.returnQty);

                const updateData = {
                    returnQty: parseInt(detail.returnQty, 10),
                    returnItemType: detail.returnType,
                    returnNote: detail.returnNote || "",
                    returnAmount: returnAmount,
                    returnDate: formData.returnDate,
                    stockId: detail.stockId || '',
                    productId: detail.productId,
                    invoiceProductId: detail.invoiceProductId,
                    returnItemId: returnItemId
                };

                const returnProductUpdateResponse = await fetch(`${config.BASE_URL}/returnProduct/${editData.returnProductId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                });

                if (!returnProductUpdateResponse.ok) {
                    const errorData = await returnProductUpdateResponse.json();
                    throw new Error(errorData.message || 'Failed to update return product');
                }

                setSuccessMessage('Return updated and saved as draft successfully');
                setTimeout(() => {
                    navigate('/return/list');
                }, 1500);

            } else {
                const invoiceId = await fetchInvoiceId(formData.invoiceNo);
                if (!invoiceId) {
                    setError("Invoice ID not found for the entered invoice number");
                    return;
                }

                const returnResponse = await fetch(`${config.BASE_URL}/return`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        returnItemDate: formData.returnDate,
                        storeId: formData.store,
                        userId: formData.user,
                        invoiceId,
                        draft: true
                    }),
                });

                if (!returnResponse.ok) {
                    const errorData = await returnResponse.json();
                    throw new Error(errorData.message || "Failed to create return.");
                }

                const createdReturn = await returnResponse.json();

                const returnItems = await Promise.all(returnDetails.map(async (detail) => {
                    const matchingRow = data.find(row => row[1] === detail.prodName);
                    if (!matchingRow) {
                        throw new Error(`No matching row found for product: ${detail.prodName}`);
                    }

                    const unitAmount = parseFloat(matchingRow[3]);
                    const invoiceProductId = matchingRow.invoiceProductId;
                    const stockId = matchingRow.stockId;

                    if (!invoiceProductId) {
                        throw new Error(`Invalid invoice product ID for product: ${detail.prodName}`);
                    }

                    if (!stockId) {
                        throw new Error(`Invalid stock ID for product: ${detail.prodName}`);
                    }

                    if (!createdReturn.returnItemId) {
                        throw new Error('Return item ID is missing');
                    }

                    const returnAmount = unitAmount * parseFloat(detail.returnQty);
                    if (isNaN(returnAmount)) {
                        throw new Error(`Invalid return amount calculation for product: ${detail.prodName}`);
                    }

                    return {
                        returnQty: parseInt(detail.returnQty, 10),
                        returnItemType: detail.returnType,
                        returnNote: detail.returnNote || "",
                        invoiceProductId: invoiceProductId,
                        stockId: stockId,
                        returnItemId: createdReturn.returnItemId,
                        returnAmount,
                        returnDate: formData.returnDate,
                        productId: matchingRow[0],
                    };
                }));

                const returnProductResponse = await fetch(`${config.BASE_URL}/returnProduct`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(returnItems),
                });

                if (!returnProductResponse.ok) {
                    const errorData = await returnProductResponse.json();
                    throw new Error(errorData.message || "Failed to create return products.");
                }

                setSuccessMessage(formData.draft ? "Return saved as draft." : "Return created successfully.");
                setTimeout(() => {
                    resetForm();
                }, 1500);
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            setError(error.message);
        }
    };

    const fetchStores = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/stores`);
            if (!response.ok) throw new Error('Failed to fetch stores');
            const storesData = await response.json();
            setStores(storesData);

            if (storesData.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    store: storesData[0].storeId,
                }));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const usersData = await response.json();
            setUsers(usersData);
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setFormData((prev) => ({
            ...prev,
            invoiceNo: '',
            prodName: '',
            returnQty: '',
            returnType: '',
            returnNote: '',
            customerName: '',
            customerPhone: '',
            customerAddress: '',
            purchaseNo: '',
            draft: false
        }));
        setData([]);
        setReturnDetails([]);
        setIsDraft(false);
        setSuccessMessage(null);
        setError(null);
    };

    return (
        <div className="scrolling-container">
            <h4>Create Product Return</h4>
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
                    <div className='row'>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Invoice Number</label>
                            <input type="number" className="form-control" name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} onWheel={(e) => e.target.blur()} placeholder='Enter the Invoice No' />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Cashier</label>
                            <input type="text" name="userName" value={formData.userName} className="form-control" disabled />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Store</label>
                            <input type="text" className="form-control" name="store"
                                value={stores.find(store => store.storeId === formData.store)?.storeName || ""}
                                disabled
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Date/Time</label>
                            <input type="datetime-local" className="form-control" name="returnDate" value={formData.returnDate} onChange={handleChange} disabled />
                        </div>
                    </div>
                    {formData.invoiceNo && (
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Purchase No</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.purchaseNo}
                                    disabled
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Customer Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.customerName}
                                    disabled
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Contact Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.customerPhone}
                                    disabled
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.customerAddress}
                                    disabled
                                />
                            </div>
                        </div>
                    )}
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
                                <label className="form-label">Return Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="returnQty"
                                    value={detail.returnQty}
                                    onChange={(e) => handleDynamicFieldChange(index, 'returnQty', e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Return Type</label>
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
                                <label className="form-label">Return Note</label>
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
                <button className="btn btn-danger btn-md mb-2" type="button" onClick={resetForm}>Clear</button>
                <button className="btn btn-warning btn-md mb-2" type="submit" onClick={handleSubmit}>
                    {isEditing ? 'Create Credit Note' : 'Create Credit Note'}
                </button>
                <button
                    className={`btn ${isDraft ? 'btn-primary' : 'btn-primary'} btn-md mb-2`}
                    type="button"
                    onClick={changeStatus}
                    disabled={isDraft}
                >
                    {isDraft ? 'Draft' : 'Draft'}
                </button>
            </div>
            
            {/* <div className="d-grid d-md-flex me-md-2 justify-content-end px-5">
                <button className="btn btn-danger btn-md mb-2" type="button" onClick={resetForm}>Clear</button>
                <button className="btn btn-warning btn-md mb-2" type="submit" onClick={handleSubmit}>
                    {isEditing ? 'Create Credit Note' : 'Create Credit Note'}
                </button>
                <button
                    className={`btn ${isDraft ? 'btn-primary' : 'btn-primary'} btn-md mb-2`}
                    type="button"
                    onClick={changeStatus}
                    disabled={isDraft}
                >
                    {isDraft ? 'Draft' : 'Draft'}
                </button>
            </div> */}
        </div>
    );
};

export default CreateProductReturn;
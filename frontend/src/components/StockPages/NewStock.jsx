import React, { useEffect, useState } from 'react';
import './NewStock.css';
import Table from '../Table/Table';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const NewStock = () => {

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [data, setData] = useState([]);
  const [preview, setPreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierSuggestions, setSupplierSuggestions] = useState([]);
  const [tableData, setTableData] = useState(data || []);
  const [chequeDetails, setChequeDetails] = useState([]);
  const [displayTableData, setDisplayTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const columns = ['Stock Name', 'Supplier Name', 'Product Name', 'Category', 'Unit Price', 'Quantity', 'Description', 'Total Price'];

  const [formData, setFormData] = useState({
    stockName: '',
    supplier: '',
    supplierName: '',
    supplierSearch: '',
    productSearch: '',
    category: '',
    mfd: '',
    exp: '',
    price: '',
    qty: '',
    description: '',
    totalPrice: '',

    totalQty: '',
    total: '',
    vat: '',
    cashAmount: '',
    chequeAmount: '',
    due: '',
    vatWithTotal: '',

    chequeNumber: '',
    chequeAmounts: '',
    chequeDate: '',
  });

  const initialFormState = {
    stockName: '',
    supplier: '',
    supplierName: '',
    supplierSearch: '',
    productSearch: '',
    category: '',
    mfd: '',
    exp: '',
    price: '',
    qty: '',
    description: '',

    total: '',
    vat: '',
    cashAmount: '',
    chequeAmount: '',
    due: '',
    vatWithTotal: '',

    chequeNumber: '',
    chequeAmounts: '',
    chequeDate: '',
  };

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, []);

  //categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  //suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/suppliers`);
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      } else {
        console.error('Failed to fetch suppliers');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  //product search
  const handleProductSearch = async (e) => {
    const query = e.target.value;
    setProductSearch(query);

    if (query.length >= 2) {
      try {
        const response = await fetch(`${config.BASE_URL}/products/suggestions?query=${query}`);
        if (response.ok) {
          const suggestions = await response.json();
          setProductSuggestions(suggestions);
        } else {
          console.error('Failed to fetch product suggestions');
        }
      } catch (error) {
        console.error('Error fetching product suggestions:', error);
      }
    } else {
      setProductSuggestions([]);
    }
  };

  //product select
  const handleProductSelect = async (productName) => {
    setProductSearch(productName);
    setProductSuggestions([]);

    try {
      const response = await fetch(`${config.BASE_URL}/product/productName/${productName}`);
      if (response.ok) {
        const product = await response.json();
        setFormData(prevData => ({
          ...prevData,
          product: product.productId,
          category: product.category_categoryId,
        }));
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  //supplier search
  const handleSupplierSearch = async (e) => {
    const query = e.target.value;
    setSupplierSearch(query);

    if (query.length >= 2) {
      try {
        const response = await fetch(`${config.BASE_URL}/suppliers/suggestions?query=${query}`);
        if (response.ok) {
          const suggestions = await response.json();
          setSupplierSuggestions(suggestions);
        } else {
          console.error('Failed to fetch supplier suggestions');
        }
      } catch (error) {
        console.error('Error fetching supplier suggestions:', error);
      }
    } else {
      setSupplierSuggestions([]);
    }
  };

  //supplier select
  const handleSupplierSelect = async (supplierName) => {
    setSupplierSearch(supplierName);
    setSupplierSuggestions([]);

    try {
      const response = await fetch(`${config.BASE_URL}/supplier/supplierName/${supplierName}`);
      if (response.ok) {
        const supplier = await response.json();
        setFormData(prevData => ({
          ...prevData,
          supplier: supplier.supplierId,
          supplierName: supplier.supplierName,
        }));
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };


  const resetForm = () => {
    setFormData(initialFormState);
    setPreview('');
    setProductSearch('');
    setSupplierSearch('');
    setChequeDetails([]);
    setTableData([]);
    setDisplayTableData([]);
  };

  const navigate = useNavigate();

  const handleNewStockClick = () => {
    navigate('/stock-reports/current-stock');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData };

      // Convert empty strings to '0'
      newData[name] = value === '' ? '0' : value;

      // Calculate totalPrice when price or qty changes
      if (name === 'price' || name === 'qty') {
        const price = parseFloat(newData.price) || 0;
        const qty = parseFloat(newData.qty) || 0;
        newData.totalPrice = (price * qty).toFixed(2);
      }

      // Calculate VAT and total price with VAT first
      if (name === 'vat' || name === 'total') {
        const vat = parseFloat(newData.vat) || 0;
        const total = parseFloat(newData.total) || 0;
        const vatAmount = (vat / 100) * total;
        newData.vatWithTotal = (total + vatAmount).toFixed(2);
      }

      // Calculate due amount after VAT calculation
      const vatWithTotal = parseFloat(newData.vatWithTotal) || 0;
      const cashAmount = parseFloat(newData.cashAmount) || 0;
      const chequeAmount = parseFloat(newData.chequeAmount) || 0;
      const totalPaidAmount = cashAmount + chequeAmount;

      newData.due = (vatWithTotal - totalPaidAmount).toFixed(2);

      return newData;
    });
  };

  useEffect(() => {
    const totalChequeAmount = chequeDetails.reduce(
      (sum, detail) => sum + (parseFloat(detail.chequeAmounts) || 0),
      0
    );

    const cashAmount = parseFloat(formData.cashAmount) || 0;
    const vatWithTotal = parseFloat(formData.vatWithTotal) || 0;

    const totalPaid = totalChequeAmount + cashAmount;

    setFormData((prevData) => ({
      ...prevData,
      chequeAmount: totalChequeAmount.toFixed(2),
      due: (vatWithTotal - totalPaid).toFixed(2),
    }));
  }, [chequeDetails, formData.cashAmount, formData.vatWithTotal]);

  const handleAddChequeField = () => {
    setChequeDetails((prevDetails) => [...prevDetails, { chequeNumber: '', chequeAmounts: '', chequeDate: '' }]);
  };

  const handleDynamicFieldChange = (index, name, value) => {
    setChequeDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index][name] = value;
      return updatedDetails;
    });
  };

  const handleClickChequeAmount = (chequeAmount) => {
    setChequeDetails((prevDetails) => [...prevDetails, { chequeAmount }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const getSriLankanTime = () => {
        const now = new Date();
        const sriLankanOffset = 5.5 * 60 * 60 * 1000;
        const sriLankanTime = new Date(now.getTime() + sriLankanOffset);
        return sriLankanTime.toISOString().slice(0, 16);
      };

      const stock = tableData.map(row => ({
        stockName: row[0],
        supplier_supplierId: row[1],
        products_productId: row[2],
        category_categoryId: row[3],
        unitPrice: parseFloat(row[4]),
        stockQty: parseInt(row[5]),
        stockPrice: parseFloat(row[7]),
        stockDescription: row[9],
        stockStatus: 'In Stock',
        stockDate: getSriLankanTime(),
      }));

      const invalidRows = stock
        .map((item, index) => {
          const errors = [];
          if (!item.stockName) errors.push("Stock Name is missing");
          if (isNaN(item.stockPrice)) errors.push("Stock Price is invalid");
          if (!item.stockQty || isNaN(item.stockQty)) errors.push("Quantity is required and must be a valid number");
          return errors.length ? { rowIndex: index + 1, errors } : null;
        })
        .filter(Boolean);

      if (invalidRows.length > 0) {
        const errorDetails = invalidRows
          .map(row => `Row ${row.rowIndex}: ${row.errors.join(", ")}`)
          .join("\n");
        setError(`Failed to create new stock. Please try again.\nValidation errors:\n${errorDetails}`);
        return;
      }

      const stockDataResponse = await fetch(`${config.BASE_URL}/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stock),
      });

      console.log('Raw response:', stockDataResponse);
      if (!stockDataResponse.ok) {
        const errorData = await stockDataResponse.json();
        console.error('Error details:', errorData);
        throw new Error(errorData.error || 'Failed to submit stock data');
      }

      const stockResult = await stockDataResponse.json();
      console.log('Stock API Response:', stockResult);

      let createdStockId = null;

      if (stockResult.stocks && Array.isArray(stockResult.stocks) && stockResult.stocks.length > 0) {
        createdStockId = stockResult.stocks[0].stockId;
      }

      if (!createdStockId) {
        console.error('No valid stockId returned from API:', stockResult);
        throw new Error('No valid stockId returned from API.');
      }

      console.log('Extracted stockId:', createdStockId);

      // StockPayment Data
      const stockPaymentData = {
        cashAmount: formData.cashAmount || 0,
        chequeAmount: formData.chequeAmount || 0,
        due: formData.due || 0,
        vat: formData.vat || 0,
        total: formData.vatWithTotal || 0,
        stockQty: formData.totalQty || 0,
        supplierId: stock[0].supplier_supplierId,
        stockPayDate: getSriLankanTime(),
        stockId: createdStockId,
      };


      console.log('Sending transaction data:', stockPaymentData);

      const stockPaymentResponse = await fetch(`${config.BASE_URL}/stockPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stockPaymentData),
      });

      if (!stockPaymentResponse.ok) {
        const errorData = await stockPaymentResponse.json();
        console.error('Stock payment error details:', errorData);
        throw new Error(errorData.error || 'Failed to create stock payment');
      }

      const stockPaymentResult = await stockPaymentResponse.json();
      console.log('Stock payment created:', stockPaymentResult);

      if (!stockPaymentResult || !stockPaymentResult.payment) {
        throw new Error('Invalid stock payment response structure');
      }

      const { payment } = stockPaymentResult;

      if (!payment.stockPaymentId) {
        throw new Error('Stock payment response missing stockPaymentId');
      }

      // Check if we want to submit cheque details
      const includeChequeDetails = chequeDetails.length > 0;
      if (includeChequeDetails) {
        const chequeData = chequeDetails.map(detail => ({
          chequeNumber: detail.chequeNumber,
          chequeAmount: parseFloat(detail.chequeAmounts) || 0,
          issuedDate: getSriLankanTime(),
          chequeDate: detail.chequeDate,
          supplierId: stock[0].supplier_supplierId,
          stockPaymentId: payment.stockPaymentId,
        }));

        const chequeResponse = await fetch(`${config.BASE_URL}/cheque`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chequeData),
        });

        if (!chequeResponse.ok) {
          const chequeError = await chequeResponse.json();
          throw new Error(`Cheque creation failed: ${chequeError.message || chequeResponse.statusText}`);
        }
      }

      setSuccessMessage('Stock added successfully!');
      setError(null);
      resetForm();
      setTableData([]);
      setDisplayTableData([]);
    } catch (Error) {
      console.error('Error submitting stock data:', Error);
      setError(Error.message || 'Failed to create new stock. Please try again.');
    }
  };

  const handleAddStock = (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!formData.stockName) missingFields.push("Stock Name");
    if (!formData.supplier) missingFields.push("Supplier");
    if (!formData.category) missingFields.push("Category");
    if (!formData.price) missingFields.push("Unit Price");
    if (!formData.qty) missingFields.push("Quantity");

    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields:\n${missingFields.join('\n')}`);
      return;
    }

    const newRow = [
      formData.stockName,
      formData.supplier,
      formData.product,
      formData.category,
      formData.price,
      formData.qty,
      formData.description,
      formData.totalPrice,
    ];

    const displayRow = [
      formData.stockName,
      formData.supplierName,
      productSearch,
      categories.find((c) => c.categoryId === formData.category)?.categoryName || '',
      formData.price,
      formData.qty,
      formData.description,
      formData.totalPrice,
    ];

    if (editIndex !== null) {
      const updatedTableData = [...tableData];
      updatedTableData[editIndex] = newRow;
      setTableData(updatedTableData);

      const updatedDisplayData = [...displayTableData];
      updatedDisplayData[editIndex] = displayRow;
      setDisplayTableData(updatedDisplayData);
      setEditIndex(null);
    } else {
      setTableData((prevData) => [...prevData, newRow]);
      setDisplayTableData((prevData) => [...prevData, displayRow]);
    }

    setProductSearch('');
    setProductSuggestions([]);
    setFormData(prevData => ({
      ...prevData,
      product: '',
      category: '',
      price: '',
      qty: '',
      totalPrice: '',
    }));
  };

  const handleEdit = (index) => {
    const displayRow = displayTableData[index];
    const rawRow = tableData[index];

    setFormData((prev) => ({
      ...prev,
      stockName: rawRow[0],
      supplier: rawRow[1],
      product: rawRow[2],
      category: rawRow[3],
      price: rawRow[4],
      qty: rawRow[5],
      description: rawRow[6],
      totalPrice: rawRow[7],
      supplierName: displayRow[1],
    }));

    setProductSearch(displayRow[2]);
    setSupplierSearch(displayRow[1]);
    setEditIndex(index);
  };

  useEffect(() => {
    const totalQuantity = tableData.reduce((sum, row) => sum + (parseInt(row[5]) || 0), 0);
    const totalAmount = tableData.reduce((sum, row) => sum + (parseFloat(row[7]) || 0), 0);

    setFormData((prevData) => {
      const vat = parseFloat(prevData.vat) || 0;
      const vatAmount = (vat / 100) * totalAmount;
      const vatWithTotal = totalAmount + vatAmount;
      const cashAmount = parseFloat(prevData.cashAmount) || 0;
      const chequeAmount = parseFloat(prevData.chequeAmount) || 0;
      const totalPaid = cashAmount + chequeAmount;

      return {
        ...prevData,
        totalQty: totalQuantity.toString(),
        total: totalAmount.toFixed(2),
        vatWithTotal: vatWithTotal.toFixed(2),
        due: (vatWithTotal - totalPaid).toFixed(2)
      };
    });
  }, [tableData]);

  const handleDelete = (rowIndex) => {
    setTableData(prevData => prevData.filter((_, index) => index !== rowIndex));
    setDisplayTableData(prevData => prevData.filter((_, index) => index !== rowIndex));
  };



  return (
    <div className="scrolling-container">
      <div className="container-fluid my-5 mt-2">
        <h4 className="mb-4">Create New Stock</h4>
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

        <div className="d-flex justify-content-end mt-4">
          <button className='btn btn-warning' onClick={handleNewStockClick}>Current Stock</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAddStock(e); }}>
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              <label htmlFor="stockName" className="form-label">Stock Name / Batch No</label>
              <input type="text" name="stockName" value={formData.stockName} className="form-control" onChange={handleChange} required />

              <div className="row mt-2">
                <div className="col-md-6">
                  <label htmlFor="supplier" className="form-label">Supplier Name</label>
                  <input
                    type="text"
                    name="supplierSearch"
                    className="form-control"
                    value={supplierSearch}
                    onChange={handleSupplierSearch}
                    required
                  />
                  {supplierSuggestions.length > 0 && (
                    <ul className="list-group mt-0">
                      {supplierSuggestions.map((supplier, index) => (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleSupplierSelect(supplier.supplierName)}
                        >
                          {supplier.supplierName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="" className='mb-1'>Description</label>
                  <textarea onChange={handleChange} name='description' id='' value={formData.description} className='form-control' rows={2}></textarea>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="productSearch" className="form-label">Product Name</label>
                  <input
                    type="text"
                    name="productSearch"
                    className="form-control"
                    value={productSearch}
                    onChange={handleProductSearch}
                    required
                  />
                  {productSuggestions.length > 0 && (
                    <ul className="list-group mt-0">
                      {productSuggestions.map((product, index) => (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleProductSelect(product.productName)}
                        >
                          {product.productName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="category" className="form-label">Product Category</label>
                  <input
                    type="text"
                    name="category"
                    value={categories.find(c => c.categoryId === formData.category)?.categoryName || ''}
                    className="form-control"
                    readOnly
                  />
                </div>
                {/* 
                <div className="col-md-6 mb-3">
                  <label htmlFor="" className='mb-1'>Manufacture Date </label>
                  <input onChange={handleChange} type="date" name='mfd' id='' onWheel={(e) => e.target.blur()} value={formData.mfd} className='form-control' />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="" className='mb-1'>Expiration date</label>
                  <input onChange={handleChange} type="date" name='exp' id='' onWheel={(e) => e.target.blur()} value={formData.exp} className='form-control' />
                </div> */}

                <div className="col-md-4 mb-3">
                  <label htmlFor="price" className="form-label">Unit Price</label>
                  <input type="number" name="price" value={formData.price} onWheel={(e) => e.target.blur()} className="form-control" onChange={handleChange} placeholder='0.00' required />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="qty" className="form-label">Quantity</label>
                  <input type="number" name="qty" value={formData.qty} onWheel={(e) => e.target.blur()} className="form-control" onChange={handleChange} placeholder='0' required />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="totalPrice" className="form-label">Total Price</label>
                  <input type="text" name="totalPrice" value={formData.totalPrice} onWheel={(e) => e.target.blur()} className="form-control" placeholder='0.00' readOnly />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-primary" onClick={handleAddStock}>Add Stock +</button>
              </div>
            </div>
          </div>
        </form>

        {/* Table */}
        <div className="table-responsive">
          <Table
            search="Search"
            data={displayTableData}
            columns={columns}
            showButton={false}
            showActions={true}
            showSearch={false}
            showPDF={false}
            showDate={false}
            showRow={false}
            showEdit={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className='row mt-3 justify-content-end'>
            <div className="col-md-2 mb-3">
              <label htmlFor="qty" className="form-label">Total Quantity</label>
              <input type="number" name="totalQty" value={formData.totalQty} onWheel={(e) => e.target.blur()} required className="form-control" onChange={handleChange} readOnly />
            </div>
            <div className="col-md-2 mb-3">
              <label className="form-label">Total Amount</label>
              <input type="number" name="total" value={formData.total} onWheel={(e) => e.target.blur()} className="form-control" onChange={handleChange} readOnly />
            </div>
          </div>

          <div className='row mt-3'>
            <div className="col-md-2 mb-3">
              <label htmlFor="totalPrice" className="form-label">Vat</label>
              <input type="number" name="vat" value={formData.vat} onWheel={(e) => e.target.blur()} className="form-control" onChange={handleChange} defaultValue="0" placeholder='0' />
            </div>
            <div className="col-md-2 mb-3">
              <label htmlFor="totalPrice" className="form-label">Vat + Total</label>
              <input type="number" name="vatWithTotal" value={formData.vatWithTotal} onWheel={(e) => e.target.blur()} className="form-control" onChange={handleChange} placeholder='0.00' readOnly />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Cash Amount</label>
              <input type="number" name="cashAmount" value={formData.cashAmount} onWheel={(e) => e.target.blur()} className="form-control" onChange={handleChange} placeholder='0.00' />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="qty" className="form-label">Cheque Amount</label>
              <input type="number" name="chequeAmount" value={formData.chequeAmount} onWheel={(e) => e.target.blur()} required className="form-control" onChange={handleChange} placeholder='0.00' onClick={handleClickChequeAmount} />
            </div>
            <div className="col-md-2 mb-3">
              <label htmlFor="qty" className="form-label">due</label>
              <input type="number" name="due" value={formData.due} onWheel={(e) => e.target.blur()} required className="form-control" onChange={handleChange} placeholder='0.00' readOnly />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-primary btn-md" onClick={handleAddChequeField} >
              Add Cheques
            </button>
          </div>

          {chequeDetails.map((detail, index) => (
            <div className='row' key={index}>
              <div className="col-md-3 mb-3">
                <label className="form-label">Cheque Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="chequeNumber"
                  value={detail.chequeNumber}
                  onChange={(e) => handleDynamicFieldChange(index, 'chequeNumber', e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Cheque Amount</label>
                <input
                  type="number"
                  className="form-control"
                  name="chequeAmounts"
                  value={detail.chequeAmounts}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => handleDynamicFieldChange(index, 'chequeAmounts', e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Cheque Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="chequeDate"
                  value={detail.chequeDate}
                  onChange={(e) => handleDynamicFieldChange(index, 'chequeDate', e.target.value)}
                />
              </div>
            </div>
          ))}

          {/* Footer Buttons */}
          <div className="d-flex justify-content-end mt-4">
            <button type="reset" className="btn btn-danger me-2" onClick={resetForm}>Clear</button>
            <button type="submit" className="btn btn-success" onClick={handleSubmit}>Stock Purchase</button>
          </div>

        </form>
      </div>
    </div >
  );
};

export default NewStock;
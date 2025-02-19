import React, { useEffect, useState, useContext } from 'react';
import config from '../../config';
import { useNavigate, useParams } from 'react-router';
import { NoteContext } from '../../Context/NoteContext';
import { Link } from 'react-router-dom';

const SelectPF = () => {
  const { store, invoiceNo } = useParams();
  const [Colkan, setColkan] = useState(false)
  const [Haman, setHaman] = useState(false)
  const [TerraWalkers, setTerraWalkers] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNo: '',
    invoiceDate: '',
    PurchaseOrder: '',
    cusName: '',
    cusJob: '',
    cusOffice: '',
    cusAddress: '',
    cusEmail: '',
    cusPhone: '',
    delivaryNo: '',
    note: '',
    store: ''
  });
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const [Transaction, setTransaction] = useState([]);
  const [ShowRemove, setShowRemove] = useState(null);
  const [invoiceId, setInvoiceId] = useState()
  const [invoiceType, setInvoiceType] = useState()
  const { note, setNote } = useContext(NoteContext);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (invoiceNo) {
      fetchInvoiceData(invoiceNo);
    }
  }, [invoiceNo]);


  useEffect(() => {
    generateDeliveryNo();
  }, [invoiceProducts]);

  const fetchInvoiceData = async (invoiceNo) => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoice/invoiceNo/${invoiceNo}`);
      if (response.ok) {
        const invoiceData = await response.json();

        setFormData({
          invoiceNo: invoiceData.invoiceNo,
          invoiceDate: new Date(invoiceData.invoiceDate).toISOString().slice(0, 16),
          cusName: invoiceData.customer.cusName,
          cusJob: invoiceData.customer.cusJob,
          cusAddress: invoiceData.customer.cusAddress,
          cusOffice: invoiceData.customer.cusOffice,
          cusPhone: invoiceData.customer.cusPhone,
          cusEmail: invoiceData.customer.cusEmail,
          PurchaseOrder: invoiceData.purchaseNo,
          store: invoiceData.store
        });

        if (invoiceData.invoiceId) {
          fetchInvoiceProducts(invoiceData.invoiceId);
          fetchTransaction(invoiceData.invoiceId);
          setInvoiceType(invoiceData.status);
          setInvoiceId(invoiceData.invoiceId)
        }

        if (store === 'Colkan') {
          setColkan(true)
        }
        if (store === 'Haman') {
          setHaman(true)
        }
        if (store === 'TerraWalkers') {
          setTerraWalkers(true)
        }
      } else {
        alert('Invoice not found');
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      alert('An error occurred while fetching invoice data');
    }
  };

  const fetchInvoiceProducts = async (invoiceId) => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoiceProducts/${invoiceId}`);
      if (response.ok) {
        const data = await response.json();
        const productsWithQty = data.map((product) => ({
          ...product,
          updatedQty: product.invoiceQty, // Add updatedQty field
        }));
        setInvoiceProducts(productsWithQty);
      } else {
        alert('No invoice products found');
      }
    } catch (error) {
      console.error('Error fetching invoice products:', error);
      alert('An error occurred while fetching invoice products');
    }
  };

  const generateDeliveryNo = () => {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const rowCount = invoiceProducts.length;
    const deliveryNo = `DN-${formData.invoiceNo}-1-${currentYear}`;

    setFormData((prev) => ({
      ...prev,
      delivaryNo: deliveryNo,
    }));
  };

  const fetchTransaction = async (invoiceId) => {
    try {
      const response = await fetch(`${config.BASE_URL}/transaction/invoice/${invoiceId}`);
      if (response.ok) {
        const transactionData = await response.json();
        setTransaction(transactionData);
        if (transactionData.length > 0 && transactionData[0].note) {
          setFormData(prev => ({
            ...prev,
            note: transactionData[0].note,
          }));
        }
        console.log(transactionData);
      } else {
        alert('No Transaction found');
      }
    } catch (error) {
      console.error('Error fetching Transaction:', error);
      alert('An error occurred while fetching the transaction');
    }
  };

  const removeProduct = (index) => {
    setInvoiceProducts(prevProducts => prevProducts.filter((_, i) => i !== index));
  };

  const navigate = useNavigate();

  const [checkboxStates, setCheckboxStates] = useState({
    address: false,
    bank: false,
    phone: false,
    email: false,
    note: false,
  });

  const handleCheckboxChange = (name) => {
    setCheckboxStates((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handlePrint = async () => {
    const queryParams = new URLSearchParams(checkboxStates).toString();
    navigate(`/proformaInvoice/${store}/${invoiceNo}?${queryParams}`);
  };

  const handleChange = async () => {

  }

  return (
    <div>
      <div className="scrolling-container">
        <h4>Performa Invoice</h4>
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
        <div className="invoice-page">
          <div className="invoice-2">
            <div id="invoice-card">

              <div className="type-head text-center">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Invoice Number</label>
                  <input type="number" className="form-control bg-warning" name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} onWheel={(e) => e.target.blur()} />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Store</label>
                  <input type="text" className="form-control" name="store"
                    value={formData.store}
                    disabled
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Date</label>
                  <input type="datetime-local" className="form-control" name="returnDate" value={formData.invoiceDate} onChange={handleChange} disabled />
                </div>
              </div>
              <section className="billing-details">
                <div className="invoice-info">
                  <div className="details mb-2">
                    <label htmlFor="">Customer Name</label>
                    <input type="text" className="form-input" name="cusName" value={formData.cusName} />
                  </div>
                  <div className="details mb-2">
                    <label htmlFor="">Customer Staff Position</label>
                    <input type="text" className="form-input" name="cusJob" value={formData.cusJob} />
                  </div>
                  <div className="details mb-2">
                    <label htmlFor="">Customer Company</label>
                    <input type="text" className="form-input" name="cusOffice" value={formData.cusOffice} />
                  </div>

                  <div className="details mb-2">
                    <label htmlFor="">Customer Phone</label>
                    <input type="text" className="form-input" name="cusOffice" value={formData.cusPhone} />
                  </div>
                  <div className="details mb-2">
                    <label htmlFor="">Customer Email</label>
                    <input type="text" className="form-input" name="cusOffice" value={formData.cusEmail} />
                  </div>

                </div>
                <div className="invoice-info">
                  <div className="details mb-2">
                    <label htmlFor="">Invoice No</label>
                    <input
                      type="text"
                      className="form-input"
                      name="invoiceNo"
                      value={formData.invoiceNo}
                    />
                  </div>
                  <div className="details mb-2">
                    <label htmlFor="">Date</label>
                    <input
                      type="datetime-local"
                      className="form-input date"
                      name="invoiceDate"
                      onChange={handleInputChange}
                      value={formData.invoiceDate}
                    />
                  </div>
                  <div className="details mb-2">
                    <label htmlFor="">Purchase Order</label>
                    <input
                      type="text"
                      className="form-input"
                      name="PurchaseOrder"
                      value={formData.PurchaseOrder}
                    />
                  </div>
                  <div className="details  ">
                    <label htmlFor="">Note</label>
                    <textarea
                      type="text"
                      className="form-input"
                      name="note"
                      value={formData.note}
                      rows={4}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="options">

                  <div className="invoice-type">
                    <form action="">
                      <br />
                      <label className='invoice-type-label' htmlFor="">Address</label>
                      <input type="checkbox" name="address" className='invoice-checkbox' checked={checkboxStates.address} onChange={() => handleCheckboxChange('address')} />
                      <br />
                      <label className='invoice-type-label' htmlFor="">Bank</label>
                      <input type="checkbox" name="bank" className='invoice-checkbox' checked={checkboxStates.bank} onChange={() => handleCheckboxChange('bank')} />

                      <br />
                      <label className='invoice-type-label' htmlFor="">Phone</label>
                      <input type="checkbox" name="phone" className='invoice-checkbox' checked={checkboxStates.phone} onChange={() => handleCheckboxChange('phone')} />
                      <br />
                      <label className='invoice-type-label' htmlFor="">Email</label>
                      <input type="checkbox" name="email" className='invoice-checkbox' checked={checkboxStates.email} onChange={() => handleCheckboxChange('email')} />
                      <br />
                      <label className='invoice-type-label' htmlFor="">Note</label>
                      <input type="checkbox" name="note" checked={checkboxStates.note} onChange={() => handleCheckboxChange('note')} className='invoice-checkbox' />
                    </form>
                  </div>

                  <div className="payment-form-button d-grid d-md-flex me-md-2 justify-content-end px-5">
                    <Link to={`/DraftSales/${invoiceId}/${invoiceType}`}><button className='btn btn-primary mb-2'>Draft</button></Link>
                  </div>
                  <div className="payment-form-button  d-grid d-md-flex me-md-2 justify-content-end px-5">
                    <Link to='/sales/credit'><button className='btn btn-danger'>Cancel</button></Link>
                    <button onClick={handlePrint} className='btn btn-warning'>Create Proforma Invoice</button>
                  </div>
                </div>
              </section>

              {/* product table---------------------------------------------------------------- */}
              <table className="table table-hover table-bordered table-responsive table-dark table-striped" >
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th colSpan={2}>Description</th>
                    <th className='text-center'>Product Quantity</th>
                    <th className='text-center'>Update Quantity</th>
                    {/* <th>Unit Price</th>
                    <th>Total LKR</th> */}
                    {/* <th>Status</th> */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No products found for this invoice.</td>
                    </tr>
                  ) : (
                    invoiceProducts.map((invoiceProduct, index) => (
                      <tr key={index}
                      >
                        <td id='table-sn'>{index + 1}</td>
                        <td colSpan={2} id='tableDes'>{invoiceProduct.product.productName} </td>
                        <td className='text-center' id='table-sn'>{invoiceProduct.invoiceQty}</td>
                        <td className='text-center' id={`table-sn-${index}`}
                          contentEditable
                          suppressContentEditableWarning
                        >
                        </td>
                        {/* <td className={invoiceProduct.deliveryStatus === 'notDelivered' ? 'not-delivery' : 'delivery'} >{invoiceProduct.deliveryStatus}</td> */}
                        <td onMouseEnter={() => setShowRemove(index)}
                          onMouseLeave={() => setShowRemove(null)}
                          onClick={() => removeProduct(index)}
                          className={`table-row ${ShowRemove === index ? 'row-hover' : ''}`}>
                          <button className='btn btn-danger'>Delete</button></td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                    </td>
                    <td>Total Quantity</td>
                    <td className='text-center'>
                      {invoiceProducts.reduce((total, product) => total + Number(product.invoiceQty), 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default SelectPF;

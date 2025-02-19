import React, { useEffect, useState, useContext } from 'react';
import config from '../../../config';
import { useNavigate, useParams } from 'react-router';
import { NoteContext } from '../../../Context/NoteContext';
import { Link } from 'react-router-dom';

const SelectCR = () => {
  const { invoiceNo, returnItemId } = useParams();
  const [store, setStore] = useState(false)
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
    creditNo: '',
    note: '',
    returnTime: '',
    returnDate: ''
  });
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const [Transaction, setTransaction] = useState([]);
  const [ShowRemove, setShowRemove] = useState(null);

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
    } if (returnItemId) {
      fetchReturn(returnItemId);
    }
  }, [invoiceNo, returnItemId]);

  const fetchReturn = async (returnItemId) => {
    try {
      const response = await fetch(`${config.BASE_URL}/return/${returnItemId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          returnTime: data.returnTime,
          returnDate: new Date(data.returnItemDate).toISOString().split("T")[0]
        });
        console.log('returnTime', data.returnTime);
      } else {
        alert('No invoice products found');
      }
    } catch (error) {
      console.error('Error fetching invoice products:', error);
      alert('An error occurred while fetching invoice products');
    }
  };

  const fetchInvoiceData = async (invoiceNo) => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoice/invoiceNo/${invoiceNo}`);
      if (response.ok) {
        const invoiceData = await response.json();

        setFormData({
          invoiceNo: invoiceData.invoiceNo,
          invoiceDate: new Date(invoiceData.invoiceDate).toISOString().slice(0, 16),
          store: invoiceData.store,
          cusName: invoiceData.customer.cusName,
          cusJob: invoiceData.customer.cusJob,
          cusAddress: invoiceData.customer.cusAddress,
          cusOffice: invoiceData.customer.cusOffice,
          cusPhone: invoiceData.customer.cusPhone,
          cusEmail: invoiceData.customer.cusEmail,
          PurchaseOrder: invoiceData.purchaseNo,
        });
        setStore(invoiceData.store)
        if (invoiceData.invoiceId) {
          fetchTransaction(invoiceData.invoiceId);
        }
      } else {
        alert('Invoice not found');
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      alert('An error occurred while fetching invoice data');
    }
  };

  useEffect(() => {
    if (returnItemId) {
      fetchInvoiceProducts(returnItemId);
    }
  }, [returnItemId]);

  const fetchInvoiceProducts = async (returnItemId) => {
    try {
      const response = await fetch(`${config.BASE_URL}/returnProduct/return/${returnItemId}`);
      if (response.ok) {
        const data = await response.json();
        const productsWithQty = data.map((product) => ({
          ...product,
          updatedQty: product.returnQty, // Add updatedQty field
        }));
        if (data.length > 0 && data[0].returnNote) {
          setFormData(prev => ({
            ...prev,
            note: data[0].returnNote,
          }));
        }
        setInvoiceProducts(data);
      } else {
        alert('No invoice products found');
      }
    } catch (error) {
      console.error('Error fetching invoice products:', error);
      alert('An error occurred while fetching invoice products');
    }
  };

  useEffect(() => {
    generateCreditNo();
  }, [fetchReturn]);

  const generateCreditNo = () => {
    if (!formData.returnDate) return;

    const returnDate = new Date(formData.returnDate);
    const invoiceYear = returnDate.getFullYear().toString().slice(-2);
    const returnDateOnly = returnDate.toISOString().split("T")[0];

    const time = formData.returnTime;
    const creditNo = `CR-${invoiceNo}-${time}-${invoiceYear}`;
    const newInvoiceNo = `INV-${formData.invoiceNo}-${invoiceYear}`;

    setFormData((prev) => ({
      ...prev,
      creditNo: creditNo,
      // newInvoiceNo:invoiceNo,
      returnDate: returnDateOnly,
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
    note: false
  });

  const handleCheckboxChange = (name) => {
    setCheckboxStates((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handlePrint = async () => {
    const queryParams = new URLSearchParams(checkboxStates).toString();
    navigate(`/creditNote/${store}/${invoiceNo}/${returnItemId}?${queryParams}`);
  };

  return (
    <div>
      <div className="scrolling-container">
        <h4>Credit Note</h4>
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
        <div className="invoice-page delivery-details">
          <div className="invoice-2">
            <div id="invoice-card">

              <div className="type-head text-center row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Invoice Number</label>
                  <input type="number" className="form-control bg-warning" name="invoiceNo" value={formData.invoiceNo} onWheel={(e) => e.target.blur()} />
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
                  <input type="datetime-local" className="form-control" name="returnDate" value={formData.invoiceDate} disabled />
                </div>

                <div className="col-md-3 mb-2">
                  <label className="form-label" htmlFor="">Creadit Note Number </label>
                  <input
                    type="text"
                    className="form-control"
                    name="creditNo"
                    value={formData.creditNo}
                  />
                </div>
              </div>

              <section className=" ">
                <div className="row">
                  <div className="col-md-2 mb-2">
                    <label className="form-label" htmlFor="">Customer Name</label>
                    <input type="text" className="form-control" name="cusName" value={formData.cusName} />
                  </div>
                  <div className="col-md-2 mb-2">
                    <label className="form-label" htmlFor="">Customer Staff Position</label>
                    <input type="text" className="form-control" name="cusJob" value={formData.cusJob} />
                  </div>
                  <div className="col-md-2 mb-2">
                    <label className="form-label" htmlFor="">Customer Company</label>
                    <input type="text" className="form-control" name="cusOffice" value={formData.cusOffice} />
                  </div>
                  <div className="col-md-2 mb-2">
                    <label htmlFor="">Customer Phone</label>
                    <input type="text" className="form-control" name="cusOffice" value={formData.cusPhone} />
                  </div>
                  <div className="col-md-2 mb-2">
                    <label htmlFor="">Customer Email</label>
                    <input type="text" className="form-control" name="cusOffice" value={formData.cusEmail} />
                  </div>
                  <div className="col-md-2 mb-2">
                    <label className="form-label" htmlFor="">Customer Address</label>
                    <textarea type="text" className="form-control" value={formData.cusAddress} rows={3} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-2">
                    <label className="form-label" htmlFor="">Purchase Order</label>
                    <input
                      type="text"
                      className=" form-control"
                      name="PurchaseOrder"
                      value={formData.PurchaseOrder}
                    />
                  </div>
                  <div className="col-md-3 ">
                    <label className="form-label" htmlFor="">Note</label>
                    <textarea
                      type="text"
                      className="w-100 form-control"
                      name="note"
                      value={formData.note}
                      rows={4}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-md-6 row">
                    <div className="invoice-type  col-md-6 mb-2">
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
                    <div className="col-md-6 mt-5">

                      {/* <button onClick={handleUpdate} className='btn btn-primary'>Update Invoice</button> */}
                      <Link to='/return/list'><button className='btn btn-danger'>Cancel</button></Link>
                      <button onClick={handlePrint} className='btn btn-warning'>Create Credit Note</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* product table---------------------------------------------------------------- */}
              <table className="invoice-table" >
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th colSpan={2}>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total LKR</th>
                    {/* <th>Action</th> */}
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
                        <td className='text-center' id='table-sn'>{invoiceProduct.returnQty}</td>
                        <td className='text-center' id='table-sn'>{invoiceProduct.invoiceProduct.unitAmount}</td>
                        <td className='text-center' id='table-sn'>{invoiceProduct.invoiceProduct.unitAmount * invoiceProduct.returnQty}</td>
                        {/* <td className='text-center' id='table-sn'>{invoiceProduct.sendQty}</td>
                                                <td className='text-center' id={`table-dn-${index}`}>{invoiceProduct.deliverdQty}</td> */}
                        {/* <td className='text-center' id={`table-sn-${index}`}
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                >
                                                </td> */}
                        {/* <td className={invoiceProduct.deliveryStatus === 'notDelivered' ? 'not-delivery' : 'delivery'} >{invoiceProduct.deliveryStatus}</td> */}
                        {/* <td onMouseEnter={() => setShowRemove(index)}
                          onMouseLeave={() => setShowRemove(null)}
                          onClick={() => removeProduct(index)}
                          className={`table-row ${ShowRemove === index ? 'row-hover' : ''}`}>
                          <button className='btn btn-danger'>Remove</button></td> */}
                      </tr>
                    ))
                  )}
                </tbody>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                    </td>
                    <td>Total</td>
                    <td className='text-center'>
                      {invoiceProducts.reduce((total, product) => total + Number(product.returnQty), 0)}
                    </td>
                    <td></td>
                    <td>{invoiceProducts.reduce((total, product) => total + Number(product.invoiceProduct.unitAmount * product.returnQty), 0)}</td>
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

export default SelectCR;

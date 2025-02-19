import React, { useEffect, useState, useContext } from 'react';
import './SelectDN.css';
import config from '../../config';
import { useNavigate, useParams } from 'react-router';
import { NoteContext } from '../../Context/NoteContext';
import { set } from 'date-fns';
import { Link } from 'react-router-dom';

const SelectDN = () => {
  const { store, invoiceNo } = useParams();
  const [storeR, setStoreR] = useState('')
  const [invoiceNOR, setInvoiceNOR] = useState('')
  const [invoiceTime, setInvoiceTime] = useState('')
  const [deliveryTime, setDeliveryTime] = useState(null);
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
    store: '',
  });
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const [Transaction, setTransaction] = useState([]);
  const [ShowRemove, setShowRemove] = useState(null);
  const [invoiceId, setInvoiceId] = useState()
  const [invoiceType, setInvoiceType] = useState()
  const { note, setNote } = useContext(NoteContext);
  const [inputValues, setInputValues] = useState({});

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (invoiceNo) {
      fetchInvoiceData(invoiceNo);
    }
  }, [invoiceNo]);

  const fetchInvoiceData = async (invoiceNo) => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoice/invoiceNo/${invoiceNo}`);
      if (response.ok) {
        const invoiceData = await response.json();
        setInvoiceTime(invoiceData.deliveryTime)
        setDeliveryTime(invoiceData.deliveryTime);
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
          store: invoiceData.store,
        });

        if (invoiceData.invoiceId) {
          fetchInvoiceProducts(invoiceData.invoiceId);
          fetchTransaction(invoiceData.invoiceId);
          setInvoiceNOR(invoiceData.invoiceNo);
          setStoreR(invoiceData.store);
          setInvoiceType(invoiceData.status);
          setInvoiceId(invoiceData.invoiceId)
        }
      } else {
        // alert('Invoice not found');
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
        // const filteredProducts = data.filter(product => product.deliveryStatus !== 'Delivered');
        setInvoiceProducts(data);
      } else {
        // alert('No invoice products found');
      }
    } catch (error) {
      console.error('Error fetching invoice products:', error);
      alert('An error occurred while fetching invoice products');
    }
  };

  useEffect(() => {
    generateDeliveryNo();
  }, [deliveryTime]);

  const generateDeliveryNo = () => {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const time = deliveryTime;
    const deliveryNo = `DN-${formData.invoiceNo}-${time}-${currentYear}`;

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
        // alert('No Transaction found');
      }
    } catch (error) {
      console.error('Error fetching Transaction:', error);
      alert('An error occurred while fetching the transaction');
    }
  };

  const removeProduct = (index) => {
    setInvoiceProducts(prevProducts => prevProducts.filter((_, i) => i !== index));
  };

  const updateDeliveryNote = async () => {
    try {
      const updatePromises = invoiceProducts.map(async (product) => {
        const updatedQty = inputValues[product.id] !== undefined ? inputValues[product.id] : product.invoiceQty;

        // Ensure updated quantity is valid
        if (updatedQty > 0 && updatedQty <= product.sendQty) {
          console.log(`Updating product with ID: ${product.id}, Qty: ${updatedQty}`);

          const deliveryData = {
            sendQty: product.sendQty - updatedQty, // Remaining quantity
            deliverdQty: updatedQty,
            invoiceProductStatus: "delivered",
          };

          const response = await fetch(`${config.BASE_URL}/updateDeliveryNote/${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(deliveryData),
          });

          if (!response.ok) {
            throw new Error(`Failed to update product ${product.id}`);
          }

          return response.json();
        } else {
          console.warn(`Skipped updating product with ID: ${product.id} due to invalid quantity.`);
          return null;
        }
      });

      const timeData = {
        deliveryTime: deliveryTime,
        status: "delivery"
      }
      const timeResponse = await fetch(`${config.BASE_URL}/deliveryTime/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timeData),
      });
      console.log('delivery time', timeResponse);
      const results = await Promise.all(updatePromises.filter(promise => promise !== null));
      console.log('Updated product statuses:', results);

      // Update state to reflect changes
      setInvoiceProducts((prevProducts) =>
        prevProducts.map((product, index) => ({
          ...product,
          invoiceQty: document.querySelector(`#table-sn-${index}`)?.textContent.trim() || product.invoiceQty,
          deliveryStatus: 'Delivered',
        }))
      );
    } catch (error) {
      console.error('Error updating product statuses:', error);
      alert('An error occurred while updating product statuses.');
    }
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
    navigate(`/delivery/${storeR}/${invoiceNOR}?${queryParams}`);
    await updateDeliveryNote();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Fetch data dynamically when `invoiceNo` changes
    if (name === 'invoiceNo' && value) {
      fetchInvoiceData(value);
    }
  };

  return (
    <div>
      <div className="scrolling-container">
        <h4>Create Delivery Note</h4>
        <div className="invoice-page delivery-details">
          <div className="invoice-2">
            <div id="invoice-card">

              <div className="type-head text-center">
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Invoice Number</label>
                    <input type="number" className="form-control bg-warning" name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} onWheel={(e) => e.target.blur()} />
                  </div>
                  <div className="col-md-3  mb-2">
                    <label className="form-label" htmlFor="">Delivary No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="delivaryNo"
                      onChange={handleInputChange}
                      value={formData.delivaryNo}
                    />
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
                    <label className="form-label" htmlFor="">Customer Phone</label>
                    <input type="text" className="form-control" name="cusOffice" value={formData.cusPhone} />
                  </div>
                  <div className="col-md-2 mb-2">
                    <label className="form-label" htmlFor="">Customer Email</label>
                    <input type="text" className="form-control" name="cusOffice" value={formData.cusEmail} />
                  </div>
                  <div className="col-md-2 mb-2">
                    <label className="form-label" htmlFor="">Customer Address</label>
                    <textarea type="text" className="form-control" value={formData.cusAddress} rows={3} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3  mb-2">
                    <label className="form-label" htmlFor="">Purchase Order</label>
                    <input
                      type="text"
                      className="form-control"
                      name="PurchaseOrder"
                      value={formData.PurchaseOrder}
                    />
                  </div>
                  <div className="col-md-3   ">
                    <label className="form-label" htmlFor="">Note</label>
                    <textarea
                      type="text"
                      className="form-control"
                      name="note"
                      value={formData.note}
                      rows={4}
                      onChange={handleInputChange}
                    />
                  </div>


                  <div className="col-md-6 row">
                    <div className="invoice-type col-md-6 mb-2">
                      <form action="">
                        <br />
                        <label className='invoice-type-label' htmlFor="">Address</label>
                        <input type="checkbox" name="address" checked={checkboxStates.address} onChange={() => handleCheckboxChange('address')} className='invoice-checkbox' />
                        <br />
                        <label className='invoice-type-label' htmlFor="">Bank</label>
                        <input type="checkbox" name="bank" checked={checkboxStates.bank} onChange={() => handleCheckboxChange('bank')} className='invoice-checkbox' />

                        <br />
                        <label className='invoice-type-label' htmlFor="">Phone</label>
                        <input type="checkbox" name="phone" checked={checkboxStates.phone} onChange={() => handleCheckboxChange('phone')} className='invoice-checkbox' />
                        <br />
                        <label className='invoice-type-label' htmlFor="">Email</label>
                        <input type="checkbox" name="email" checked={checkboxStates.email} onChange={() => handleCheckboxChange('email')} className='invoice-checkbox' />
                        <br />
                        <label className='invoice-type-label' htmlFor="">Note</label>
                        <input type="checkbox" name="note" checked={checkboxStates.note} onChange={() => handleCheckboxChange('note')} className='invoice-checkbox' />
                      </form>
                    </div>
                    <div className="col-md-6 mt-5">
                      <div className="payment-form-button d-grid d-md-flex me-md-2 justify-content-end px-5">
                        <Link to={`/DraftSales/${invoiceId}/${invoiceType}`}><button className='btn btn-primary mb-2'>Draft</button></Link>
                      </div>
                      <div className="payment-form-button  d-grid d-md-flex me-md-2 justify-content-end px-5">
                        <Link to='/sales/invoice'><button className='btn btn-danger'>Cancel</button></Link>
                        <button onClick={handlePrint} className='btn btn-warning'>Create Invoice</button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* product table---------------------------------------------------------------- */}
              <table className="table table-hover table-bordered table-responsive table-dark table-striped" >
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th colSpan={2}>Description</th>
                    <th>Quantity</th>
                    <th className='text-center'>Delivery Quantity</th>
                    <th className='text-center'>Last Delivered Quantity</th>
                    <th className='text-center'>Current Delivery Quantity</th>
                    {/* <th>Unit Price</th>
                    <th>Total LKR</th> */}
                    <th>Status</th>
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
                        <td className='text-center' id='table-sn'>{invoiceProduct.sendQty}</td>
                        <td className='text-center' id={`table-dn-${index}`}>{invoiceProduct.deliverdQty}</td>
                        <td>
                          <input
                            type="number"
                            value={inputValues[invoiceProduct.id] || invoiceProduct.sendQty}
                            onChange={(e) => {
                              let value = parseInt(e.target.value) || 0;

                              if (value > invoiceProduct.sendQty) {
                                alert(`Quantity cannot exceed ${invoiceProduct.sendQty}`);
                                value = invoiceProduct.sendQty;
                              }
                              setInputValues((prev) => ({
                                ...prev,
                                [invoiceProduct.id]: value,
                              }));
                            }}
                            onWheel={(e) => e.target.blur()}
                            className="form-control bg-warning"
                            style={{ width: "15ch" }}
                          />
                        </td>

                        <td className={invoiceProduct.deliveryStatus === 'notDelivered' ? 'not-delivery' : 'delivery'} >{invoiceProduct.deliveryStatus}</td>
                        <td onMouseEnter={() => setShowRemove(index)}
                          onMouseLeave={() => setShowRemove(null)}
                          onClick={() => removeProduct(index)}
                          className={`table-row ${ShowRemove === index ? 'row-hover' : ''}`}>
                          <button className='btn btn-danger'>Remove</button></td>
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
      </div >
    </div >
  );
};

export default SelectDN;

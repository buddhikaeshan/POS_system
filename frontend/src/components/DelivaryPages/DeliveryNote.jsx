import React, { useContext, useEffect, useState } from 'react';
import './DeliveryNote.css';
import one from '../../assets/1.jpg';
import two from '../../assets/2.jpg';
import three from '../../assets/3.jpg';
import config from '../../config';
import { jsPDF } from "jspdf";
import { useNavigate, useParams } from 'react-router';
import { NoteContext } from '../../Context/NoteContext';
import { Download } from 'lucide-react'

const DeliveryNote = () => {
    const { store, invoiceNo } = useParams();
    const [Colkan, setColkan] = useState(false)
    const [Haman, setHaman] = useState(false)
    const [TerraWalkers, setTerraWalkers] = useState(false)
    const [invoiceId, setInvoiceId] = useState(null);
    const [deliveryTime, setDeliveryTime] = useState(null);
    const [formData, setFormData] = useState({
        invoiceNo: '',
        newInvoiceNo:'',
        invoiceDate: '',
        PurchaseOrder: '',
        cusName: '',
        cusJob: '',
        cusOffice: '',
        cusAddress: '',
        cusPhone: '',
        cusEmail: '',
        delivaryNo: ''
    });
    const [invoiceProducts, setInvoiceProducts] = useState([]);
    const [Transaction, setTransaction] = useState([]);

    const { note } = useContext(NoteContext);

    const [ShowRemove, setShowRemove] = useState(null);
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
                setInvoiceId(invoiceData.invoiceId);
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
                });

                if (invoiceData.invoiceId) {
                    fetchInvoiceProducts(invoiceData.invoiceId);
                    fetchTransaction(invoiceData.invoiceId);
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
                const filteredProducts = data.filter(product => product.invoiceProductStatus === 'delivered');
                setInvoiceProducts(filteredProducts);
            } else {
                alert('No invoice products found');
            }
        } catch (error) {
            console.error('Error fetching invoice products:', error);
            alert('An error occurred while fetching invoice products');
        }
    };

    const generateDeliveryNo = () => {
        if (!formData.invoiceDate) return;

        const invoiceDate = new Date(formData.invoiceDate);
        const invoiceYear = invoiceDate.getFullYear().toString().slice(-2);
        const invoiceDateOnly = invoiceDate.toISOString().split("T")[0];

        const time = deliveryTime;
        const deliveryNo = `DN-${formData.invoiceNo}-${time}-${invoiceYear}`;
        const invoiceNo=`INV-${formData.invoiceNo}-${invoiceYear}`;

        setFormData((prev) => ({
            ...prev,
            delivaryNo: deliveryNo,
            // newInvoiceNo:invoiceNo,
            invoiceDate: invoiceDateOnly,
        }));
    };

    const fetchTransaction = async (invoiceId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/transaction/invoice/${invoiceId}`);
            if (response.ok) {
                const transactionData = await response.json();
                setTransaction(transactionData);
                console.log(transactionData);
            } else {
                alert('No Transaction found');
            }
        } catch (error) {
            console.error('Error fetching Transaction:', error);
            alert('An error occurred while fetching the transaction');
        }
    };

    const updateDeliveryNote = async () => {
        try {
            const updatePromises = invoiceProducts.map(async (product, index) => {

                const deliveryData = {
                    sendQty: product.sendQty,
                    deliverdQty: product.deliverdQty,
                    invoiceProductStatus: "notDelivered"
                };

                const response = await fetch(`${config.BASE_URL}/updateDeliveryNote/${product.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(deliveryData),
                });

                if (!response.ok) {
                    throw new Error(`Failed to update product ${product.id}`);
                }

                return response.json();
            });

            const timeData = {
                deliveryTime: deliveryTime + 1,
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

            // const invoiceStatus = {
            // }
            // const statusResponse = await fetch(`${config.BASE_URL}/invoiceStatus/${invoiceId}`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(invoiceStatus),
            // });
            // console.log('invoice status', statusResponse);
        } catch (error) {
            console.error('Error updating product statuses:', error);
            alert('An error occurred while updating product statuses.');
        }
    };

    const cancelDeliveryNote = async () => {
        try {
            const updatePromises = invoiceProducts.map(async (product, index) => {
                const updatedQty = product.deliverdQty;

                const deliveryData = {
                    sendQty: product.sendQty + updatedQty,
                    deliverdQty: product.deliverdQty - updatedQty,
                    invoiceProductStatus: "notDelivered"
                };

                console.log(`Updating product ${product.id} with data:`, deliveryData);

                const response = await fetch(`${config.BASE_URL}/updateDeliveryNote/${product.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(deliveryData),
                });

                if (!response.ok) {
                    const errorData = await response.json(); // Log the error response
                    console.error(`Failed to update product ${product.id}:`, errorData);
                    throw new Error(`Failed to update product ${product.id}: ${errorData.message}`);
                }

                return response.json();
            });

            await Promise.all(updatePromises);
            alert('Delivery note canceled successfully!');
        } catch (error) {
            console.error('Error updating product statuses:', error);
            alert('An error occurred while updating product statuses.');
        }
    };

    const navigate = useNavigate();

    const handleCancel = async () => {
        const isConfirmed = window.confirm("Are you sure you want to cancel this delivery note? This action cannot be undone.");
        if (!isConfirmed) {
            return;
        }
        await cancelDeliveryNote();
        navigate('/sales/delivery')
    }

    const handlePrint = async () => {
        const printContent = document.getElementById('invoice-card');

        if (printContent) {
            await updateDeliveryNote();
            const doc = new jsPDF();
            doc.html(printContent, {
                callback: function (doc) {
                    const totalPages = doc.internal.getNumberOfPages();

                    for (let i = 1; i <= totalPages; i++) {
                        doc.setPage(i);
                        doc.setFontSize(10);
                        const pageWidth = doc.internal.pageSize.width;
                        const pageHeight = doc.internal.pageSize.height;

                        const footerText = `Page ${i} of ${totalPages}`;
                        const textWidth = doc.getTextWidth(footerText);

                        doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 10);
                    }

                    doc.autoPrint();
                    window.open(doc.output('bloburl'), '_blank');
                    // doc.save('invoice.pdf');
                },
                x: 10,
                y: 10,
                width: 190,
                windowWidth: 800,
            });
        } else {
            console.error('Invoice card not found!');
        }
    };
    const handleDownLoad = async () => {
        const printContent = document.getElementById('invoice-card');

        if (printContent) {
            await updateDeliveryNote();
            const doc = new jsPDF();

            doc.html(printContent, {
                callback: function (doc) {
                    const totalPages = doc.internal.getNumberOfPages();

                    // Loop through each page to add a footer with page number
                    for (let i = 1; i <= totalPages; i++) {
                        doc.setPage(i);
                        doc.setFontSize(10);
                        const pageWidth = doc.internal.pageSize.width;
                        const pageHeight = doc.internal.pageSize.height;

                        const footerText = `Page ${i} of ${totalPages}`;
                        const textWidth = doc.getTextWidth(footerText);

                        // Center the footer text at the bottom of each page
                        doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 10);
                    }

                    // doc.autoPrint();
                    // window.open(doc.output('bloburl'), '_blank');
                    doc.save('Delivery_note.pdf');
                },
                x: 10,
                y: 10,
                width: 190,
                windowWidth: 800,
            });
        } else {
            console.error('Invoice card not found!');
        }
    };

    const [checkboxStates, setCheckboxStates] = useState({
        address: true,
        bank: false,
        phone: false,
        email: false,
        note: false
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setCheckboxStates({
            address: params.get('address') === 'true',
            bank: params.get('bank') === 'true',
            phone: params.get('phone') === 'true',
            email: params.get('email') === 'true',
            note: params.get('note') === 'true',
        });
    }, [invoiceNo]);

    const handleCheckboxChange = (name) => {
        setCheckboxStates((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
        }));
    };

    // Derived states for visibility
    const showAddress = checkboxStates.address;
    const showBank = checkboxStates.bank;
    const showPhone = checkboxStates.phone;
    const showEmail = checkboxStates.email;
    const showNote = checkboxStates.note;

    return (
        <div>
            <div className="scrolling-container">
                <h4>Delivery Note</h4>
                <div className="invoice-page">
                    <div className="invoice">
                        <div id="invoice-card">
                            {Colkan && (
                                <section className="invoice-header">
                                    <img src={one} alt="" className="header-img" />
                                </section>
                            )}
                            {Haman && (
                                <section className="invoice-header">
                                    <img src={two} alt="" className="header-img" />
                                </section>

                            )}
                            {TerraWalkers && (
                                <section className="invoice-header">
                                    <img src={three} alt="" className="header-img" />
                                </section>
                            )}

                            <div className="type-head text-center">
                                <h4> <b>DELIVERY NOTE</b> </h4>
                            </div>
                            <section className="billing-details">
                                <div className="invoice-info">
                                    <label><b>Billing Details</b></label>
                                    <div className="details">
                                        {/* <input type="text" className="form-input" name="cusName" value={formData.cusName} /> */}
                                        <p>{formData.cusName}</p>
                                    </div>
                                    <div className="details">
                                        {/* <input type="text" className="form-input" name="cusJob" value=/> */}
                                        <p>{formData.cusJob} </p>
                                    </div>
                                    <div className="details">
                                        {/* <input type="text" className="form-input" name="cusOffice" value= /> */}
                                        <p>{formData.cusOffice}</p>
                                    </div>
                                    {showAddress && (
                                        <div className="details">
                                            {/* <div className="details">
                                                <textarea
                                                    className="form-input"
                                                    name="cusAddress"
                                                    rows="2"
                                                    style={{ resize: "both" }}
                                                    value={formData.cusAddress}
                                                ></textarea>
                                            </div> */}
                                            <p>{formData.cusAddress}</p>
                                        </div>
                                    )}
                                    {showPhone && (
                                        <div className="details">
                                            {/* <input type="text" className="form-input" name="cusPhone" value={formData.cusPhone} /> */}
                                            <p>{formData.cusPhone}</p>
                                        </div>
                                    )}
                                    {showEmail && (
                                        <div className="details">
                                            {/* <input type="text" className="form-input" name="cusEmail" value={formData.cusEmail} /> */}
                                            <p>{formData.cusEmail}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="invoice-info">
                                    <div className="details mb-2">
                                        <label htmlFor="">Delivary No</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="delivaryNo"
                                            value={formData.delivaryNo}
                                        />
                                    </div>
                                    <div className="details mb-2">
                                        <label htmlFor="">Invoice No</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="invoiceNo"
                                            value={formData.invoiceNo}
                                        />
                                    </div>
                                    {/* <div className="details mb-2">
                                        <label htmlFor="">Invoice No</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="invoiceNo"
                                            value={formData.invoiceNo}
                                        />
                                    </div> */}
                                    <div className="details mb-2">
                                        <label htmlFor="">Date</label>
                                        <input
                                            type="date"
                                            className="form-input date"
                                            name="invoiceDate"
                                            value={formData.invoiceDate}
                                        />
                                    </div>
                                    <div className="details ">
                                        <label htmlFor="">Purchase Order</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="PurchaseOrder"
                                            value={formData.PurchaseOrder}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* product table---------------------------------------------------------------- */}
                            <table className="invoice-table">
                                <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th colSpan={2}>Description</th>
                                        <th>Qty</th>
                                        {/* <th>Unit Price</th>
                                        <th>Total LKR</th> */}
                                        {/* <th>Status</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5}>No products found for this invoice.</td>
                                        </tr>
                                    ) : (
                                        invoiceProducts.map((invoiceProduct, index) => (
                                            <tr key={index} className={`table-row `}
                                            >
                                                <td id='table-sn'>{index + 1}</td>
                                                <td colSpan={2} id='tableDes'>{invoiceProduct.product.productName}</td>
                                                <td id={`table-sn-${index}`} className='text-end'>{invoiceProduct.deliverdQty}</td>
                                                {/* <td>{invoiceProduct.invoiceProductStatus}</td> */}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td colSpan={2}>
                                            {showBank && (
                                                <>
                                                    {/* Payment mode : Cash or cheque. All cheques are to be drawn in favour of "Colkan Holdings (Pvt) Ltd" and crossed account payee only<br></br> */}
                                                    {Colkan && (
                                                        <>
                                                            Payment mode : Cash or cheque. All cheques are to be drawn in favour of "Colkan Holdings (Pvt) Ltd" and crossed account payee only<br></br>
                                                            Bank:HNB<br></br>
                                                            Account Number : 250010032342<br></br>
                                                            Account Name : Colkan Holdings (Pvt) LTD<br></br>
                                                            Branch Name : Colkan
                                                        </>
                                                    )}

                                                    {Haman && (
                                                        <>
                                                            Payment mode : Cash or cheque. All cheques are to be drawn in favour of "Haman" and crossed account payee only<br></br>
                                                            Bank:BOC<br></br>
                                                            Account Number : 93829087<br></br>
                                                            Account Name : Haman<br></br>
                                                            Branch Name : Wellewathe
                                                        </>
                                                    )}

                                                    {TerraWalkers && (
                                                        <>
                                                            Payment mode : Cash or cheque. All cheques are to be drawn in favour of "Terra Walkers" and crossed account payee only<br></br>
                                                            Bank:Sampath Bank<br></br>
                                                            Account Number : 0117 1000 1407<br></br>
                                                            Account Name : TerraWalkers walkers<br></br>
                                                            Branch Name : Kirulapona
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                        <td>Total Quantity</td>
                                        <td>
                                            {invoiceProducts.reduce((total, product) => total + Number(product.deliverdQty), 0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="delivery-note mt-2">
                                <label htmlFor="" className='mt-2'>Note:</label>
                                {showNote && (
                                    <>
                                        {Transaction.map((Transaction) => (
                                            <textarea value={Transaction.note} name="note" rows={2} id="deliveryNote"></textarea>
                                        ))}
                                    </>
                                )}
                            </div>
                            <footer className="invoice-footer ">
                                <p className='font-weight-bold'>I / We hereby acknowledge the receipt of the above goods are received in damages.</p>

                                <div className="signature">
                                    <table className="signature-table">
                                        <thead>
                                            <tr>
                                                <th>Prepared by</th>
                                                <th>Issued by</th>
                                                <th>Company seal & sign</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </footer>
                        </div>
                    </div>

                    <div className="options">
                        <div className="invoice-type">
                            <form action="">
                                <br />
                                <label className='invoice-type-label' htmlFor="">Address</label>
                                <input type="checkbox" checked={showAddress} onChange={() => handleCheckboxChange('address')} disabled id='disabled' />
                                <br />
                                <label className='invoice-type-label' htmlFor="">Bank</label>
                                <input type="checkbox" checked={showBank} onChange={() => handleCheckboxChange('bank')} disabled id='disabled' />

                                <br />
                                <label className='invoice-type-label' htmlFor="">Phone</label>
                                <input type="checkbox" checked={showPhone} onChange={() => handleCheckboxChange('phone')} disabled id='disabled' />
                                <br />
                                <label className='invoice-type-label' htmlFor="">Email</label>
                                <input type="checkbox" checked={showEmail} onChange={() => handleCheckboxChange('email')} disabled id='disabled' />
                                <br />
                                <label className='invoice-type-label' htmlFor="">Note</label>
                                <input type="checkbox" name="note" checked={checkboxStates.note} onChange={() => handleCheckboxChange('note')} className='invoice-checkbox' disabled id='disabled' />
                            </form>
                        </div>
                        <div className="payment-form-button d-grid d-md-flex me-md-2 justify-content-end px-5">
                            <button onClick={handleDownLoad} className='btn btn-success mb-2'><Download /> Download</button>
                        </div>
                        <div className="payment-form-button  d-grid d-md-flex me-md-2 justify-content-end px-5">
                            <button onClick={handleCancel} type='button' className='btn btn-danger'>Cancel</button>
                            <button onClick={handlePrint} className='btn btn-warning'>Print</button>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default DeliveryNote;

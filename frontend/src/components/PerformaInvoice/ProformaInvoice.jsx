import React, { useContext, useEffect, useState } from 'react';
import './ProformaInvoice.css';
import one from '../../assets/1.jpg';
import two from '../../assets/2.jpg';
import three from '../../assets/3.jpg';
import config from '../../config';
import { jsPDF } from "jspdf";
import { useParams, useLocation, Link } from 'react-router-dom';
import { NoteContext } from '../../Context/NoteContext';
import { Download } from 'lucide-react'

const ProformaInvoice = () => {
    const { store, invoiceNo } = useParams();
    const location = useLocation(); // Use useLocation to access query parameters
    const [invoiceId, setInvoiceId] = useState('')
    const [Colkan, setColkan] = useState(false);
    const [Haman, setHaman] = useState(false);
    const [TerraWalkers, setTerraWalkers] = useState(false);
    const [formData, setFormData] = useState({
        invoiceNo: '',
        invoiceDate: '',
        PurchaseOrder: '',
        cusName: '',
        cusJob: '',
        cusOffice: '',
        cusAddress: '',
        proforma: ''
    });
    const [invoiceProducts, setInvoiceProducts] = useState([]);
    const [Transaction, setTransaction] = useState([]);
    const [invoiceProductIds, setInvoiceProductIds] = useState([]); // State to store invoiceProductIds

    const { note } = useContext(NoteContext);

    useEffect(() => {
        if (invoiceNo) {
            fetchInvoiceData(invoiceNo);
        }
    }, [invoiceNo]);

    useEffect(() => {
        // Extract invoiceProductIds from query parameters
        const params = new URLSearchParams(location.search);
        const ids = params.get('invoiceProductIds');
        if (ids) {
            setInvoiceProductIds(ids.split(',')); // Convert comma-separated string to array
        }
    }, [location.search]);

    const fetchInvoiceData = async (invoiceNo) => {
        try {
            const response = await fetch(`${config.BASE_URL}/invoice/invoiceNo/${invoiceNo}`);
            if (response.ok) {
                const invoiceData = await response.json();

                const generatedProformaNo = `PI-${invoiceData.invoiceNo}-${new Date(invoiceData.invoiceDate).getFullYear().toString().slice(-2)}`;

                setFormData({
                    invoiceNo: invoiceData.invoiceNo,
                    invoiceDate: new Date(invoiceData.invoiceDate).toISOString().split("T")[0],
                    cusName: invoiceData.customer.cusName,
                    cusJob: invoiceData.customer.cusJob,
                    cusOffice: invoiceData.customer.cusOffice,
                    cusAddress: invoiceData.customer.cusAddress,
                    cusPhone: invoiceData.customer.cusPhone,
                    cusEmail: invoiceData.customer.cusEmail,
                    proforma: generatedProformaNo,
                    PurchaseOrder: invoiceData.purchaseNo,
                });

                if (invoiceData.invoiceId) {
                    fetchInvoiceProducts(invoiceData.invoiceId);
                    fetchTransaction(invoiceData.invoiceId);
                    setInvoiceId(invoiceData.invoiceId)
                }

                if (store === 'Colkan') {
                    setColkan(true);
                }
                if (store === 'Haman') {
                    setHaman(true);
                }
                if (store === 'TerraWalkers') {
                    setTerraWalkers(true);
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
                setInvoiceProducts(data);
            } else {
                alert('No invoice products found');
            }
        } catch (error) {
            console.error('Error fetching invoice products:', error);
            alert('An error occurred while fetching invoice products');
        }
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

    // Filter out removed products based on invoiceProductIds
    const filteredInvoiceProducts = invoiceProducts.filter(product =>
        invoiceProductIds.includes(product.id.toString())
    );

    const updatePerforma = async () => {
        try {
            const data = {
                performa: "true"
            };
            console.log('Updating performa for invoiceId:', invoiceId);
            console.log('Request payload:', data);

            const response = await fetch(`${config.BASE_URL}/updatePerforma/${invoiceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Failed to update invoice ${invoiceId}:`, errorData);
                alert(`Failed to update performa status: ${errorData.message || 'Unknown error'}`);
            } else {
                const updatedInvoice = await response.json();
                console.log('Performa updated successfully:', updatedInvoice);
            }
        } catch (error) {
            console.error('Error updating performa:', error);
            alert('An error occurred while updating performa status');
        }
    };

    const handlePrint = async () => {
        const printContent = document.getElementById('invoice-card');

        if (printContent) {
            await updatePerforma();
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
            await updatePerforma();
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
                    doc.save('Proforma_invoice.pdf');
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
        note: false,
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setCheckboxStates({
            address: params.get('address') === 'true',
            bank: params.get('bank') === 'true',
            phone: params.get('phone') === 'true',
            email: params.get('email') === 'true',
            note: params.get('note') === 'true'
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

    // Calculate Subtotal
    const subtotal = filteredInvoiceProducts.reduce(
        (total, product) => total + (product.totalAmount || 0),
        0
    );
    const vatRate = 0;
    const vat = subtotal * vatRate;
    const otherCharges = 0;
    const total = subtotal + vat + otherCharges;

    return (
        <div>
            <div className="scrolling-container">
                <h4>Proforma invoice</h4>
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
                                <h4>Proforma Invoice</h4>
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
                                <div className="performa-details-container">

                                    <div className="performa-details">
                                        <label htmlFor="">Proforma Invoice No.</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="proforma"
                                            value={formData.proforma}
                                        />
                                    </div>

                                    <div className="performa-details">
                                        <label htmlFor="">Invoice No.</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="invoiceNo"
                                            value={formData.invoiceNo}
                                        />
                                    </div>

                                    <div className="performa-details">
                                        <label htmlFor="">Date</label>
                                        <input
                                            type="date"
                                            className="form-input date"
                                            name="invoiceDate"
                                            value={formData.invoiceDate}
                                        />
                                    </div>

                                    <div className="performa-details">
                                        <label htmlFor="">Purchase Order No.</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="purchaseOrder"
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
                                        <th>Description</th>
                                        <th>Qty</th>
                                        <th className='text-center'>Unit Price LKR</th>
                                        <th className='text-center'>Discount LKR</th>
                                        <th className='text-center'>Discounted Price LKR</th>
                                        <th className='text-center'>Total Amount LKR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInvoiceProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={7}>No products found for this invoice.</td>
                                        </tr>
                                    ) : (
                                        filteredInvoiceProducts.map((invoiceProduct, index) => (
                                            <tr key={index}
                                                className={`table-row`}
                                            >
                                                <td id='table-sn'>{index + 1}</td>
                                                <td id='tableDes'>{invoiceProduct?.product?.productName}</td>
                                                <td id='table-sn'>{invoiceProduct.invoiceQty}</td>
                                                <td id='table-sn' className='text-end'>{invoiceProduct.unitAmount}</td>
                                                <td id='table-sn' className='text-end'>{invoiceProduct.discount}</td>
                                                <td id='table-sn' className='text-end'>{invoiceProduct.unitAmount - invoiceProduct.discount}</td>
                                                <td id='table-sn' className='text-end'>{(invoiceProduct.totalAmount.toFixed(2))}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td id="table-content" colSpan={5} rowSpan={5}>
                                            {showBank && (
                                                <>
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
                                        <td>Subtotal</td>
                                        <td className='text-end'>{subtotal.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Other Charges</td>
                                        <td className='text-end'>{otherCharges.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>VAT ({vatRate * 100}%)</td>
                                        <td className='text-end'>{vat.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>TOTAL</td>
                                        <td className='text-end'>{total.toFixed(2)}</td>
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
                                <div className="signature">
                                    <table className="signature-table">
                                        <thead>
                                            <tr>
                                                <th>Prepared by</th>
                                                <th>Issued by</th>
                                                <th>Customer sign with Rubber stamp</th>
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
                            <Link to='/sales/credit'><button className='btn btn-danger'>Cancel</button></Link>
                            <button onClick={handlePrint} className='btn btn-warning'>Print</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ProformaInvoice;
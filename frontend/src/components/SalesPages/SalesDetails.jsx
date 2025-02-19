import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jsPDF } from "jspdf";
import config from '../../config';
import './SalesDetails.css';
import one from '../../assets/1.jpg';
import two from '../../assets/2.jpg';
import three from '../../assets/3.jpg';

const SalesDetails = () => {
    const { store, invoiceNo } = useParams();
    const [Colkan, setColkan] = useState(false)
    const [Haman, setHaman] = useState(false)
    const [TerraWalkers, setTerraWalkers] = useState(false)
    const [formData, setFormData] = useState({
        invoiceNo: '',
        invoiceDate: '',
        store: '',
        cusName: '',
        cusJob: '',
        cusAddress: '',
        cusOffice: '',
    });
    const [invoiceProducts, setInvoiceProducts] = useState([]);
    const [Transaction, setTransaction] = useState([]);

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

                setFormData({
                    invoiceNo: invoiceData.invoiceNo,
                    invoiceDate: new Date(invoiceData.invoiceDate).toISOString().slice(0, 16),
                    cusName: invoiceData.customer.cusName,
                    cusJob: invoiceData.customer.cusJob,
                    cusAddress: invoiceData.customer.cusAddress,
                    cusOffice: invoiceData.customer.cusOffice,
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
            } else {
                alert('No Transaction found');
            }
        } catch (error) {
            console.error('Error fetching Transaction:', error);
            alert('An error occurred while fetching the transaction');
        }
    };

    const handlePrint = () => {
        const printContent = document.getElementById('invoice-card');
        if (printContent) {
            const doc = new jsPDF();
            doc.html(printContent, {
                callback: function (doc) {
                    doc.autoPrint();
                    window.open(doc.output('bloburl'), '_blank');
                    doc.save('invoice.pdf');
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

    return (
        <div>
            <div className="scrolling-container">
                <h4>Sales Details</h4>
                <div className="invoice-page delivery-details">
                    <div className="invoice-details-page">
                        <div id="invoice-card">
                            {/* {Colkan && (
                                <section className="invoice-header">
                                    <img src={one} alt="" className="header-img-details-page" />
                                </section>
                            )}
                            {Haman && (
                                <section className="invoice-header">
                                    <img src={two} alt="" className="header-img-details-page" />
                                </section>

                            )}
                            {TerraWalkers && (
                                <section className="invoice-header">
                                    <img src={three} alt="" className="header-img-details-page" />
                                </section>
                            )} */}
                            <section className="billing-details">
                                <div className="invoice-info">
                                    <div className="details mb-2">
                                        <label>Customer Name</label>
                                        <input type="text" className="form-input" name="cusName" value={formData.cusName} readOnly />
                                    </div>
                                    <div className="details mb-2">
                                        <label>Customer Job</label>
                                        <input type="text" className="form-input" name="cusJob" value={formData.cusJob} readOnly />
                                    </div>
                                    <div className="details mb-2">
                                        <label>Customer Office</label>
                                        <input type="text" className="form-input" name="cusOffice" value={formData.cusOffice} readOnly />
                                    </div>
                                    <div className="details mb-2">
                                        <label>Customer Address</label>
                                        <input type="text" className="form-input" name="cusAddress" value={formData.cusAddress} readOnly />
                                    </div>
                                </div>
                                <div className="invoice-info">
                                    <div className="details">
                                        <label>Invoice No</label>
                                        <input type="text" className="form-input" name="invoiceNo" value={formData.invoiceNo} readOnly />
                                    </div>
                                    <div className="details">
                                        <label>Date</label>
                                        <input type="datetime-local" className="form-input date" name="invoiceDate" value={formData.invoiceDate} readOnly />
                                    </div>
                                </div>
                            </section>

                            <table className="invoice-table">
                            <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Description</th>
                                        <th>Qty</th>
                                        <th className='text-center'>Unit Price LKR</th>
                                        <th className='text-center'>Discount LKR</th>
                                        <th className='text-center'>Discounted Price LKR</th>
                                        <th className='text-center'>Amount LKR</th>
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
                                                className={`table-row`}
                                            >
                                                <td id='table-sn'>{index + 1}</td>
                                                <td id='tableDes'>{invoiceProduct.product.productName}</td>
                                                <td id='table-sn'>{invoiceProduct.invoiceQty}</td>
                                                <td id='table-sn' className='text-end'>{invoiceProduct.unitAmount}</td>
                                                <td id='table-sn' className='text-end'>{invoiceProduct.discount}</td>
                                                <td id='table-sn' className='text-end'>{invoiceProduct.unitAmount-invoiceProduct.discount}</td>
                                                <td id='table-sn' className='text-end'>{(invoiceProduct.totalAmount)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={6}>TOTAL</td>
                                        {Transaction.map((Transaction) => (
                                            < td className='text-end'>{Transaction.price}</td>
                                        ))}
                                    </tr>
                                    {/* <tr>
                                        <td colSpan={4}>Discount</td>
                                        <td className='text-end'>
                                            {invoiceProducts.reduce(
                                                (total, product) => total + product.discount,
                                                0
                                            )}
                                        </td>
                                    </tr> */}
                                    <tr>
                                        <td colSpan={6}>Due</td>
                                        <td className='text-end'>{Transaction.reduce((total, trans) => total + trans.due, 0)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={6}>Paid</td>
                                        <td className='text-end'>{Transaction.reduce((total, trans) => total + trans.paid, 0)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesDetails;

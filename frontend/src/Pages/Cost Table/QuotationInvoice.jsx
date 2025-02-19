import React, { useEffect, useState } from 'react';
import './QuotationInvoice.css';
import one from '../../assets/1.jpg';
import two from '../../assets/2.jpg';
import three from '../../assets/3.jpg';
import config from '../../config';
import { jsPDF } from "jspdf";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Download } from 'lucide-react'

const QuotationInvoice = () => {
    const { store } = useParams();
    const { id } = useParams();

    const [productCode, setProductCode] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (productCode) {
            const url = `${config.BASE_URL}/product/image/${productCode}`;
            console.log('Fetching image from:', url); // Debugging
            axios.get(url)
                .then(response => {
                    setImageUrl(response.config.url);
                })
                .catch(error => {
                    console.error('Error fetching product image:', error);
                });
        }
    }, [productCode]);

    const [Colkan, setColkan] = useState(false);
    const [Haman, setHaman] = useState(false);
    const [TerraWalkers, setTerraWalkers] = useState(false);

    // Data states
    const [costingDetails, setCostingDetails] = useState([]);
    const [costingHeader, setCostingHeader] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        cusName: '',
        cusJob: '',
        cusAddress: '',
        Date: new Date().toISOString().slice(0, 16),
        preparedBy: '' // New field
    });
    

    // UI states
    const [showAddress, setShowAddress] = useState(true);
    const [showBank, setShowBank] = useState(true);
    const [showRemove, setShowRemove] = useState(null);

    const handleFormChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // If customer name is being typed, fetch customer data
        if (name === 'cusName' && value.length > 2) {
            try {
                const response = await fetch(`${config.BASE_URL}/customer/cusName/${encodeURIComponent(value)}`);
                if (response.ok) {
                    const customerData = await response.json();
                    if (customerData) {
                        setFormData(prev => ({
                            ...prev,
                            cusJob: customerData.job_title || '',
                            cusAddress: customerData.address || ''
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        }
    };

    // Handle Quotation Number change
    const handleQuotationNoChange = async (e) => {
        const costingId = e.target.value;
        setFormData(prev => ({
            ...prev,
            id: costingId
        }));

        if (costingId) {
            await fetchCostingData(costingId);
        }
    };

    // Fetch costing data
    const fetchCostingData = async (id) => {
        try {
            const response = await fetch(`${config.BASE_URL}/costing/${id}`);
            if (response.ok) {
                const data = await response.json();
                console.log('API Response:', data); // Debugging: Log the API response

                setCostingHeader(data);
                setCostingDetails(data.CostingDetails || []);

                // Extract customer details from the response
                const customerData = data.customer || {};

                // Update form data with customer details
                setFormData(prev => ({
                    ...prev,
                    id: id,
                    cusName: customerData.cusName || '',
                    cusJob: customerData.cusJob || '',
                    cusAddress: customerData.cusAddress || '',
                    Date: data.created_at || new Date().toISOString().slice(0, 16),
                    preparedBy: data.preparedBy || '' // Extract preparedBy
                }));
                

                // Extract productId from CostingDetails
                if (data.CostingDetails && data.CostingDetails.length > 0) {
                    const firstProduct = data.CostingDetails[0];
                    console.log('First Product:', firstProduct); // Debugging: Log the first product

                    // Extract productId (handle nested or alternative fields)
                    const product_code = firstProduct.product_code;
                    setProductCode(product_code);
                    console.log('Product Code:', product_code); // Debugging: Log the product code

                } else {
                    setProductCode(''); // Reset productId if no details are found
                }

                // Handle customer store type
                switch (customerData.cusStore) {
                    case 'Colkan':
                        setColkan(true);
                        setHaman(false);
                        setTerraWalkers(false);
                        break;
                    case 'Haman':
                        setColkan(false);
                        setHaman(true);
                        setTerraWalkers(false);
                        break;
                    case 'TerraWalkers':
                        setColkan(false);
                        setHaman(false);
                        setTerraWalkers(true);
                        break;
                    default:
                        setColkan(false);
                        setHaman(false);
                        setTerraWalkers(false);
                }
            } else {
                alert('Costing not found');
            }
        } catch (error) {
            console.error('Error fetching costing data:', error);
            alert('An error occurred while fetching costing data');
        }
    };

    useEffect(() => {
        if (id) {
            fetchCostingData(id);
        }
    }, [id]);

    // Calculate totals
    const calculateTotals = () => {
        if (!costingDetails.length) return { subtotal: '0.00', totalDiscount: '0.00', total: '0.00' };

        const subtotal = costingDetails.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const totalDiscount = costingDetails.reduce((sum, item) => sum + (Number(item.discount_value) || 0), 0);

        return {
            subtotal: subtotal.toFixed(2),
            totalDiscount: totalDiscount.toFixed(2),
            total: (subtotal - totalDiscount).toFixed(2)
        };
    };

    // Handle printing
    const handlePrint = () => {
        const printContent = document.getElementById('invoice-card');
        if (printContent) {
            const doc = new jsPDF();
            doc.html(printContent, {
                callback: function (doc) {
                    doc.autoPrint();
                    window.open(doc.output('bloburl'), '_blank');
                    // doc.save('Quotation_invoice.pdf');
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

    const handleDownload = () => {
        const printContent = document.getElementById('invoice-card');
        if (printContent) {
            const doc = new jsPDF();
            doc.html(printContent, {
                callback: function (doc) {
                    // doc.autoPrint();
                    // window.open(doc.output('bloburl'), '_blank');
                    doc.save('Quotation_invoice.pdf');
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

    // UI event handlers
    const handleAddress = (e) => {
        setShowAddress(e.target.checked);
    };

    const handleBank = (e) => {
        setShowBank(e.target.checked);
    };

    const totals = calculateTotals();

    return (
        <div>
            <div className="scrolling-container">
                <h4> QUOTATION INVOICE</h4>
                <div className="invoice-page">
                    <div className="invoice">
                        <div id="invoice-card">
                            {/* Company Headers */}
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
                                <h4>Quotation</h4>
                            </div>

                            {/* Billing Details Section */}
                            <section className="billing-details">
                                {/* <div className="invoice-info">
                                    <label>Customer Details</label>
                                    <div className="details mb-2">
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="cusName"
                                            value={formData.cusName}
                                            onChange={handleFormChange}
                                            placeholder="Customer Name"
                                        />
                                    </div>
                                    <div className="details mb-2">
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="cusJob"
                                            value={formData.cusJob}
                                            onChange={handleFormChange}
                                            placeholder="Job Title"
                                        />
                                    </div>
                                    <div className="details mb-2">
                                        <div className="details-box">
                                            <textarea
                                                className="form-input"
                                                name="cusAddress"
                                                rows="2"
                                                style={{ resize: "both" }}
                                                value={formData.cusAddress}
                                                onChange={handleFormChange}
                                                placeholder="Address"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div> */}

                                <div className="invoice-info">
                                    <label className='mb-3'><b>Customer Details</b></label>
                                    <p className="details-paragraph">
                                        {formData.cusName && `Name: ${formData.cusName}. `} <br />
                                        {formData.cusJob && `Job Title: ${formData.cusJob}. `} <br />
                                        {formData.cusAddress && `Address: ${formData.cusAddress}.`} <br />
                                    </p>
                                </div>


                                <div className="invoice-info">
                                    {/* <div className="details mb-2">
                                        <label>Date</label>
                                        <input
                                            type="datetime-local"
                                            className="date"
                                            name="Date"
                                            value={new Date().toISOString().slice(0, 16)} // Always set to today's date
                                            readOnly
                                        />
                                    </div> */}

                                    <div className="details mb-2">
                                        <label>Date</label>
                                        <input
                                            type="date" // Use type="date" to only show the date
                                            className="date"
                                            name="Date"
                                            value={new Date().toISOString().slice(0, 10)} // Only get the date part (YYYY-MM-DD)
                                            readOnly
                                        />
                                    </div>


                                    <div className="details mb-2">
                                        <label>Quotation No</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="QuotationNo"
                                            value={formData.id}
                                            onChange={handleQuotationNoChange}
                                            placeholder="Enter Quotation No"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Products Table */}
                            <table className="invoice-table mb-2">
                                <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Item Picture</th>
                                        <th>Product Code</th>
                                        <th>Description</th>
                                        <th>Warranty</th>
                                        <th>UOM</th>
                                        <th>Unit Price</th>
                                        <th>Discount</th>
                                        <th>Discounted Price</th>
                                        <th>Qty</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {costingDetails.length === 0 ? (
                                        <tr>
                                            <td colSpan={11}>No products found for this quotation.</td>
                                        </tr>
                                    ) : (
                                        costingDetails.map((detail, index) => (
                                            <tr key={index} className="table-row">
                                                <td id="table-sn">{index + 1}</td>
                                                <td id="table-sn">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt="Product"
                                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <p>no image</p>
                                                    )}
                                                </td>
                                                <td id="table-sn">{detail.product_code}</td>
                                                <td id="table-sn">{detail.description}</td>
                                                <td id="table-sn">{detail.warranty}</td>
                                                <td id="table-sn">{detail.uom}</td>
                                                <td id="table-sn">{Number(detail.unit_price).toFixed(2)}</td>
                                                <td id="table-sn">{Number(detail.discount_value).toFixed(2)}</td>
                                                <td id="table-sn">{Number(detail.discounted_price).toFixed(2)}</td>
                                                <td id="table-sn">{detail.qty}</td>
                                                <td id="table-sn">{Number(detail.amount).toFixed(2)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                <tr>
                                    <td id="table-content" colSpan={9}></td>
                                    <td>TOTAL - LKR</td>
                                    <td>{totals.subtotal}</td>
                                </tr>
                            </table>

                            {/* Footer Section */}
                            <footer className="invoice-footer" style={{ textAlign: 'left', color: 'black', fontSize: 'small', paddingLeft: '20px', marginTop: '20px' }}>
                                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                    <li>Delivery will be within 3 working days from the date of receipt of confirmed purchase order.</li>
                                    <li>Warranty terms: For warranty claims, an original invoice is required. In the event of a faulty product, it will be repaired or replaced according to the nature of the fault.</li>
                                    <li>Exclusion: The company will not be liable for claims against product failures/non-performance caused due to natural disasters (lightning, floods, etc.), high voltage, or improper installation and handling.</li>
                                    <li>Payment mode: Cash or cheque. All cheques are to be drawn in favour of {Colkan ? "Colkan Holdings (Pvt) Ltd" : Haman ? "Haman" : TerraWalkers ? "Terra Walkers" : "[Insert Company Name]"} and crossed account payee only payee only.</li>
                                    <li> <b>

                                        {Colkan && (
                                            <>
                                                Bank: HNB | Account Number: 250010032342 | Account Name: Colkan Holdings (Pvt) LTD | Branch Name: Colkan
                                            </>
                                        )}
                                        {Haman && (
                                            <>
                                                Bank: BOC | Account Number: 93829087 | Account Name: Haman | Branch Name: Wellewathe
                                            </>
                                        )}
                                        {TerraWalkers && (
                                            <>
                                                Bank: Sampath Bank | Account Number: 0117 1000 1407 | Account Name: TerraWalkers Walkers | Branch Name: Kirulapona
                                            </>
                                        )} </b>
                                    </li>
                                    <li>Prices valid only for 14 days from the date of quotation.</li>
                                    <p className='mt-1'>Prepared by: {formData.preparedBy || '...............................'}</p>

                                    <p>This is a computer-generated document, no signature required.</p>
                                </ul>
                            </footer>
                        </div>
                    </div>

                    {/* Options Section */}
                    <div className="options">
                        <div className="invoice-type">
                            <form action="">
                                <br />
                            </form>
                        </div>

                        <div className="payment-form-button d-grid d-md-flex me-md-2 justify-content-end px-5">
                            <button onClick={handleDownload} className='btn btn-success mb-2'><Download /> Download</button>
                        </div>
                        <div className="payment-form-button  d-grid d-md-flex me-md-2 justify-content-end px-5">
                            <Link to='/qutation'><button className='btn btn-danger'>Cancel</button></Link>
                            <button onClick={handlePrint} className="btn btn-warning">
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationInvoice;

// import React, { useEffect, useState } from 'react';
// import './QuotationInvoice.css';
// import one from '../../assets/1.jpg';
// import two from '../../assets/2.jpg';
// import three from '../../assets/3.jpg';
// import config from '../../config';
// import { jsPDF } from "jspdf";
// import { useParams } from 'react-router-dom';

// const QuotationInvoice = () => {
//     const { store } = useParams();
//     const { id } = useParams();

//     // Store states
//     const [Colkan, setColkan] = useState(false);
//     const [Haman, setHaman] = useState(false);
//     const [TerraWalkers, setTerraWalkers] = useState(false);

//     // Data states
//     const [costingDetails, setCostingDetails] = useState([]);
//     const [costingHeader, setCostingHeader] = useState(null);
//     const [formData, setFormData] = useState({
//         id: '',
//         cusName: '',
//         cusJob: '',
//         cusAddress: '',
//         Date: new Date().toISOString().slice(0, 16)
//     });

//     // UI states
//     const [showAddress, setShowAddress] = useState(true);
//     const [showBank, setShowBank] = useState(true);
//     const [showRemove, setShowRemove] = useState(null);

//     const handleFormChange = async (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));

//         // If customer name is being typed, fetch customer data
//         if (name === 'cusName' && value.length > 2) {
//             try {
//                 const response = await fetch(`${config.BASE_URL}/customer/cusName/${encodeURIComponent(value)}`);
//                 if (response.ok) {
//                     const customerData = await response.json();
//                     if (customerData) {
//                         setFormData(prev => ({
//                             ...prev,
//                             cusJob: customerData.job_title || '',
//                             cusAddress: customerData.address || ''
//                         }));
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching customer data:', error);
//             }
//         }
//     };

//     // Handle Quotation Number change
//     const handleQuotationNoChange = async (e) => {
//         const costingId = e.target.value;
//         setFormData(prev => ({
//             ...prev,
//             id: costingId
//         }));

//         if (costingId) {
//             await fetchCostingData(costingId);
//         }
//     };

//     // Fetch costing data
//     const fetchCostingData = async (id) => {
//         try {
//             const response = await fetch(`${config.BASE_URL}/costing/${id}`);
//             if (response.ok) {
//                 const data = await response.json();
//                 setCostingHeader(data);
//                 setCostingDetails(data.CostingDetails || []);

//                 // Extract customer details from the response
//                 const customerData = data.customer || {};

//                 // Update form data with customer details
//                 setFormData(prev => ({
//                     ...prev,
//                     id: id,
//                     cusName: customerData.cusName || '',
//                     cusJob: customerData.cusJob || '',
//                     cusAddress: customerData.cusAddress || '',
//                     Date: data.created_at || new Date().toISOString().slice(0, 16)
//                 }));
//                 switch (customerData.cusStore) {
//                     case 'Colkan':
//                         setColkan(true);
//                         setHaman(false);
//                         setTerraWalkers(false);
//                         break;
//                     case 'Haman':
//                         setColkan(false);
//                         setHaman(true);
//                         setTerraWalkers(false);
//                         break;
//                     case 'TerraWalkers':
//                         setColkan(false);
//                         setHaman(false);
//                         setTerraWalkers(true);
//                         break;
//                     default:
//                         setColkan(false);
//                         setHaman(false);
//                         setTerraWalkers(false);
//                 }
//             } else {
//                 alert('Costing not found');
//             }
//         } catch (error) {
//             console.error('Error fetching costing data:', error);
//             alert('An error occurred while fetching costing data');
//         }
//     };


//     useEffect(() => {
//         if (id) {
//             fetchCostingData(id);
//         }
//     }, [id]);

//     // Calculate totals
//     const calculateTotals = () => {
//         if (!costingDetails.length) return { subtotal: '0.00', totalDiscount: '0.00', total: '0.00' };

//         const subtotal = costingDetails.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
//         const totalDiscount = costingDetails.reduce((sum, item) => sum + (Number(item.discount_value) || 0), 0);

//         return {
//             subtotal: subtotal.toFixed(2),
//             totalDiscount: totalDiscount.toFixed(2),
//             total: (subtotal - totalDiscount).toFixed(2)
//         };
//     };

//     // Handle printing
//     const handlePrint = () => {
//         const printContent = document.getElementById('invoice-card');
//         if (printContent) {
//             const doc = new jsPDF();
//             doc.html(printContent, {
//                 callback: function (doc) {
//                     doc.autoPrint();
//                     window.open(doc.output('bloburl'), '_blank');
//                     doc.save('Quotation_invoice.pdf');
//                 },
//                 x: 10,
//                 y: 10,
//                 width: 190,
//                 windowWidth: 800,
//             });
//         } else {
//             console.error('Invoice card not found!');
//         }
//     };

//     // UI event handlers
//     const handleAddress = (e) => {
//         setShowAddress(e.target.checked);
//     };

//     const handleBank = (e) => {
//         setShowBank(e.target.checked);
//     };

//     const totals = calculateTotals();

//     return (
//         <div>
//             <div className="scrolling-container">
//                 <h4> <b> QUOTATION INVOICE</b></h4>
//                 <div className="invoice-page">
//                     <div className="invoice">
//                         <div id="invoice-card">
//                             {/* Company Headers */}
//                             {Colkan && (
//                                 <section className="invoice-header">
//                                     <img src={one} alt="" className="header-img" />
//                                 </section>
//                             )}
//                             {Haman && (
//                                 <section className="invoice-header">
//                                     <img src={two} alt="" className="header-img" />
//                                 </section>
//                             )}
//                             {TerraWalkers && (
//                                 <section className="invoice-header">
//                                     <img src={three} alt="" className="header-img" />
//                                 </section>
//                             )}

//                             <div className="type-head text-center">
//                                 <h4>Quotation Invoice</h4>
//                             </div>

//                             {/* Billing Details Section */}
//                             <section className="billing-details">
//                                 <div className="invoice-info">
//                                     <label>Customer Details</label>
//                                     <div className="details mb-2">
//                                         <input
//                                             type="text"
//                                             className="form-input"
//                                             name="cusName"
//                                             value={formData.cusName}
//                                             onChange={handleFormChange}
//                                             placeholder="Customer Name"
//                                         />
//                                     </div>
//                                     <div className="details mb-2">
//                                         <input
//                                             type="text"
//                                             className="form-input"
//                                             name="cusJob"
//                                             value={formData.cusJob}
//                                             onChange={handleFormChange}
//                                             placeholder="Job Title"
//                                         />
//                                     </div>
//                                     <div className="details mb-2">
//                                         <div className="details-box">
//                                             <textarea
//                                                 className="form-input"
//                                                 name="cusAddress"
//                                                 rows="2"
//                                                 style={{ resize: "both" }}
//                                                 value={formData.cusAddress}
//                                                 onChange={handleFormChange}
//                                                 placeholder="Address"
//                                             ></textarea>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="invoice-info">

//                                     {/* <div className="details mb-2">
//                                         <label>Date</label>
//                                         <input
//                                             type="datetime-local"
//                                             className="date"
//                                             name="Date"
//                                             value={formData.Date}
//                                             readOnly
//                                         />
//                                     </div> */}

//                                     <div className="details mb-2">
//                                         <label>Date</label>
//                                         <input
//                                             type="datetime-local"
//                                             className="date"
//                                             name="Date"
//                                             value={new Date().toISOString().slice(0, 16)} // Always set to today's date
//                                             readOnly
//                                         />
//                                     </div>

//                                     <div className="details mb-2">
//                                         <label>Quotation No</label>
//                                         <input
//                                             type="text"
//                                             className="form-input"
//                                             name="QuotationNo"
//                                             value={formData.id}
//                                             onChange={handleQuotationNoChange}
//                                             placeholder="Enter Quotation No"
//                                         />
//                                     </div>
//                                 </div>
//                             </section>

//                             {/* Products Table */}
//                             <table className="invoice-table mb-2">
//                                 <thead>

//                                     <tr>
//                                         <th>S/N</th>
//                                         <th>Item Picture</th>
//                                         <th>Product Code</th>
//                                         <th>Description</th>
//                                         <th>Warranty</th>

//                                         <th>UOM</th>
//                                         <th>Unit Price</th>
//                                         <th>Discount</th>
//                                         <th>Discounted Price</th>

//                                         <th>Qty</th>

//                                         <th>Amount</th>

//                                     </tr>

//                                 </thead>
//                                 <tbody>
//                                     {costingDetails.length === 0 ? (
//                                         <tr>
//                                             <td colSpan={10}>No products found for this quotation.</td>
//                                         </tr>
//                                     ) : (
//                                         costingDetails.map((detail, index) => (
//                                             <tr key={index} className="table-row">
//                                                 <td id="table-sn">{index + 1}</td>
//                                                 <td id="table-sn">{ }</td>
//                                                 <td id="table-sn">{detail.product_code}</td>
//                                                 <td id="table-sn">{detail.description}</td>
//                                                 <td id="table-sn">{detail.warranty}</td>

//                                                 <td id="table-sn">{detail.uom}</td>
//                                                 <td id="table-sn">{Number(detail.unit_price).toFixed(2)}</td>
//                                                 <td id="table-sn">{Number(detail.discount_value).toFixed(2)}</td>
//                                                 <td id="table-sn">{Number(detail.discounted_price).toFixed(2)}</td>

//                                                 <td id="table-sn">{detail.qty}</td>

//                                                 <td id="table-sn">{Number(detail.amount).toFixed(2)}</td>
//                                             </tr>
//                                         ))
//                                     )}
//                                 </tbody>
//                                 {/* <tbody>
//                                     <tr>
//                                         <td id="table-content" colSpan={9}></td>
//                                         <td>Subtotal</td>
//                                         <td>{totals.subtotal}</td>
//                                     </tr>
//                                     <tr>
//                                         <td id="table-content" colSpan={9}></td>
//                                         <td>Discount</td>
//                                         <td>{totals.totalDiscount}</td>
//                                     </tr>
//                                     <tr>
//                                         <td id="table-content" colSpan={9}></td>
//                                         <td>TOTAL - LKR</td>
//                                         <td>{totals.total}</td>
//                                     </tr>
//                                 </tbody> */}
//                                 <tr>
//                                     <td id="table-content" colSpan={9}></td>
//                                     <td>TOTAL - LKR</td>
//                                     <td>{totals.subtotal}</td>
//                                 </tr>
//                             </table>

//                             {/* Footer Section */}
//                             {/* <footer className="invoice-footer">
//                                  <p className='font-weight-bold'>I / We hereby acknowledge the receipt of the above goods are received in damages.</p>
//                                 <div className="signature">
//                                     <table className="signature-table">
//                                         <thead>
//                                             <tr>
//                                                 <th>Prepared by</th>
//                                                 <th>Issued by</th>
//                                                 <th>Company seal & sign</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             <tr>
//                                                 <td></td>
//                                                 <td></td>
//                                                 <td></td>
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </footer> */}

//                             <footer className="invoice-footer" style={{ textAlign: 'left', color: 'black', fontSize: 'small', paddingLeft: '20px', marginTop: '20px' }}>
//                                 <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
//                                     <li>Delivery will be within 3 working days from the date of receipt of confirmed purchase order.</li>
//                                     <li>Warranty terms: For warranty claims, an original invoice is required. In the event of a faulty product, it will be repaired or replaced according to the nature of the fault.</li>
//                                     <li>Exclusion: The company will not be liable for claims against product failures/non-performance caused due to natural disasters (lightning, floods, etc.), high voltage, or improper installation and handling.</li>
//                                     <li>Payment mode: Cash or cheque. All cheques are to be drawn in favour of [Insert Company Name] and crossed account payee only payee only.</li>
//                                     <li>[Bank Name | Acc NO - xxxxxx | Acc Name : ' ' | Branch Name & Code: xxxx</li>
//                                     <li>Prices valid only for 14 days from the date of quotation.</li>
//                                     <p className='mt-1'>Prepared by: ...............................</p>
//                                     <p>This is a computer-generated document, no signature required.</p>
//                                 </ul>
//                             </footer>




//                         </div>
//                     </div>

//                     {/* Options Section */}
//                     <div className="options">
//                         <div className="invoice-type">
//                             <form action="">
//                                 <br />
//                                 {/* <label className='invoice-type-label' htmlFor="">Address</label>
//                                 <input type="checkbox" name="address" value="address" checked={showAddress} onChange={handleAddress} />
//                                 <br />
//                                 <label className='invoice-type-label' htmlFor="">Bank</label>
//                                 <input type="checkbox" name="bank" value="bank" checked={showBank} onChange={handleBank} /> */}
//                             </form>
//                         </div>
//                         <button onClick={handlePrint} className="btn btn-success">
//                             Print Invoice
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default QuotationInvoice;

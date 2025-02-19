// import React, { useEffect, useState } from 'react';
// import './DueInvoice.css';
// import { jsPDF } from "jspdf";
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import config from '../../config';
// import one from '../../assets/1.jpg'; // Colkan header image
// import two from '../../assets/2.jpg'; // Haman header image
// import three from '../../assets/3.jpg'; // TerraWalkers header image

// const DueInvoice = () => {
//     const { cusId } = useParams(); // Get cusId from URL
//     const [customer, setCustomer] = useState(null);
//     const [invoiceData, setInvoiceData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Store states
//     const [Colkan, setColkan] = useState(false);
//     const [Haman, setHaman] = useState(false);
//     const [TerraWalkers, setTerraWalkers] = useState(false);

//     // Fetch customer details and invoice data
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch customer details
//                 const customerResponse = await axios.get(`${config.BASE_URL}/customer/${cusId}`);
//                 setCustomer(customerResponse.data);

//                 // Set company header based on customer's store type
//                 switch (customerResponse.data.cusStore) {
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

//                 // Fetch invoice data for the customer
//                 const invoiceResponse = await axios.get(`${config.BASE_URL}/duecustomer/invoice/${cusId}`);
//                 setInvoiceData(invoiceResponse.data);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setError('Failed to fetch data');
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchData();
//     }, [cusId]);

//     // Handle printing
//     const handlePrint = () => {
//         const printContent = document.getElementById('invoice-card');
//         if (printContent) {
//             const doc = new jsPDF();
//             doc.html(printContent, {
//                 callback: function (doc) {
//                     doc.autoPrint();
//                     window.open(doc.output('bloburl'), '_blank');
//                     doc.save('Due_Invoice.pdf');
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

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div>
//             <div className="scrolling-container">
//                 <h4>DUE INVOICE</h4>
//                 <div className="invoice-page">
//                     <div className="invoice">
//                         <div id="invoice-card">
//                             {/* Company Header */}
//                             {Colkan && (
//                                 <section className="invoice-header">
//                                     <img src={one} alt="Colkan Holdings" className="header-img" />
//                                 </section>
//                             )}
//                             {Haman && (
//                                 <section className="invoice-header">
//                                     <img src={two} alt="Haman" className="header-img" />
//                                 </section>
//                             )}
//                             {TerraWalkers && (
//                                 <section className="invoice-header">
//                                     <img src={three} alt="Terra Walkers" className="header-img" />
//                                 </section>
//                             )}

//                             {/* Customer Details */}
//                             <section className="billing-details">
//                                 <div className="invoice-info">
//                                     <label className='mb-3'><b>Customer Details</b></label>
//                                     <p className="details-paragraph">
//                                         {customer?.cusName && `Name: ${customer.cusName}. `} <br />
//                                         {customer?.cusJob && `Job Title: ${customer.cusJob}. `} <br />
//                                         {customer?.cusAddress && `Address: ${customer.cusAddress}.`} <br />
//                                     </p>
//                                 </div>

//                                 <div className="invoice-info">
//                                     <div className="details mb-2">
//                                         <label>Date</label>
//                                         <input
//                                             type="text"
//                                             className="date"
//                                             value={new Date().toLocaleDateString()} // Today's date
//                                             readOnly
//                                         />
//                                     </div>
//                                 </div>
//                             </section>
// <br />
//                             {/* Payment Mode and Bank Details */}
//                             <section >
//                                 <p>
//                                     <b>Payment Mode:</b> Cash or cheque. All cheques are to be drawn in favour of {Colkan ? "Colkan Holdings (Pvt) Ltd" : Haman ? "Haman" : TerraWalkers ? "Terra Walkers" : "[Insert Company Name]"} and crossed account payee only payee only.
//                                 </p>
//                                 <p>
//                                     <b>Bank:</b> {Colkan ? (
//                                         <>HNB | Account Number: 250010032342 | Account Name: Colkan Holdings (Pvt) LTD | Branch Name: Colkan</>
//                                     ) : Haman ? (
//                                         <>BOC | Account Number: 93829087 | Account Name: Haman | Branch Name: Wellewathe</>
//                                     ) : TerraWalkers ? (
//                                         <>Sampath Bank | Account Number: 0117 1000 1407 | Account Name: TerraWalkers Walkers | Branch Name: Kirulapona</>
//                                     ) : (
//                                         "[Insert Bank Details]"
//                                     )}
//                                 </p>
//                             </section>

//                             {/* Invoice Table */}
//                             <table className="invoice-table mb-2">
//                                 <thead>
//                                     <tr>
//                                         <th>Invoice No</th>
//                                         <th>Cheque Details</th>
//                                         <th>Cheque Given Date</th>
//                                         <th>Dated Cheque</th>
//                                         {/* <th>Total Due</th> */}
//                                         <th>Paid</th>
//                                         <th>Paid Yes Or No</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {invoiceData.length === 0 ? (
//                                         <tr>
//                                             <td colSpan={7}>No invoices found for this customer.</td>
//                                         </tr>
//                                     ) : (
//                                         invoiceData.map((invoice, index) => (
//                                             <tr key={index}>
//                                                 <td>{invoice.invoiceId}</td>
//                                                 <td>{invoice.chequeDetail || 'N/A'}</td>
//                                                 <td>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</td>
//                                                 <td>{invoice.datedCheque ? new Date(invoice.datedCheque).toLocaleDateString() : 'N/A'}</td>
//                                                 {/* <td>{invoice.totalDue}</td> */}
//                                                 <td>{invoice.paidAmount}</td>
//                                                 <td>
//                                                     <span
//                                                         style={{
//                                                             color: invoice.totalDue > 0 ? 'red' : 'green',
//                                                             fontWeight: invoice.totalDue === 0 ? 'bold' : 'normal',
//                                                         }}
//                                                     >
//                                                         {invoice.totalDue > 0 ? 'No' : 'Yes'}
//                                                     </span>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     )}
//                                 </tbody>
//                             </table>

//                             {/* Footer Section */}
                             
//                         </div>
//                     </div>

//                     {/* Print Button */}
//                     <div className="options">
//                         <button onClick={handlePrint} className="btn btn-success">
//                             Print
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DueInvoice;

import React, { useEffect, useState } from 'react';
import './DueInvoice.css';
import { jsPDF } from "jspdf";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import one from '../../assets/1.jpg'; // Colkan header image
import two from '../../assets/2.jpg'; // Haman header image
import three from '../../assets/3.jpg'; // TerraWalkers header image

const DueInvoice = () => {
    const { cusId } = useParams(); // Get cusId from URL
    const [customer, setCustomer] = useState(null);
    const [invoiceData, setInvoiceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    
    // Store states
    const [Colkan, setColkan] = useState(false);
    const [Haman, setHaman] = useState(false);
    const [TerraWalkers, setTerraWalkers] = useState(false);

    const totalPages = Math.ceil(invoiceData.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = invoiceData.slice(indexOfFirstRow, indexOfLastRow);

    const getPageNumbers = () => {
        let pages = [];
        
        // Always include first page
        pages.push(1);
        
        // Add current page and surrounding pages
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < totalPages) {
                pages.push(i);
            }
        }
        
        // Always include last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        // Remove duplicates and sort
        pages = [...new Set(pages)].sort((a, b) => a - b);
        
        return pages;
    };

    // Fetch customer details and invoice data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const customerResponse = await axios.get(`${config.BASE_URL}/customer/${cusId}`);
                setCustomer(customerResponse.data);

                switch (customerResponse.data.cusStore) {
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

                const invoiceResponse = await axios.get(`${config.BASE_URL}/duecustomer/invoice/${cusId}`);
                setInvoiceData(invoiceResponse.data);
                // Set current page to last page if there's data
                if (invoiceResponse.data.length > 0) {
                    const pages = Math.ceil(invoiceResponse.data.length / rowsPerPage);
                    setCurrentPage(pages);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [cusId, rowsPerPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
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
                    doc.save('Due_Invoice.pdf');
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div className="scrolling-container">
                <h4>DUE INVOICE</h4>
                <div className="invoice-page">
                    <div className="invoice">
                        <div id="invoice-card">
                            {/* Company Header */}
                            {Colkan && (
                                <section className="invoice-header">
                                    <img src={one} alt="Colkan Holdings" className="header-img" />
                                </section>
                            )}
                            {Haman && (
                                <section className="invoice-header">
                                    <img src={two} alt="Haman" className="header-img" />
                                </section>
                            )}
                            {TerraWalkers && (
                                <section className="invoice-header">
                                    <img src={three} alt="Terra Walkers" className="header-img" />
                                </section>
                            )}

                            {/* Customer Details */}
                            <section className="billing-details">
                                <div className="invoice-info">
                                    <label className='mb-3'><b>Customer Details</b></label>
                                    <p className="details-paragraph">
                                        {customer?.cusName && `Name: ${customer.cusName}. `} <br />
                                        {customer?.cusJob && `Job Title: ${customer.cusJob}. `} <br />
                                        {customer?.cusAddress && `Address: ${customer.cusAddress}.`} <br />
                                    </p>
                                </div>

                                <div className="invoice-info">
                                    <div className="details mb-2">
                                        <label>Date</label>
                                        <input
                                            type="text"
                                            className="date"
                                            value={new Date().toLocaleDateString()} // Today's date
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </section>
<br />
                            {/* Payment Mode and Bank Details */}
                            <section >
                                <p>
                                    <b>Payment Mode:</b> Cash or cheque. All cheques are to be drawn in favour of {Colkan ? "Colkan Holdings (Pvt) Ltd" : Haman ? "Haman" : TerraWalkers ? "Terra Walkers" : "[Insert Company Name]"} and crossed account payee only payee only.
                                </p>
                                <p>
                                    <b>Bank:</b> {Colkan ? (
                                        <>HNB | Account Number: 250010032342 | Account Name: Colkan Holdings (Pvt) LTD | Branch Name: Colkan</>
                                    ) : Haman ? (
                                        <>BOC | Account Number: 93829087 | Account Name: Haman | Branch Name: Wellewathe</>
                                    ) : TerraWalkers ? (
                                        <>Sampath Bank | Account Number: 0117 1000 1407 | Account Name: TerraWalkers Walkers | Branch Name: Kirulapona</>
                                    ) : (
                                        "[Insert Bank Details]"
                                    )}
                                </p>
                            </section>

                            {/* Invoice Table */}
                            <table className="invoice-table mb-2">
                                <thead>
                                    <tr>
                                        <th>Invoice No</th>
                                        <th>Cheque Details</th>
                                        <th>Cheque Given Date</th>
                                        <th>Dated Cheque</th>
                                        <th>Paid</th>
                                        <th>Paid Yes Or No</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRows.length === 0 ? (
                                        <tr>
                                            <td colSpan={6}>No invoices found for this customer.</td>
                                        </tr>
                                    ) : (
                                        currentRows.map((invoice, index) => (
                                            <tr key={index}>
                                                <td>{invoice.invoiceId}</td>
                                                <td>{invoice.chequeDetail || 'N/A'}</td>
                                                <td>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</td>
                                                <td>{invoice.datedCheque ? new Date(invoice.datedCheque).toLocaleDateString() : 'N/A'}</td>
                                                <td>{invoice.paidAmount}</td>
                                                <td>
                                                    <span style={{
                                                        color: invoice.totalDue > 0 ? 'red' : 'green',
                                                        fontWeight: invoice.totalDue === 0 ? 'bold' : 'normal',
                                                    }}>
                                                        {invoice.totalDue > 0 ? 'No' : 'Yes'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {totalPages > 1 && (
                                <div className="pagination-controls d-flex justify-content-center align-items-center gap-2 mb-3">
                                    <button 
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        &lt;
                                    </button>
                                    
                                    {getPageNumbers().map((pageNum, index, array) => (
                                        <React.Fragment key={pageNum}>
                                            {index > 0 && array[index - 1] !== pageNum - 1 && (
                                                <span>...</span>
                                            )}
                                            <button
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-outline-primary'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        </React.Fragment>
                                    ))}
                                    
                                    <button 
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Print Button */}
                    <div className="options">
                        <button onClick={handlePrint} className="btn btn-success">
                            Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DueInvoice;
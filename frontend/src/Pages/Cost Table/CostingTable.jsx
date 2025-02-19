// import React, { useState } from 'react';
// import CostingModal from './CostingModal';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Trash } from 'lucide-react';
// import axios from 'axios';
// import config from '../../config';

// const CostingTable = () => {
//     const [entries, setEntries] = useState([]);
//     const [formData, setFormData] = useState({

//         descriptionCustomer: '',
//         productCode: '',
//         description: '',
//         warranty: '',
//         supplier: '',
//         unitCost: 0,
//         ourMarginPercentage: 0,
//         ourMarginValue: 0,
//         otherMarginPercentage: 0,
//         otherMarginValue: 0,
//         pricePlusMargin: 0,
//         sellingRate: 0,
//         sellingRateRounded: 0,
//         uom: '',
//         qty: 1,
//         unitPrice: 0,
//         discountPercentage: 0,
//         discountValue: 0,
//         discountedPrice: 0,
//         amount: 0,
//         profit: 0,
//     });
//     const [showModal, setShowModal] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);

//     const handleInputChange = (updatedData) => {
//         setFormData(updatedData);
//     };

//     const handleSubmit = () => {
//         if (formData.unitCost > 0 && formData.qty > 0) {
//             setEntries([...entries, formData]);
//             resetForm();
//         } else {
//             alert('Please fill in all the fields correctly.');
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             descriptionCustomer: '',
//             productCode: '',
//             description: '',
//             warranty: '',
//             supplier: '',
//             unitCost: 0,
//             ourMarginPercentage: 0,
//             ourMarginValue: 0,
//             otherMarginPercentage: 0,
//             otherMarginValue: 0,
//             pricePlusMargin: 0,
//             sellingRate: 0,
//             sellingRateRounded: 0,
//             uom: '',
//             qty: 1,
//             unitPrice: 0,
//             discountPercentage: 0,
//             discountValue: 0,
//             discountedPrice: 0,
//             amount: 0,
//             profit: 0,
//         });
//     };

//     const handleDelete = (index) => {
//         setEntries(entries.filter((_, i) => i !== index));
//     };

//     const calculateTotals = () => {
//         return entries.reduce((acc, entry) => ({
//             totalAmount: acc.totalAmount + parseFloat(entry.amount),
//             totalProfit: acc.totalProfit + parseFloat(entry.profit)
//         }), { totalAmount: 0, totalProfit: 0 });
//     };

//     // const handleSaveToDatabase = async () => {
//     //     if (entries.length === 0) {
//     //         alert('Please add at least one entry');
//     //         return;
//     //     }

//     //     setIsSaving(true);
//     //     const totals = calculateTotals();

//     //     try {
//     //         // Save header first
//     //         const headerResponse = await axios.post(`${config.BASE_URL}/costing/header`, {
//     //             totalAmount: totals.totalAmount,
//     //             totalProfit: totals.totalProfit
//     //         });

//     //         const headerId = headerResponse.data.id;

//     //         // Save details
//     //         const detailsPromises = entries.map(entry => 
//     //             axios.post(`${config.BASE_URL}/costing/detail`, {
//     //                 headerId,
//     //                 productCode: entry.productCode,
//     //                 descriptionCustomer: entry.descriptionCustomer,
//     //                 description: entry.description,
//     //                 warranty: entry.warranty,
//     //                 supplier: entry.supplier,
//     //                 unitCost: entry.unitCost,
//     //                 ourMarginPercentage: entry.ourMarginPercentage,
//     //                 ourMarginValue: entry.ourMarginValue,
//     //                 otherMarginPercentage: entry.otherMarginPercentage,
//     //                 otherMarginValue: entry.otherMarginValue,
//     //                 pricePlusMargin: entry.pricePlusMargin,
//     //                 sellingRate: entry.sellingRate,
//     //                 sellingRateRounded: entry.sellingRateRounded,
//     //                 uom: entry.uom,
//     //                 qty: entry.qty,
//     //                 unitPrice: entry.unitPrice,
//     //                 discountPercentage: entry.discountPercentage,
//     //                 discountValue: entry.discountValue,
//     //                 discountedPrice: entry.discountedPrice,
//     //                 amount: entry.amount,
//     //                 profit: entry.profit
//     //             })
//     //         );

//     //         await Promise.all(detailsPromises);
//     //         alert('Costing data saved successfully');
//     //         setEntries([]);
//     //     } catch (error) {
//     //         console.error('Error saving costing data:', error);
//     //         alert('Error saving costing data');
//     //     } finally {
//     //         setIsSaving(false);
//     //     }
//     // };

//     const handleSaveToDatabase = async () => {
//         if (entries.length === 0) {
//             alert('Please add at least one entry');
//             return;
//         }

//         setIsSaving(true);
//         const totals = calculateTotals();

//         try {
//             const response = await axios.post(`${config.BASE_URL}/costing`, {
//                 headerData: {
//                     cusId: entries[0].cusId, // Pass the cusId from the first entry
//                     totalAmount: totals.totalAmount,
//                     totalProfit: totals.totalProfit,
//                     status: 'draft',
//                 },
//                 detailsData: entries,
//             });

//             alert('Costing data saved successfully');
//             setEntries([]);
//         } catch (error) {
//             console.error('Error saving costing data:', error);
//             alert('Error saving costing data');
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     return (
//         <div className="container-fluid mt-4">
//             <div className="d-flex justify-content-between mb-3">
//                 <button
//                     className="btn btn-primary"
//                     onClick={() => setShowModal(true)}
//                 >
//                     + Add Entry
//                 </button>

//                 <button
//                     className="btn btn-success"
//                     onClick={handleSaveToDatabase}
//                     disabled={isSaving || entries.length === 0}
//                 >
//                     {isSaving ? 'Saving...' : 'Save to Database'}
//                 </button>
//             </div>

//             <table className="table table-bordered table-striped">
//             <thead>
//     <tr>
//         <th>Customer Name</th> {/* Add this line */}
//         <th className="table-warning">Customer Product Description</th>
//         <th>Product Code</th>
//         <th>Description</th>
//         <th>Warranty</th>
//         <th className="table-warning">Supplier</th>
//         <th className="table-warning">Unit Cost</th>
//         <th className="table-warning">Our Margin %</th>
//         <th className="table-warning">Our Margin Value</th>
//         <th className="table-warning">Other Margin %</th>
//         <th className="table-warning">Other Margin Value</th>
//         <th className="table-warning">Price + Margin</th>
//         <th className="table-warning">Selling Rate Before Discount</th>
//         <th className="table-warning">Selling Rate (Rounded to Nearest 10)</th>
//         <th>UOM</th>
//         <th>Qty</th>
//         <th>Unit Price</th>
//         <th>Discount %</th>
//         <th>Discount Value</th>
//         <th>Discounted Price</th>
//         <th>Amount</th>
//         <th className="table-warning">Profit</th>
//         <th>Action</th>
//     </tr>
// </thead>
// <tbody>
//     {entries.map((entry, index) => (
//         <tr key={index}>
//             <td>{entry.customerName}</td> {/* Add this line */}
//             {Object.entries(entry).map(([key, value], i) => {
//                 // Check if the key corresponds to a "table-warning" header
//                 const isWarningColumn = [
//                     'descriptionCustomer',
//                     'supplier',
//                     'unitCost',
//                     'ourMarginPercentage',
//                     'ourMarginValue',
//                     'otherMarginPercentage',
//                     'otherMarginValue',
//                     'pricePlusMargin',
//                     'sellingRate',
//                     'sellingRateRounded',
//                     'profit',
//                 ].includes(key);

//                 return (
//                     <td key={i} className={isWarningColumn ? 'table-warning' : ''}>
//                         {value}
//                     </td>
//                 );
//             })}
//             <td>
//                 <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(index)}
//                 >
//                     <Trash size={16} />
//                 </button>
//             </td>
//         </tr>
//     ))}
// </tbody>
//             </table>

//             <CostingModal
//     showModal={showModal}
//     closeModal={() => setShowModal(false)}
//     formData={formData}
//     onChange={(updatedData) => setFormData(updatedData)}
//     onSubmit={(newEntry) => {
//         setEntries([...entries, { ...newEntry, cusId: newEntry.cusId }]); // Ensure cusId is included
//         setFormData({
//             descriptionCustomer: '',
//             productCode: '',
//             description: '',
//             warranty: '',
//             supplier: '',
//             unitCost: 0,
//             ourMarginPercentage: 0,
//             ourMarginValue: 0,
//             otherMarginPercentage: 0,
//             otherMarginValue: 0,
//             pricePlusMargin: 0,
//             sellingRate: 0,
//             sellingRateRounded: 0,
//             uom: '',
//             qty: 1,
//             unitPrice: 0,
//             discountPercentage: 0,
//             discountValue: 0,
//             discountedPrice: 0,
//             amount: 0,
//             profit: 0,
//         });
//     }}
// />
//         </div>
//     );
// };

// export default CostingTable;




// ----------------------------------------------------------------------------------------------------------------------------------


// import React, { useState } from 'react';
// import CostingModal from './CostingModal';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Trash } from 'lucide-react';
// import axios from 'axios';
// import config from '../../config';

// const CostingTable = () => {
//     const [entries, setEntries] = useState([]);
//     const [formData, setFormData] = useState({
//         descriptionCustomer: '',
//         productCode: '',
//         description: '',
//         warranty: '',
//         supplier: '',
//         unitCost: 0,
//         ourMarginPercentage: 0,
//         ourMarginValue: 0,
//         otherMarginPercentage: 0,
//         otherMarginValue: 0,
//         pricePlusMargin: 0,
//         sellingRate: 0,
//         sellingRateRounded: 0,
//         uom: '',
//         qty: 1,
//         unitPrice: 0,
//         discountPercentage: 0,
//         discountValue: 0,
//         discountedPrice: 0,
//         amount: 0,
//         profit: 0,
//     });

//     const [showModal, setShowModal] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);

//     const handleInputChange = (updatedData) => {
//         setFormData(updatedData);
//     };

//     const handleSubmit = () => {
//         if (formData.unitCost > 0 && formData.qty > 0) {
//             setEntries([...entries, { ...formData, needImage: false }]);
//             resetForm();
//         } else {
//             alert('Please fill in all the fields correctly.');
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             descriptionCustomer: '',
//             productCode: '',
//             description: '',
//             warranty: '',
//             supplier: '',
//             unitCost: 0,
//             ourMarginPercentage: 0,
//             ourMarginValue: 0,
//             otherMarginPercentage: 0,
//             otherMarginValue: 0,
//             pricePlusMargin: 0,
//             sellingRate: 0,
//             sellingRateRounded: 0,
//             uom: '',
//             qty: 1,
//             unitPrice: 0,
//             discountPercentage: 0,
//             discountValue: 0,
//             discountedPrice: 0,
//             amount: 0,
//             profit: 0,
//         });
//     };

//     const handleDelete = (index) => {
//         setEntries(entries.filter((_, i) => i !== index));
//     };

//     const calculateTotals = () => {
//         return entries.reduce((acc, entry) => ({
//             totalAmount: acc.totalAmount + parseFloat(entry.amount),
//             totalProfit: acc.totalProfit + parseFloat(entry.profit)
//         }), { totalAmount: 0, totalProfit: 0 });
//     };


//     const handleSaveToDatabase = async () => {
//         if (entries.length === 0) {
//             alert('Please add at least one entry');
//             return;
//         }

//         setIsSaving(true);
//         const totals = calculateTotals();

//         try {
//             const response = await axios.post(`${config.BASE_URL}/costing`, {
//                 headerData: {
//                     cusId: entries[0].cusId, // Ensure cusId is included
//                     totalAmount: totals.totalAmount,
//                     totalProfit: totals.totalProfit,
//                     status: 'draft',
//                 },
//                 detailsData: entries.map(entry => ({
//                     ...entry,
//                     needImage: entry.needImage || false, // Ensure needImage is included
//                 })),
//             });

//             alert('Costing data saved successfully');
//             setEntries([]);
//         } catch (error) {
//             console.error('Error saving costing data:', error);
//             alert('Error saving costing data');
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     return (
//         <div className="container-fluid mt-4">
//             <div className="d-flex justify-content-between mb-3">
//                 <button
//                     className="btn btn-primary"
//                     onClick={() => setShowModal(true)}
//                 >
//                     + Add Entry
//                 </button>

//                 <button
//                     className="btn btn-success"
//                     onClick={handleSaveToDatabase}
//                     disabled={isSaving || entries.length === 0}
//                 >
//                     {isSaving ? 'Saving...' : 'Save to Database'}
//                 </button>
//             </div>

//             <table className="table table-bordered table-striped">
//             <thead>
//     <tr>
//         <th>Customer Name</th> 
//         <th className="table-warning">Customer Product Description</th>
//         <th>Product Code or Name</th>
//         <th>Need Image</th> 
//         <th>Description</th>
//         <th>Warranty</th>
//         <th className="table-warning">Supplier</th>
//         <th className="table-warning">Unit Cost</th>
//         <th className="table-warning">Our Margin %</th>
//         <th className="table-warning">Our Margin Value</th>
//         <th className="table-warning">Other Margin %</th>
//         <th className="table-warning">Other Margin Value</th>
//         <th className="table-warning">Price + Margin</th>
//         <th className="table-warning">Selling Rate Before Discount</th>
//         <th className="table-warning">Selling Rate (Rounded to Nearest 10)</th>
//         <th>UOM</th>
//         <th>Qty</th>
//         <th>Unit Price</th>
//         <th>Discount %</th>
//         <th>Discount Value</th>
//         <th>Discounted Price</th>
//         <th>Amount</th>
//         <th className="table-warning">Profit</th>
//         <th>Action</th>
//     </tr>
// </thead>

// <tbody>
//     {entries.map((entry, index) => (
//         <tr key={index}>
//             <td>{entry.customerName}</td>
//             <td>{entry.descriptionCustomer}</td>
//             <td>{entry.productCode}</td>
//             <td>
//                 <input
//                     type="checkbox"
//                     checked={entry.needImage || false}
//                     onChange={(e) => {
//                         const updatedEntries = [...entries];
//                         updatedEntries[index].needImage = e.target.checked;
//                         setEntries(updatedEntries);
//                     }}
//                 />
//             </td>
//             <td>{entry.description}</td>
//             <td>{entry.warranty}</td>
//             <td>{entry.supplier}</td>
//             <td>{entry.unitCost}</td>
//             <td>{entry.ourMarginPercentage}</td>
//             <td>{entry.ourMarginValue}</td>
//             <td>{entry.otherMarginPercentage}</td>
//             <td>{entry.otherMarginValue}</td>
//             <td>{entry.pricePlusMargin}</td>
//             <td>{entry.sellingRate}</td>
//             <td>{entry.sellingRateRounded}</td>
//             <td>{entry.uom}</td>
//             <td>{entry.qty}</td>
//             <td>{entry.unitPrice}</td>
//             <td>{entry.discountPercentage}</td>
//             <td>{entry.discountValue}</td>
//             <td>{entry.discountedPrice}</td>
//             <td>{entry.amount}</td>
//             <td>{entry.profit}</td>
//             <td>
//                 <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(index)}
//                 >
//                     <Trash size={16} />
//                 </button>
//             </td>
//         </tr>
//     ))}
// </tbody>

//             </table>

//             <CostingModal
//     showModal={showModal}
//     closeModal={() => setShowModal(false)}
//     formData={formData}
//     onChange={(updatedData) => setFormData(updatedData)}
//     onSubmit={(newEntry) => {
//         setEntries([...entries, { ...newEntry, cusId: newEntry.cusId }]); // Ensure cusId is included
//         setFormData({
//             descriptionCustomer: '',
//             productCode: '',
//             description: '',
//             warranty: '',
//             supplier: '',
//             unitCost: 0,
//             ourMarginPercentage: 0,
//             ourMarginValue: 0,
//             otherMarginPercentage: 0,
//             otherMarginValue: 0,
//             pricePlusMargin: 0,
//             sellingRate: 0,
//             sellingRateRounded: 0,
//             uom: '',
//             qty: 1,
//             unitPrice: 0,
//             discountPercentage: 0,
//             discountValue: 0,
//             discountedPrice: 0,
//             amount: 0,
//             profit: 0,
//         });
//     }}
// />
//         </div>
//     );
// };

// export default CostingTable;



// -------------------------------------------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import { Trash } from 'lucide-react';
// import axios from 'axios';
// import config from '../../config';

// const CostingTable = () => {
//   const [entries, setEntries] = useState([]);
//   const [formData, setFormData] = useState({
//     descriptionCustomer: '',
//     productCode: '',
//     description: '',
//     warranty: '',
//     supplier: '',
//     unitCost: 0,
//     ourMarginPercentage: 0,
//     ourMarginValue: 0,
//     otherMarginPercentage: 0,
//     otherMarginValue: 0,
//     pricePlusMargin: 0,
//     sellingRate: 0,
//     sellingRateRounded: 0,
//     uom: '',
//     qty: 1,
//     unitPrice: 0,
//     discountPercentage: 0,
//     discountValue: 0,
//     discountedPrice: 0,
//     amount: 0,
//     profit: 0,
//   });

//   const [customerName, setCustomerName] = useState('');
//   const [customerSuggestions, setCustomerSuggestions] = useState([]);
//   const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
//   const [productSuggestions, setProductSuggestions] = useState([]);
//   const [showProductSuggestions, setShowProductSuggestions] = useState(false);
//   const [customerDetails, setCustomerDetails] = useState({
//     cusJob: '',
//     cusOffice: '',
//     cusAddress: '',
//   });
//   const [isSaving, setIsSaving] = useState(false);

//   const fetchCustomerSuggestions = async (name) => {
//     try {
//       const response = await axios.get(`${config.BASE_URL}/customers/suggestion`, {
//         params: { name },
//       });
//       setCustomerSuggestions(response.data);
//       setShowCustomerSuggestions(true);
//     } catch (error) {
//       console.error('Error fetching customer suggestions:', error);
//       setCustomerSuggestions([]);
//       setShowCustomerSuggestions(false);
//     }
//   };

//   const fetchProductSuggestions = async (query) => {
//     try {
//       const response = await axios.get(`${config.BASE_URL}/products/suggestions`, {
//         params: { query },
//       });
//       setProductSuggestions(response.data);
//       setShowProductSuggestions(true);
//     } catch (error) {
//       console.error('Error fetching product suggestions:', error);
//       setProductSuggestions([]);
//       setShowProductSuggestions(false);
//     }
//   };

//   const fetchCustomerDetails = async (cusName) => {
//     try {
//       const response = await axios.get(`${config.BASE_URL}/customer/cusName/${cusName}`);
//       const customer = response.data;
//       setCustomerDetails({
//         cusJob: customer.cusJob || '',
//         cusOffice: customer.cusOffice || '',
//         cusAddress: customer.cusAddress || '',
//       });
//     } catch (error) {
//       console.error('Error fetching customer details:', error);
//     }
//   };

//   const handleCustomerSelect = (customer) => {
//     setCustomerName(customer.cusName);
//     setFormData(prev => ({
//       ...prev,
//       cusId: customer.cusId,
//     }));
//     setCustomerSuggestions([]);
//     setShowCustomerSuggestions(false);
//     fetchCustomerDetails(customer.cusName);
//   };

//   const handleProductSelect = (product) => {
//     setFormData(prev => ({
//       ...prev,
//       productCode: product.productName,
//       warranty: product.productWarranty,
//       description: product.productDescription,
//     }));
//     setProductSuggestions([]);
//     setShowProductSuggestions(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'customerName') {
//       setCustomerName(value);
//       if (value.length > 2) {
//         fetchCustomerSuggestions(value);
//       }
//       return;
//     }

//     const updatedData = { ...formData, [name]: value };

//     // Calculate derived values
//     const unitCost = parseFloat(updatedData.unitCost) || 0;
//     const ourMarginPercentage = parseFloat(updatedData.ourMarginPercentage) || 0;
//     const otherMarginPercentage = parseFloat(updatedData.otherMarginPercentage) || 0;
//     const qty = parseInt(updatedData.qty) || 1;
//     const discountPercentage = parseFloat(updatedData.discountPercentage) || 0;

//     updatedData.ourMarginValue = (unitCost * ourMarginPercentage) / 100;
//     updatedData.otherMarginValue = (unitCost * otherMarginPercentage) / 100;
//     updatedData.pricePlusMargin = updatedData.ourMarginValue + updatedData.otherMarginValue;
//     updatedData.sellingRate = updatedData.pricePlusMargin / 0.9;
//     updatedData.sellingRateRounded = Math.ceil(updatedData.sellingRate / 10) * 10;
//     updatedData.unitPrice = updatedData.sellingRateRounded;
//     updatedData.discountValue = (updatedData.sellingRateRounded * discountPercentage) / 100;
//     updatedData.discountedPrice = updatedData.sellingRateRounded - updatedData.discountValue;
//     updatedData.amount = updatedData.discountedPrice * qty;
//     updatedData.profit = (updatedData.ourMarginValue + parseFloat(updatedData.otherMarginPercentage)) * qty;

//     setFormData(updatedData);
//   };

//   const handleAddEntry = () => {
//     if (formData.unitCost > 0 && formData.qty > 0) {
//       setEntries([...entries, { ...formData, customerName, needImage: false }]);
//       // Reset form
//       setFormData({
//         descriptionCustomer: '',
//         productCode: '',
//         description: '',
//         warranty: '',
//         supplier: '',
//         unitCost: 0,
//         ourMarginPercentage: 0,
//         ourMarginValue: 0,
//         otherMarginPercentage: 0,
//         otherMarginValue: 0,
//         pricePlusMargin: 0,
//         sellingRate: 0,
//         sellingRateRounded: 0,
//         uom: '',
//         qty: 1,
//         unitPrice: 0,
//         discountPercentage: 0,
//         discountValue: 0,
//         discountedPrice: 0,
//         amount: 0,
//         profit: 0,
//       });
//       setCustomerName('');
//       setCustomerDetails({
//         cusJob: '',
//         cusOffice: '',
//         cusAddress: '',
//       });
//     } else {
//       alert('Please fill in all required fields correctly.');
//     }
//   };

//   const handleDelete = (index) => {
//     setEntries(entries.filter((_, i) => i !== index));
//   };

//   const calculateTotals = () => {
//     return entries.reduce((acc, entry) => ({
//       totalAmount: acc.totalAmount + parseFloat(entry.amount),
//       totalProfit: acc.totalProfit + parseFloat(entry.profit)
//     }), { totalAmount: 0, totalProfit: 0 });
//   };

//   const handleSaveToDatabase = async () => {
//     if (entries.length === 0) {
//       alert('Please add at least one entry');
//       return;
//     }

//     setIsSaving(true);
//     const totals = calculateTotals();

//     try {
//       const response = await axios.post(`${config.BASE_URL}/costing`, {
//         headerData: {
//           cusId: entries[0].cusId,
//           totalAmount: totals.totalAmount,
//           totalProfit: totals.totalProfit,
//           status: 'draft',
//         },
//         detailsData: entries.map(entry => ({
//           ...entry,
//           needImage: entry.needImage || false,
//         })),
//       });

//       alert('Costing data saved successfully');
//       setEntries([]);
//     } catch (error) {
//       console.error('Error saving costing data:', error);
//       alert('Error saving costing data');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="container-fluid mt-4">
//       <div className="card mb-4">
//         <div className="card-body">
//           <h5 className="card-title mb-3">Add New Entry</h5>
//           <div className="row g-3">
//             {/* Customer Information */}
//             <div className="col-md-3">
//               <label className="form-label">Customer Name</label>
//               <div className="position-relative">
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={customerName}
//                   onChange={(e) => handleInputChange({ target: { name: 'customerName', value: e.target.value }})}
//                 />
//                 {showCustomerSuggestions && customerSuggestions.length > 0 && (
//                   <ul className="list-group position-absolute w-100 z-50">
//                     {customerSuggestions.map((customer) => (
//                       <li
//                         key={customer.cusId}
//                         className="list-group-item list-group-item-action"
//                         onClick={() => handleCustomerSelect(customer)}
//                       >
//                         {customer.cusName}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Customer Job</label>
//               <input
//                 type="text"
//                 className="form-control bg-light"
//                 value={customerDetails.cusJob}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Customer Office</label>
//               <input
//                 type="text"
//                 className="form-control bg-light"
//                 value={customerDetails.cusOffice}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Customer Address</label>
//               <input
//                 type="text"
//                 className="form-control bg-light"
//                 value={customerDetails.cusAddress}
//                 readOnly
//               />
//             </div>

//             {/* Product Information */}
//             <div className="col-md-4">
//               <label className="form-label">Product Code</label>
//               <div className="position-relative">
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="productCode"
//                   value={formData.productCode}
//                   onChange={(e) => {
//                     handleInputChange(e);
//                     if (e.target.value.length > 2) {
//                       fetchProductSuggestions(e.target.value);
//                     }
//                   }}
//                 />
//                 {showProductSuggestions && productSuggestions.length > 0 && (
//                   <ul className="list-group position-absolute w-100 z-50">
//                     {productSuggestions.map((product) => (
//                       <li
//                         key={product.productId}
//                         className="list-group-item list-group-item-action"
//                         onClick={() => handleProductSelect(product)}
//                       >
//                         {product.productName}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>

//             <div className="col-md-4">
//               <label className="form-label">Description</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="col-md-4">
//               <label className="form-label">Warranty</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="warranty"
//                 value={formData.warranty}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Cost Information */}
//             <div className="col-md-3">
//               <label className="form-label">Unit Cost</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="unitCost"
//                 value={formData.unitCost}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Our Margin %</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="ourMarginPercentage"
//                 value={formData.ourMarginPercentage}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Other Margin %</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="otherMarginPercentage"
//                 value={formData.otherMarginPercentage}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Quantity</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="qty"
//                 value={formData.qty}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Calculated Values */}
//             <div className="col-md-3">
//               <label className="form-label">Our Margin Value</label>
//               <input
//                 type="number"
//                 className="form-control bg-light"
//                 value={formData.ourMarginValue}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Other Margin Value</label>
//               <input
//                 type="number"
//                 className="form-control bg-light"
//                 value={formData.otherMarginValue}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Price + Margin</label>
//               <input
//                 type="number"
//                 className="form-control bg-light"
//                 value={formData.pricePlusMargin}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Selling Rate</label>
//               <input
//                 type="number"
//                 className="form-control bg-light"
//                 value={formData.sellingRate}
//                 readOnly
//               />
//             </div>

//             {/* Action Buttons */}
//             <div className="col-12">
//               <button
//                 type="button"
//                 className="btn btn-primary me-2"
//                 onClick={handleAddEntry}
//               >
//                 Add Entry
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-success"
//                 onClick={handleSaveToDatabase}
//                 disabled={isSaving || entries.length === 0}
//               >
//                 {isSaving ? 'Saving...' : 'Save to Database'}


//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Entries Table */}
//       <div className="table-responsive">
//         <table className="table table-bordered table-striped">
//           <thead>
//             <tr>
//               <th>Customer Name</th>
//               <th className="table-warning">Customer Product Description</th>
//               <th>Product Code</th>
//               <th>Need Image</th>
//               <th>Description</th>
//               <th>Warranty</th>
//               <th className="table-warning">Supplier</th>
//               <th className="table-warning">Unit Cost</th>
//               <th className="table-warning">Our Margin %</th>
//               <th className="table-warning">Our Margin Value</th>
//               <th className="table-warning">Other Margin %</th>
//               <th className="table-warning">Other Margin Value</th>
//               <th className="table-warning">Price + Margin</th>
//               <th className="table-warning">Selling Rate Before Discount</th>
//               <th className="table-warning">Selling Rate (Rounded to Nearest 10)</th>
//               <th>UOM</th>
//               <th>Qty</th>
//               <th>Unit Price</th>
//               <th>Discount %</th>
//               <th>Discount Value</th>
//               <th>Discounted Price</th>
//               <th>Amount</th>
//               <th className="table-warning">Profit</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {entries.map((entry, index) => (
//               <tr key={index}>
//                 <td>{entry.customerName}</td>
//                 <td>{entry.descriptionCustomer}</td>
//                 <td>{entry.productCode}</td>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={entry.needImage || false}
//                     onChange={(e) => {
//                       const updatedEntries = [...entries];
//                       updatedEntries[index].needImage = e.target.checked;
//                       setEntries(updatedEntries);
//                     }}
//                   />
//                 </td>
//                 <td>{entry.description}</td>
//                 <td>{entry.warranty}</td>
//                 <td>{entry.supplier}</td>
//                 <td>{entry.unitCost}</td>
//                 <td>{entry.ourMarginPercentage}</td>
//                 <td>{entry.ourMarginValue.toFixed(2)}</td>
//                 <td>{entry.otherMarginPercentage}</td>
//                 <td>{entry.otherMarginValue.toFixed(2)}</td>
//                 <td>{entry.pricePlusMargin.toFixed(2)}</td>
//                 <td>{entry.sellingRate.toFixed(2)}</td>
//                 <td>{entry.sellingRateRounded}</td>
//                 <td>{entry.uom}</td>
//                 <td>{entry.qty}</td>
//                 <td>{entry.unitPrice}</td>
//                 <td>{entry.discountPercentage}</td>
//                 <td>{entry.discountValue.toFixed(2)}</td>
//                 <td>{entry.discountedPrice.toFixed(2)}</td>
//                 <td>{entry.amount.toFixed(2)}</td>
//                 <td>{entry.profit.toFixed(2)}</td>
//                 <td>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(index)}
//                   >
//                     <Trash size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot>
//             <tr>
//               <td colSpan="21" className="text-end fw-bold">Totals:</td>
//               <td className="fw-bold">
//                 {calculateTotals().totalAmount.toFixed(2)}
//               </td>
//               <td className="fw-bold">
//                 {calculateTotals().totalProfit.toFixed(2)}
//               </td>
//               <td></td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CostingTable;




// -----------------------------------------------------------------------------------------------------------------



// import React, { useState, useEffect } from 'react';
// import { Trash } from 'lucide-react';
// import axios from 'axios';
// import config from '../../config';

// const CostingTable = () => {
//   const [entries, setEntries] = useState([]);
//   const [formData, setFormData] = useState({
//     cusId: '',
//     descriptionCustomer: '',
//     productCode: '',
//     description: '',
//     warranty: '',
//     supplier: '',
//     unitCost: 0,
//     ourMarginPercentage: 0,
//     ourMarginValue: 0,
//     otherMarginPercentage: 0,
//     otherMarginValue: 0,
//     pricePlusMargin: 0,
//     sellingRate: 0,
//     sellingRateRounded: 0,
//     uom: '',
//     qty: 1,
//     unitPrice: 0,
//     discountPercentage: 0,
//     discountValue: 0,
//     discountedPrice: 0,
//     amount: 0,
//     profit: 0,
//   });

//   const [customerName, setCustomerName] = useState('');
//   const [customerSuggestions, setCustomerSuggestions] = useState([]);
//   const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
//   const [productSuggestions, setProductSuggestions] = useState([]);
//   const [showProductSuggestions, setShowProductSuggestions] = useState(false);
//   const [customerDetails, setCustomerDetails] = useState({
//     cusJob: '',
//     cusOffice: '',
//     cusAddress: '',
//   });
//   const [isSaving, setIsSaving] = useState(false);

//   const fetchCustomerSuggestions = async (name) => {
//     try {
//       const response = await axios.get(`${config.BASE_URL}/customers/suggestion`, {
//         params: { name },
//       });
//       setCustomerSuggestions(response.data);
//       setShowCustomerSuggestions(true);
//     } catch (error) {
//       console.error('Error fetching customer suggestions:', error);
//       setCustomerSuggestions([]);
//       setShowCustomerSuggestions(false);
//     }
//   };

//   const fetchCustomerDetails = async (cusName) => {
//     try {
//       const response = await axios.get(`${config.BASE_URL}/customer/cusName/${cusName}`);
//       const customer = response.data;
//       setCustomerDetails({
//         cusJob: customer.cusJob || '',
//         cusOffice: customer.cusOffice || '',
//         cusAddress: customer.cusAddress || '',
//       });
//     } catch (error) {
//       console.error('Error fetching customer details:', error);
//     }
//   };

//   const fetchProductSuggestions = async (query) => {
//     try {
//       const response = await axios.get(`${config.BASE_URL}/products/suggestions`, {
//         params: { query },
//       });
//       setProductSuggestions(response.data);
//       setShowProductSuggestions(true);
//     } catch (error) {
//       console.error('Error fetching product suggestions:', error);
//       setProductSuggestions([]);
//       setShowProductSuggestions(false);
//     }
//   };

//   const handleCustomerSelect = (customer) => {
//     setCustomerName(customer.cusName);
//     setFormData(prev => ({
//       ...prev,
//       cusId: customer.cusId,
//     }));
//     setCustomerSuggestions([]);
//     setShowCustomerSuggestions(false);
//     fetchCustomerDetails(customer.cusName);
//   };

//   const handleProductSelect = (product) => {
//     setFormData(prev => ({
//       ...prev,
//       productCode: product.productName,
//       warranty: product.productWarranty,
//       description: product.productDescription,
//     }));
//     setProductSuggestions([]);
//     setShowProductSuggestions(false);
//   };

//   const calculateDerivedValues = (data) => {
//     const unitCost = parseFloat(data.unitCost) || 0;
//     const ourMarginPercentage = parseFloat(data.ourMarginPercentage) || 0;
//     const otherMarginPercentage = parseFloat(data.otherMarginPercentage) || 0;
//     const qty = parseInt(data.qty) || 1;
//     const discountPercentage = parseFloat(data.discountPercentage) || 0;

//     const ourMarginValue = (unitCost * ourMarginPercentage) / 100;
//     const otherMarginValue = (unitCost * otherMarginPercentage) / 100;
//     const pricePlusMargin = unitCost + ourMarginValue + otherMarginValue;
//     const sellingRate = pricePlusMargin / 0.9;
//     const sellingRateRounded = Math.ceil(sellingRate / 10) * 10;
//     const discountValue = (sellingRateRounded * discountPercentage) / 100;
//     const discountedPrice = sellingRateRounded - discountValue;
//     const amount = discountedPrice * qty;
//     const profit = (ourMarginValue + otherMarginValue) * qty;

//     return {
//       ...data,
//       ourMarginValue,
//       otherMarginValue,
//       pricePlusMargin,
//       sellingRate,
//       sellingRateRounded,
//       unitPrice: sellingRateRounded,
//       discountValue,
//       discountedPrice,
//       amount,
//       profit,
//     };
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'customerName') {
//       setCustomerName(value);
//       if (value.length > 2) {
//         fetchCustomerSuggestions(value);
//       }
//       return;
//     }

//     const updatedData = calculateDerivedValues({
//       ...formData,
//       [name]: value,
//     });

//     setFormData(updatedData);
//   };

//   const handleAddEntry = () => {
//     if (formData.unitCost > 0 && formData.qty > 0) {
//       setEntries([...entries, { 
//         ...formData, 
//         customerName,
//         needImage: false,
//         cusJob: customerDetails.cusJob,
//         cusOffice: customerDetails.cusOffice,
//         cusAddress: customerDetails.cusAddress,
//       }]);

//       // Reset form except customer information
//       setFormData({
//         ...formData,
//         descriptionCustomer: '',
//         productCode: '',
//         description: '',
//         warranty: '',
//         supplier: '',
//         unitCost: 0,
//         ourMarginPercentage: 0,
//         ourMarginValue: 0,
//         otherMarginPercentage: 0,
//         otherMarginValue: 0,
//         pricePlusMargin: 0,
//         sellingRate: 0,
//         sellingRateRounded: 0,
//         uom: '',
//         qty: 1,
//         unitPrice: 0,
//         discountPercentage: 0,
//         discountValue: 0,
//         discountedPrice: 0,
//         amount: 0,
//         profit: 0,
//       });
//     } else {
//       alert('Please fill in all required fields correctly.');
//     }
//   };

//   const handleDelete = (index) => {
//     setEntries(entries.filter((_, i) => i !== index));
//   };

//   const calculateTotals = () => {
//     return entries.reduce((acc, entry) => ({
//       totalAmount: acc.totalAmount + parseFloat(entry.amount),
//       totalProfit: acc.totalProfit + parseFloat(entry.profit)
//     }), { totalAmount: 0, totalProfit: 0 });
//   };

//   const handleSaveToDatabase = async () => {
//     if (entries.length === 0) {
//       alert('Please add at least one entry');
//       return;
//     }

//     setIsSaving(true);
//     const totals = calculateTotals();

//     try {
//       const response = await axios.post(`${config.BASE_URL}/costing`, {
//         headerData: {
//           cusId: entries[0].cusId,
//           totalAmount: totals.totalAmount,
//           totalProfit: totals.totalProfit,
//           status: 'draft',
//         },
//         detailsData: entries.map(entry => ({
//           ...entry,
//           needImage: entry.needImage || false,
//         })),
//       });

//       alert('Costing data saved successfully');
//       setEntries([]);
//     } catch (error) {
//       console.error('Error saving costing data:', error);
//       alert('Error saving costing data');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="container-fluid mt-4">
//       <div className="card mb-4">
//         <div className="card-header">
//           <h5 className="card-title mb-0">Add New Entry</h5>
//         </div>
//         <div className="card-body">
//           <div className="row g-3">
//             {/* Customer Information */}
//             <div className="col-md-3 position-relative">
//               <label className="form-label">Customer Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={customerName}
//                 onChange={(e) => handleInputChange({ target: { name: 'customerName', value: e.target.value }})}
//               />
//               {showCustomerSuggestions && customerSuggestions.length > 0 && (
//                 <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
//                   {customerSuggestions.map((customer) => (
//                     <li
//                       key={customer.cusId}
//                       className="list-group-item list-group-item-action"
//                       onClick={() => handleCustomerSelect(customer)}
//                       style={{ cursor: 'pointer' }}
//                     >
//                       {customer.cusName}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Job Position</label>
//               <input
//                 type="text"
//                 className="form-control bg-light"
//                 value={customerDetails.cusJob}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Company</label>
//               <input
//                 type="text"
//                 className="form-control bg-light"
//                 value={customerDetails.cusOffice}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Address</label>
//               <input
//                 type="text"
//                 className="form-control bg-light"
//                 value={customerDetails.cusAddress}
//                 readOnly
//               />
//             </div>

//             {/* Product Information */}
//             <div className="col-md-3 position-relative">
//               <label className="form-label">Product Code</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="productCode"
//                 value={formData.productCode}
//                 onChange={(e) => {
//                   handleInputChange(e);
//                   if (e.target.value.length > 2) {
//                     fetchProductSuggestions(e.target.value);
//                   }
//                 }}
//               />
//               {showProductSuggestions && productSuggestions.length > 0 && (
//                 <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
//                   {productSuggestions.map((product) => (
//                     <li
//                       key={product.productId}
//                       className="list-group-item list-group-item-action"
//                       onClick={() => handleProductSelect(product)}
//                       style={{ cursor: 'pointer' }}
//                     >
//                       {product.productName}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Customer Description</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="descriptionCustomer"
//                 value={formData.descriptionCustomer}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Description</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Warranty</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="warranty"
//                 value={formData.warranty}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Cost Information */}
//             <div className="col-md-3">
//               <label className="form-label">Unit Cost</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="unitCost"
//                 value={formData.unitCost}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Our Margin %</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="ourMarginPercentage"
//                 value={formData.ourMarginPercentage}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Other Margin %</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="otherMarginPercentage"
//                 value={formData.otherMarginPercentage}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Quantity</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="qty"
//                 value={formData.qty}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Calculated Values */}
//             <div className="col-md-3">
//               <label className="form-label">Our Margin Value</label>
//               <input
//                 type="number"
//                 className="form-control bg-light"
//                 value={formData.ourMarginValue.toFixed(2)}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Other Margin Value</label>
//               <input
//                 type="number"
//                 className="form-control bg-light"
//                 value={formData.otherMarginValue.toFixed(2)}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Price + Margin</label>
//               <input
//                 type="number"
//                 className="form-control bg-light"
//                 value={formData.pricePlusMargin.toFixed(2)}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Selling Rate</label>
//               <input
//                 type="number"
//                 className="form-control bg-light"
//                 value={formData.sellingRate.toFixed(2)}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Selling Rate (Rounded)</label>
//               <input
//                 type="number"
//                 className="form-control bg-light"
//                 value={formData.sellingRateRounded}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">UOM</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="uom"
//                 value={formData.uom}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Discount %</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="discountPercentage"
//                 value={formData.discountPercentage}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">Discount Value</label>
//               <input
//                 type="number"
//                 className="form-control bg-light"
//                 value={formData.discountValue.toFixed(2)}
//                 readOnly
//               />
//             </div>

//             {/* Add Entry Button */}
//             <div className="col-12">
//               <button
//                 type="button"
//                 className="btn btn-primary"
//                 onClick={handleAddEntry}
//               >
//                 Add Entry
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Entries Table */}
//       <div className="table-responsive">
//         <table className="table table-bordered table-striped">
//           <thead>
//             <tr>
//               <th>Customer Name</th>
//               <th>Customer Description</th>
//               <th>Product Code</th>
//               <th>Need Image</th>
//               <th>Description</th>
//               <th>Warranty</th>
//               <th>Supplier</th>
//               <th>Unit Cost</th>
//               <th>Our Margin %</th>
//               <th>Our Margin Value</th>
//               <th>Other Margin %</th>
//               <th>Other Margin Value</th>
//               <th>Price + Margin</th>
//               <th>Selling Rate</th>
//               <th>Selling Rate (Rounded)</th>
//               <th>UOM</th>
//               <th>Qty</th>
//               <th>Unit Price</th>
//               <th>Discount %</th>
//               <th>Discount Value</th>
//               <th>Discounted Price</th>
//               <th>Amount</th>
//               <th>Profit</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {entries.map((entry, index) => (
//               <tr key={index}>
//                 <td>{entry.customerName}</td>
//                 <td>{entry.descriptionCustomer}</td>
//                 <td>{entry.productCode}</td>
//                 <td className="text-center">
//                   <input
//                     type="checkbox"
//                     checked={entry.needImage || false}
//                     onChange={(e) => {
//                       const updatedEntries = [...entries];
//                       updatedEntries[index].needImage = e.target.checked;
//                       setEntries(updatedEntries);
//                     }}
//                   />
//                 </td>
//                 <td>{entry.description}</td>
//                 <td>{entry.warranty}</td>
//                 <td>{entry.supplier}</td>
//                 <td>{entry.unitCost}</td>
//                 <td>{entry.ourMarginPercentage}</td>
//                 <td>{entry.ourMarginValue.toFixed(2)}</td>
//                 <td>{entry.otherMarginPercentage}</td>
//                 <td>{entry.otherMarginValue.toFixed(2)}</td>
//                 <td>{entry.pricePlusMargin.toFixed(2)}</td>
//                 <td>{entry.sellingRate.toFixed(2)}</td>
//                 <td>{entry.sellingRateRounded}</td>
//                 <td>{entry.uom}</td>
//                 <td>{entry.qty}</td>
//                 <td>{entry.unitPrice}</td>
//                 <td>{entry.discountPercentage}</td>
//                 <td>{entry.discountValue.toFixed(2)}</td>
//                 <td>{entry.discountedPrice.toFixed(2)}</td>
//                 <td>{entry.amount.toFixed(2)}</td>
//                 <td>{entry.profit.toFixed(2)}</td>
//                 <td>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(index)}
//                   >
//                     <Trash size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot>
//             <tr className="table-secondary">
//               <td colSpan="21" className="text-end fw-bold">Totals:</td>
//               <td className="fw-bold">{calculateTotals().totalAmount.toFixed(2)}</td>
//               <td className="fw-bold">{calculateTotals().totalProfit.toFixed(2)}</td>
//               <td></td>
//             </tr>
//           </tfoot>
//         </table>

//         {/* Save to Database Button */}
//         <div className="mt-3 text-end">
//           <button
//             type="button"
//             className="btn btn-success"
//             onClick={handleSaveToDatabase}
//             disabled={isSaving || entries.length === 0}
//           >
//             {isSaving ? 'Saving...' : 'Save to Database'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CostingTable;



//--------------------------------------------------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import { Trash } from 'lucide-react';
// import axios from 'axios';
// import config from '../../config';

// const CostingTable = () => {
//     const [entries, setEntries] = useState([]);
//     const [formData, setFormData] = useState({
//         descriptionCustomer: '',
//         productCode: '',
//         description: '',
//         warranty: '',
//         supplier: '',
//         unitCost: 0,
//         ourMarginPercentage: 0,
//         ourMarginValue: 0,
//         otherMarginPercentage: 0,
//         otherMarginValue: 0,
//         pricePlusMargin: 0,
//         sellingRate: 0,
//         sellingRateRounded: 0,
//         uom: '',
//         qty: 1,
//         unitPrice: 0,
//         discountPercentage: 0,
//         discountValue: 0,
//         discountedPrice: 0,
//         amount: 0,
//         profit: 0,
//     });

//     const [customerName, setCustomerName] = useState('');
//     const [customerSuggestions, setCustomerSuggestions] = useState([]);
//     const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
//     const [productSuggestions, setProductSuggestions] = useState([]);
//     const [showProductSuggestions, setShowProductSuggestions] = useState(false);
//     const [customerDetails, setCustomerDetails] = useState({
//         cusJob: '',
//         cusOffice: '',
//         cusAddress: '',
//     });
//     const [isSaving, setIsSaving] = useState(false);

//     // Fetch customer suggestions
//     const fetchCustomerSuggestions = async (name) => {
//         try {
//             const response = await axios.get(`${config.BASE_URL}/customers/suggestion`, {
//                 params: { name },
//             });
//             setCustomerSuggestions(response.data);
//             setShowCustomerSuggestions(true);
//         } catch (error) {
//             console.error('Error fetching customer suggestions:', error);
//             setCustomerSuggestions([]);
//             setShowCustomerSuggestions(false);
//         }
//     };

//     // Fetch product suggestions
//     const fetchProductSuggestions = async (query) => {
//         try {
//             const response = await axios.get(`${config.BASE_URL}/products/suggestions`, {
//                 params: { query },
//             });
//             setProductSuggestions(response.data);
//             setShowProductSuggestions(true);
//         } catch (error) {
//             console.error('Error fetching product suggestions:', error);
//             setProductSuggestions([]);
//             setShowProductSuggestions(false);
//         }
//     };

//     // Fetch customer details
//     const fetchCustomerDetails = async (cusName) => {
//         try {
//             const response = await axios.get(`${config.BASE_URL}/customer/cusName/${cusName}`);
//             const customer = response.data;
//             setCustomerDetails({
//                 cusJob: customer.cusJob || '',
//                 cusOffice: customer.cusOffice || '',
//                 cusAddress: customer.cusAddress || '',
//             });
//         } catch (error) {
//             console.error('Error fetching customer details:', error);
//         }
//     };

//     // Handle customer selection
//     const handleCustomerSelect = (customer) => {
//         setCustomerName(customer.cusName);
//         setFormData((prev) => ({
//             ...prev,
//             cusId: customer.cusId,
//         }));
//         setCustomerSuggestions([]);
//         setShowCustomerSuggestions(false);
//         fetchCustomerDetails(customer.cusName);
//     };

//     // Handle product selection
//     const handleProductSelect = (product) => {
//         setFormData((prev) => ({
//             ...prev,
//             productCode: product.productName,
//             warranty: product.productWarranty,
//             description: product.productDescription,
//         }));
//         setProductSuggestions([]);
//         setShowProductSuggestions(false);
//     };

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'customerName') {
//             setCustomerName(value);
//             if (value.length > 2) {
//                 fetchCustomerSuggestions(value);
//             }
//             return;
//         }

//         const updatedData = { ...formData, [name]: value };

//         // Calculate derived values
//         const unitCost = parseFloat(updatedData.unitCost) || 0;
//         const ourMarginPercentage = parseFloat(updatedData.ourMarginPercentage) || 0;
//         const otherMarginPercentage = parseFloat(updatedData.otherMarginPercentage) || 0;
//         const qty = parseInt(updatedData.qty) || 1;
//         const discountPercentage = parseFloat(updatedData.discountPercentage) || 0;

//         updatedData.ourMarginValue = (unitCost * ourMarginPercentage) / 100;
//         updatedData.otherMarginValue = (unitCost * otherMarginPercentage) / 100;
//         updatedData.pricePlusMargin = updatedData.ourMarginValue + updatedData.otherMarginValue;
//         updatedData.sellingRate = updatedData.pricePlusMargin / 0.9;
//         updatedData.sellingRateRounded = Math.ceil(updatedData.sellingRate / 10) * 10;
//         updatedData.unitPrice = updatedData.sellingRateRounded;
//         updatedData.discountValue = (updatedData.sellingRateRounded * discountPercentage) / 100;
//         updatedData.discountedPrice = updatedData.sellingRateRounded - updatedData.discountValue;
//         updatedData.amount = updatedData.discountedPrice * qty;
//         updatedData.profit = (updatedData.ourMarginValue + parseFloat(updatedData.otherMarginPercentage)) * qty;

//         setFormData(updatedData);
//     };

//     // Handle adding an entry
//     const handleAddEntry = () => {
//         if (formData.unitCost > 0 && formData.qty > 0) {
//             setEntries([...entries, { ...formData, customerName, needImage: false }]);

//             // Reset form fields except customerName
//             setFormData({
//                 descriptionCustomer: '',
//                 productCode: '',
//                 description: '',
//                 warranty: '',
//                 supplier: '',
//                 unitCost: 0,
//                 ourMarginPercentage: 0,
//                 ourMarginValue: 0,
//                 otherMarginPercentage: 0,
//                 otherMarginValue: 0,
//                 pricePlusMargin: 0,
//                 sellingRate: 0,
//                 sellingRateRounded: 0,
//                 uom: '',
//                 qty: 1,
//                 unitPrice: 0,
//                 discountPercentage: 0,
//                 discountValue: 0,
//                 discountedPrice: 0,
//                 amount: 0,
//                 profit: 0,
//             });
//         } else {
//             alert('Please fill in all required fields correctly.');
//         }
//     };

//     // Handle deleting an entry
//     const handleDelete = (index) => {
//         setEntries(entries.filter((_, i) => i !== index));
//     };

//     // Calculate totals
//     const calculateTotals = () => {
//         return entries.reduce(
//             (acc, entry) => ({
//                 totalAmount: acc.totalAmount + parseFloat(entry.amount),
//                 totalProfit: acc.totalProfit + parseFloat(entry.profit),
//             }),
//             { totalAmount: 0, totalProfit: 0 }
//         );
//     };

//     // Handle saving to the database
//     const handleSaveToDatabase = async () => {
//         if (entries.length === 0) {
//             alert('Please add at least one entry');
//             return;
//         }

//         setIsSaving(true);
//         const totals = calculateTotals();

//         try {
//             const response = await axios.post(`${config.BASE_URL}/costing`, {
//                 headerData: {
//                     cusId: entries[0].cusId,
//                     totalAmount: totals.totalAmount,
//                     totalProfit: totals.totalProfit,
//                     status: 'draft',
//                 },
//                 detailsData: entries.map((entry) => ({
//                     ...entry,
//                     needImage: entry.needImage || false,
//                 })),
//             });

//             alert('Costing data saved successfully');
//             setEntries([]);
//         } catch (error) {
//             console.error('Error saving costing data:', error);
//             alert('Error saving costing data');
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     return (
//         <div className="container-fluid mt-2">
//             {/* Add Entry Form */}
//             <div className="card mb-2">
//                 <div className="card-body">
//                     <h2 className="card-title mb-3">Quotation</h2>
//                     <div className="row g-3">
//                         {/* Customer Information */}
//                         <div className="col-md-3">
//                             <label className="form-label">Customer Name</label>
//                             <div className="position-relative">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     value={customerName}
//                                     onChange={(e) =>
//                                         handleInputChange({ target: { name: 'customerName', value: e.target.value } })
//                                     }
//                                 />
//                                 {showCustomerSuggestions && customerSuggestions.length > 0 && (
//                                     <ul className="list-group position-absolute w-100 z-50">
//                                         {customerSuggestions.map((customer) => (
//                                             <li
//                                                 key={customer.cusId}
//                                                 className="list-group-item list-group-item-action"
//                                                 onClick={() => handleCustomerSelect(customer)}
//                                             >
//                                                 {customer.cusName}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Customer Job</label>
//                             <input
//                                 type="text"
//                                 className="form-control bg-light"
//                                 value={customerDetails.cusJob}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Customer Office</label>
//                             <input
//                                 type="text"
//                                 className="form-control bg-light"
//                                 value={customerDetails.cusOffice}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Customer Address</label>
//                             <input
//                                 type="text"
//                                 className="form-control bg-light"
//                                 value={customerDetails.cusAddress}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Customer Product Description</label>
//                             <input
//                                 type="text"
//                                 name="descriptionCustomer"
//                                 id="descriptionCustomer"
//                                 className="form-control "
//                                 value={formData.descriptionCustomer || ''}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         {/* Product Information */}
//                         <div className="col-md-3">
//                             <label className="form-label">Product Name</label>
//                             <div className="position-relative">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="productCode"
//                                     value={formData.productCode}
//                                     onChange={(e) => {
//                                         handleInputChange(e);
//                                         if (e.target.value.length > 2) {
//                                             fetchProductSuggestions(e.target.value);
//                                         }
//                                     }}
//                                 />
//                                 {showProductSuggestions && productSuggestions.length > 0 && (
//                                     <ul className="list-group position-absolute w-100 z-50">
//                                         {productSuggestions.map((product) => (
//                                             <li
//                                                 key={product.productId}
//                                                 className="list-group-item list-group-item-action"
//                                                 onClick={() => handleProductSelect(product)}
//                                             >
//                                                 {product.productName}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Description</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="description"
//                                 value={formData.description}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Warranty</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="warranty"
//                                 value={formData.warranty}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         {/* Cost Information */}

//                         <div className="col-md-3">
//                             <label className="form-label">Supplier</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="supplier"
//                                 value={formData.supplier}
//                                 onChange={handleInputChange}
//                             />
//                         </div>


//                         <div className="col-md-3">
//                             <label className="form-label">Unit Cost</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 name="unitCost"
//                                 value={formData.unitCost}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Our Margin %</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 name="ourMarginPercentage"
//                                 value={formData.ourMarginPercentage}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Our Margin Value</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.ourMarginValue}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Other Margin %</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 name="otherMarginPercentage"
//                                 value={formData.otherMarginPercentage}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Other Margin Value</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.otherMarginValue}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Price + Margin</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.pricePlusMargin}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Selling Rate Before Discount</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.sellingRate.toFixed(2)}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Selling Rate (Rounded to Nearest 10)</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.sellingRateRounded}
//                                 readOnly
//                             />
//                         </div>


//                         {/* <div className="col-md-3">
//                             <label className="form-label">Selling Rate Before Discount</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.sellingRate}
//                                 readOnly
//                             />
//                         </div> */}

//                         <div className="col-md-3">
//                             <label className="form-label">Uom</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="uom"
//                                 value={formData.uom}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Quantity</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 name="qty"
//                                 value={formData.qty}
//                                 onChange={handleInputChange}
//                             />
//                         </div>


//                         <div className="col-md-3">
//                             <label className="form-label">Unit Price</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.unitPrice}
//                                 readOnly

//                             />
//                         </div>


// {/*  
//                         <div className="col-md-3">
//                             <label className="form-label">UOM</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="uom"
//                                 value={formData.uom}
//                                 onChange={handleInputChange}
//                             />
//                         </div> */}

//                         <div className="col-md-3">
//                             <label className="form-label">Discount %</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 name="discountPercentage"
//                                 value={formData.discountPercentage}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Discount Value</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.discountValue.toFixed(2)}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Discounted Price</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.discountedPrice.toFixed(2)}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Amount</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.amount.toFixed(2)}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Profit</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.profit.toFixed(2)}
//                                 readOnly
//                             />
//                         </div>


//                         {/* Action Buttons */}
//                         <div className="col-12">
//                             <button
//                                 type="button"
//                                 className="btn btn-primary me-2"
//                                 onClick={handleAddEntry}
//                             >
//                                 Add Entry
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Entries Table */}
//             <div className="table-responsive">
//                 <table className="table table-bordered table-striped">
//                     <thead>
//                         <tr>
//                             <th>Customer Name</th>
//                             <th className="table-warning">Customer Product Description</th>
//                             <th>Product Code</th>
//                             <th>Need Image</th>
//                             <th>Description</th>
//                             <th>Warranty</th>
//                             <th className="table-warning">Supplier</th>
//                             <th className="table-warning">Unit Cost</th>
//                             <th className="table-warning">Our Margin %</th>
//                             <th className="table-warning">Our Margin Value</th>
//                             <th className="table-warning">Other Margin %</th>
//                             <th className="table-warning">Other Margin Value</th>
//                             <th className="table-warning">Price + Margin</th>
//                             <th className="table-warning">Selling Rate Before Discount</th>
//                             <th className="table-warning">Selling Rate (Rounded to Nearest 10)</th>
//                             <th>UOM</th>
//                             <th>Qty</th>
//                             <th>Unit Price</th>
//                             <th>Discount %</th>
//                             <th>Discount Value</th>
//                             <th>Discounted Price</th>
//                             <th>Amount</th>
//                             <th className="table-warning">Profit</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {entries.map((entry, index) => (
//                             <tr key={index}>
//                                 <td>{entry.customerName}</td>
//                                 <td>{entry.descriptionCustomer}</td>
//                                 <td>{entry.productCode}</td>
//                                 <td>
//                                     <input
//                                         type="checkbox"
//                                         checked={entry.needImage || false}
//                                         onChange={(e) => {
//                                             const updatedEntries = [...entries];
//                                             updatedEntries[index].needImage = e.target.checked;
//                                             setEntries(updatedEntries);
//                                         }}
//                                     />
//                                 </td>
//                                 <td>{entry.description}</td>
//                                 <td>{entry.warranty}</td>
//                                 <td>{entry.supplier}</td>
//                                 <td>{entry.unitCost}</td>
//                                 <td>{entry.ourMarginPercentage}</td>
//                                 <td>{entry.ourMarginValue.toFixed(2)}</td>
//                                 <td>{entry.otherMarginPercentage}</td>
//                                 <td>{entry.otherMarginValue.toFixed(2)}</td>
//                                 <td>{entry.pricePlusMargin.toFixed(2)}</td>
//                                 <td>{entry.sellingRate.toFixed(2)}</td>
//                                 <td>{entry.sellingRateRounded}</td>
//                                 <td>{entry.uom}</td>
//                                 <td>{entry.qty}</td>
//                                 <td>{entry.unitPrice}</td>
//                                 <td>{entry.discountPercentage}</td>
//                                 <td>{entry.discountValue.toFixed(2)}</td>
//                                 <td>{entry.discountedPrice.toFixed(2)}</td>
//                                 <td>{entry.amount.toFixed(2)}</td>
//                                 <td>{entry.profit.toFixed(2)}</td>
//                                 <td>
//                                     <button
//                                         className="btn btn-danger btn-sm"
//                                         onClick={() => handleDelete(index)}
//                                     >
//                                         <Trash size={16} />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                     <tfoot>
//                         <tr>
//                             <td colSpan="21" className="text-end fw-bold">
//                                 Totals:
//                             </td>
//                             <td className="fw-bold">{calculateTotals().totalAmount.toFixed(2)}</td>
//                             <td className="fw-bold">{calculateTotals().totalProfit.toFixed(2)}</td>
//                             <td></td>
//                         </tr>
//                     </tfoot>
//                 </table>


//                 <div className="mt-3 text-end mb-4">
//                     <button
//                         type="button"
//                         className="btn btn-success"
//                         onClick={handleSaveToDatabase}
//                         disabled={isSaving || entries.length === 0}
//                     >
//                         {isSaving ? 'Saving...' : 'Create Quotation'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CostingTable;



//--------------------------------------------------------------------------------------------------------------




// import React, { useState, useEffect } from 'react';
// import { Trash, Edit } from 'lucide-react';
// import axios from 'axios';
// import config from '../../config';

// const CostingTable = () => {
//     const [entries, setEntries] = useState([]);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingIndex, setEditingIndex] = useState(null);
//     const [formData, setFormData] = useState({
//         descriptionCustomer: '',
//         productCode: '',
//         description: '',
//         warranty: '',
//         supplier: '',
//         unitCost: 0,
//         ourMarginPercentage: 0,
//         ourMarginValue: 0,
//         otherMarginPercentage: 0,
//         otherMarginValue: 0,
//         pricePlusMargin: 0,
//         sellingRate: 0,
//         sellingRateRounded: 0,
//         uom: '',
//         qty: 1,
//         unitPrice: 0,
//         discountPercentage: 0,
//         discountValue: 0,
//         discountedPrice: 0,
//         amount: 0,
//         profit: 0,
//     });

//     const [customerName, setCustomerName] = useState('');
//     const [customerSuggestions, setCustomerSuggestions] = useState([]);
//     const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
//     const [productSuggestions, setProductSuggestions] = useState([]);
//     const [showProductSuggestions, setShowProductSuggestions] = useState(false);
//     const [customerDetails, setCustomerDetails] = useState({
//         cusJob: '',
//         cusOffice: '',
//         cusAddress: '',
//     });
//     const [isSaving, setIsSaving] = useState(false);
//     const fetchCustomerSuggestions = async (name) => {
//         try {
//             const response = await axios.get(`${config.BASE_URL}/customers/suggestion`, {
//                 params: { name },
//             });
//             setCustomerSuggestions(response.data);
//             setShowCustomerSuggestions(true);
//         } catch (error) {
//             console.error('Error fetching customer suggestions:', error);
//             setCustomerSuggestions([]);
//             setShowCustomerSuggestions(false);
//         }
//     };

//     const fetchProductSuggestions = async (query) => {
//         try {
//             const response = await axios.get(`${config.BASE_URL}/products/suggestions`, {
//                 params: { query },
//             });
//             setProductSuggestions(response.data);
//             setShowProductSuggestions(true);
//         } catch (error) {
//             console.error('Error fetching product suggestions:', error);
//             setProductSuggestions([]);
//             setShowProductSuggestions(false);
//         }
//     };
//     const fetchCustomerDetails = async (cusName) => {
//         try {
//             const response = await axios.get(`${config.BASE_URL}/customer/cusName/${cusName}`);
//             const customer = response.data;
//             setCustomerDetails({
//                 cusJob: customer.cusJob || '',
//                 cusOffice: customer.cusOffice || '',
//                 cusAddress: customer.cusAddress || '',
//             });
//         } catch (error) {
//             console.error('Error fetching customer details:', error);
//         }
//     };

//     const handleCustomerSelect = (customer) => {
//         setCustomerName(customer.cusName);
//         setFormData((prev) => ({
//             ...prev,
//             cusId: customer.cusId,
//         }));
//         setCustomerSuggestions([]);
//         setShowCustomerSuggestions(false);
//         fetchCustomerDetails(customer.cusName);
//     };

//     const handleProductSelect = (product) => {
//         setFormData((prev) => ({
//             ...prev,
//             productCode: product.productName,
//             warranty: product.productWarranty,
//             description: product.productDescription,
//         }));
//         setProductSuggestions([]);
//         setShowProductSuggestions(false);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         if (name === 'customerName') {
//             setCustomerName(value);
//             if (value.length > 2) {
//                 fetchCustomerSuggestions(value);
//             }
//             return;
//         }

//         const updatedData = { ...formData, [name]: value };

//         const unitCost = parseFloat(updatedData.unitCost) || 0;
//         const ourMarginPercentage = parseFloat(updatedData.ourMarginPercentage) || 0;
//         const otherMarginPercentage = parseFloat(updatedData.otherMarginPercentage) || 0;
//         const qty = parseInt(updatedData.qty) || 1;
//         const discountPercentage = parseFloat(updatedData.discountPercentage) || 0;
//         updatedData.ourMarginValue = (unitCost * ourMarginPercentage) / 100;
//         updatedData.otherMarginValue = (unitCost * otherMarginPercentage) / 100;
//         updatedData.pricePlusMargin = updatedData.ourMarginValue + updatedData.otherMarginValue;
//         updatedData.sellingRate = updatedData.pricePlusMargin / 0.9;
//         updatedData.sellingRateRounded = Math.ceil(updatedData.sellingRate / 10) * 10;
//         updatedData.unitPrice = updatedData.sellingRateRounded;
//         updatedData.discountValue = (updatedData.sellingRateRounded * discountPercentage) / 100;
//         updatedData.discountedPrice = updatedData.sellingRateRounded - updatedData.discountValue;
//         updatedData.amount = updatedData.discountedPrice * qty;
//         updatedData.profit = (updatedData.ourMarginValue + parseFloat(updatedData.otherMarginPercentage)) * qty;

//         setFormData(updatedData);
//     };

//     const handleAddEntry = () => {
//         if (formData.unitCost > 0 && formData.qty > 0) {
//             if (isEditing && editingIndex !== null) {
//                 const updatedEntries = [...entries];
//                 updatedEntries[editingIndex] = { ...formData, customerName, needImage: entries[editingIndex].needImage };
//                 setEntries(updatedEntries);
//                 setIsEditing(false);
//                 setEditingIndex(null);
//             } else {
//                  setEntries([...entries, { ...formData, customerName, needImage: false }]);
//             }
//             setFormData({
//                 descriptionCustomer: '',
//                 productCode: '',
//                 description: '',
//                 warranty: '',
//                 supplier: '',
//                 unitCost: 0,
//                 ourMarginPercentage: 0,
//                 ourMarginValue: 0,
//                 otherMarginPercentage: 0,
//                 otherMarginValue: 0,
//                 pricePlusMargin: 0,
//                 sellingRate: 0,
//                 sellingRateRounded: 0,
//                 uom: '',
//                 qty: 1,
//                 unitPrice: 0,
//                 discountPercentage: 0,
//                 discountValue: 0,
//                 discountedPrice: 0,
//                 amount: 0,
//                 profit: 0,
//             });
//         } else {
//             alert('Please fill in all required fields correctly.');
//         }
//     };

//     const handleDelete = (index) => {
//         setEntries(entries.filter((_, i) => i !== index));
//     };

//     const calculateTotals = () => {
//         return entries.reduce(
//             (acc, entry) => ({
//                 totalAmount: acc.totalAmount + parseFloat(entry.amount),
//                 totalProfit: acc.totalProfit + parseFloat(entry.profit),
//             }),
//             { totalAmount: 0, totalProfit: 0 }
//         );
//     };

//     const handleEdit = (index) => {
//         const entryToEdit = entries[index];
//         setFormData({
//             ...entryToEdit,
//         });
//         setIsEditing(true);
//         setEditingIndex(index);
//         setCustomerName(entryToEdit.customerName);

//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };
//     const handleSaveToDatabase = async () => {
//         if (entries.length === 0) {
//             alert('Please add at least one entry');
//             return;
//         }

//         setIsSaving(true);
//         const totals = calculateTotals();

//         try {
//             const response = await axios.post(`${config.BASE_URL}/costing`, {
//                 headerData: {
//                     cusId: entries[0].cusId,
//                     totalAmount: totals.totalAmount,
//                     totalProfit: totals.totalProfit,
//                     status: 'draft',
//                 },
//                 detailsData: entries.map((entry) => ({
//                     ...entry,
//                     needImage: entry.needImage || false,
//                 })),
//             });

//             alert('Costing data saved successfully');
//             setEntries([]);
//         } catch (error) {
//             console.error('Error saving costing data:', error);
//             alert('Error saving costing data');
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     return (
//         <div className="container-fluid mt-2">
//             <div className="card mb-2">
//                 <div className="card-body">
//                     <h2 className="card-title mb-3">Quotation</h2>
//                     <div className="row g-3">
//                         <div className="col-md-3">
//                             <label className="form-label">Customer Name</label>
//                             <div className="position-relative">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     value={customerName}
//                                     onChange={(e) =>
//                                         handleInputChange({ target: { name: 'customerName', value: e.target.value } })
//                                     }
//                                 />
//                                 {showCustomerSuggestions && customerSuggestions.length > 0 && (
//                                     <ul className="list-group position-absolute w-100 z-50">
//                                         {customerSuggestions.map((customer) => (
//                                             <li
//                                                 key={customer.cusId}
//                                                 className="list-group-item list-group-item-action"
//                                                 onClick={() => handleCustomerSelect(customer)}
//                                             >
//                                                 {customer.cusName}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Customer Job</label>
//                             <input
//                                 type="text"
//                                 className="form-control bg-light"
//                                 value={customerDetails.cusJob}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Customer Office</label>
//                             <input
//                                 type="text"
//                                 className="form-control bg-light"
//                                 value={customerDetails.cusOffice}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Customer Address</label>
//                             <input
//                                 type="text"
//                                 className="form-control bg-light"
//                                 value={customerDetails.cusAddress}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Customer Product Description</label>
//                             <input
//                                 type="text"
//                                 name="descriptionCustomer"
//                                 id="descriptionCustomer"
//                                 className="form-control "
//                                 value={formData.descriptionCustomer || ''}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Product Name</label>
//                             <div className="position-relative">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="productCode"
//                                     value={formData.productCode}
//                                     onChange={(e) => {
//                                         handleInputChange(e);
//                                         if (e.target.value.length > 2) {
//                                             fetchProductSuggestions(e.target.value);
//                                         }
//                                     }}
//                                 />
//                                 {showProductSuggestions && productSuggestions.length > 0 && (
//                                     <ul className="list-group position-absolute w-100 z-50">
//                                         {productSuggestions.map((product) => (
//                                             <li
//                                                 key={product.productId}
//                                                 className="list-group-item list-group-item-action"
//                                                 onClick={() => handleProductSelect(product)}
//                                             >
//                                                 {product.productName}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Description</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="description"
//                                 value={formData.description}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Warranty</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="warranty"
//                                 value={formData.warranty}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Supplier</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="supplier"
//                                 value={formData.supplier}
//                                 onChange={handleInputChange}
//                             />
//                         </div>


//                         <div className="col-md-3">
//                             <label className="form-label">Unit Cost</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 name="unitCost"
//                                 value={formData.unitCost}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Our Margin %</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 name="ourMarginPercentage"
//                                 value={formData.ourMarginPercentage}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Our Margin Value</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.ourMarginValue}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Other Margin %</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 name="otherMarginPercentage"
//                                 value={formData.otherMarginPercentage}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Other Margin Value</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.otherMarginValue}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Price + Margin</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.pricePlusMargin}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Selling Rate Before Discount</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.sellingRate.toFixed(2)}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Selling Rate (Rounded to Nearest 10)</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.sellingRateRounded}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Uom</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="uom"
//                                 value={formData.uom}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Quantity</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 name="qty"
//                                 value={formData.qty}
//                                 onChange={handleInputChange}
//                             />
//                         </div>


//                         <div className="col-md-3">
//                             <label className="form-label">Unit Price</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.unitPrice}
//                                 readOnly

//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Discount %</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 name="discountPercentage"
//                                 value={formData.discountPercentage}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Discount Value</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.discountValue.toFixed(2)}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Discounted Price</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.discountedPrice.toFixed(2)}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Amount</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.amount.toFixed(2)}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-md-3">
//                             <label className="form-label">Profit</label>
//                             <input
//                                 type="number"
//                                 className="form-control bg-light"
//                                 value={formData.profit.toFixed(2)}
//                                 readOnly
//                             />
//                         </div>

//                         <div className="col-12">
//                         <button
//                             type="button"
//                             className="btn btn-primary me-2 mb-2"
//                             onClick={handleAddEntry}
//                         >
//                             {isEditing ? 'Update Entry' : 'Add Entry'}
//                         </button>
//                         {isEditing && (
//                             <button
//                                 type="button"
//                                 className="btn btn-secondary"
//                                 onClick={() => {
//                                     setIsEditing(false);
//                                     setEditingIndex(null);
//                                     setFormData({
//                                         descriptionCustomer: '',
//                                         productCode: '',
//                                         description: '',
//                                         warranty: '',
//                                         supplier: '',
//                                         unitCost: 0,
//                                         ourMarginPercentage: 0,
//                                         ourMarginValue: 0,
//                                         otherMarginPercentage: 0,
//                                         otherMarginValue: 0,
//                                         pricePlusMargin: 0,
//                                         sellingRate: 0,
//                                         sellingRateRounded: 0,
//                                         uom: '',
//                                         qty: 1,
//                                         unitPrice: 0,
//                                         discountPercentage: 0,
//                                         discountValue: 0,
//                                         discountedPrice: 0,
//                                         amount: 0,
//                                         profit: 0,
//                                     });
//                                 }}
//                             >
//                                 Cancel Edit
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div></div>

//             <div className="table-responsive">
//                 <table className="table table-bordered table-striped">
//                     <thead>
//                         <tr>
//                             <th>Customer Name</th>
//                             <th className="table-warning">Customer Product Description</th>
//                             <th>Product Code</th>
//                             <th>Need Image</th>
//                             <th>Description</th>
//                             <th>Warranty</th>
//                             <th className="table-warning">Supplier</th>
//                             <th className="table-warning">Unit Cost</th>
//                             <th className="table-warning">Our Margin %</th>
//                             <th className="table-warning">Our Margin Value</th>
//                             <th className="table-warning">Other Margin %</th>
//                             <th className="table-warning">Other Margin Value</th>
//                             <th className="table-warning">Price + Margin</th>
//                             <th className="table-warning">Selling Rate Before Discount</th>
//                             <th className="table-warning">Selling Rate (Rounded to Nearest 10)</th>
//                             <th>UOM</th>
//                             <th>Qty</th>
//                             <th>Unit Price</th>
//                             <th>Discount %</th>
//                             <th>Discount Value</th>
//                             <th>Discounted Price</th>
//                             <th>Amount</th>
//                             <th className="table-warning">Profit</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {entries.map((entry, index) => (
//                             <tr key={index}>
//                                 <td>{entry.customerName}</td>
//                                 <td>{entry.descriptionCustomer}</td>
//                                 <td>{entry.productCode}</td>
//                                 <td>
//                                     <input
//                                         type="checkbox"
//                                         checked={entry.needImage || false}
//                                         onChange={(e) => {
//                                             const updatedEntries = [...entries];
//                                             updatedEntries[index].needImage = e.target.checked;
//                                             setEntries(updatedEntries);
//                                         }}
//                                     />
//                                 </td>
//                                 <td>{entry.description}</td>
//                                 <td>{entry.warranty}</td>
//                                 <td>{entry.supplier}</td>
//                                 <td>{entry.unitCost}</td>
//                                 <td>{entry.ourMarginPercentage}</td>
//                                 <td>{entry.ourMarginValue.toFixed(2)}</td>
//                                 <td>{entry.otherMarginPercentage}</td>
//                                 <td>{entry.otherMarginValue.toFixed(2)}</td>
//                                 <td>{entry.pricePlusMargin.toFixed(2)}</td>
//                                 <td>{entry.sellingRate.toFixed(2)}</td>
//                                 <td>{entry.sellingRateRounded}</td>
//                                 <td>{entry.uom}</td>
//                                 <td>{entry.qty}</td>
//                                 <td>{entry.unitPrice}</td>
//                                 <td>{entry.discountPercentage}</td>
//                                 <td>{entry.discountValue.toFixed(2)}</td>
//                                 <td>{entry.discountedPrice.toFixed(2)}</td>
//                                 <td>{entry.amount.toFixed(2)}</td>
//                                 <td>{entry.profit.toFixed(2)}</td>
//                                 <td>
//                                     <button
//                                         className="btn btn-warning btn-sm me-2"
//                                         onClick={() => handleEdit(index)}
//                                     >
//                                         <Edit size={16} />
//                                     </button>
//                                     <button
//                                         className="btn btn-danger btn-sm"
//                                         onClick={() => handleDelete(index)}
//                                     >
//                                         <Trash size={16} />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                     <tfoot>
//                         <tr>
//                             <td colSpan="21" className="text-end fw-bold">
//                                 Totals:
//                             </td>
//                             <td className="fw-bold">{calculateTotals().totalAmount.toFixed(2)}</td>
//                             <td className="fw-bold">{calculateTotals().totalProfit.toFixed(2)}</td>
//                             <td></td>
//                         </tr>
//                     </tfoot>
//                 </table>


// <div className="mt-3 text-end mb-4 d-flex justify-content-end gap-2">
//     <button
//         type="button"
//         className="btn btn-danger"
//         onClick={() => window.history.back()}
//     >
//         Cancel
//     </button>

//     <button
//         type="button"
//         className="btn btn-success"
//         onClick={handleSaveToDatabase}
//         disabled={isSaving || entries.length === 0}
//     >
//         {isSaving ? 'Saving...' : 'Create Quotation'}
//     </button>
// </div>


//             </div>
//         </div>
//     );
// };

// export default CostingTable;






import React, { useState, useEffect } from 'react';
import { Trash, Edit } from 'lucide-react';
import axios from 'axios';
import config from '../../config';

const CostingTable = () => {
    const [entries, setEntries] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        descriptionCustomer: '',
        productCode: '',
        description: '',
        warranty: '',
        supplier: '',
        unitCost: 0,
        ourMarginPercentage: 0,
        ourMarginValue: 0,
        otherMarginPercentage: 0,
        otherMarginValue: 0,
        pricePlusMargin: 0,
        sellingRate: 0,
        sellingRateRounded: 0,
        uom: '',
        qty: 1,
        unitPrice: 0,
        discountPercentage: 0,
        discountValue: 0,
        discountedPrice: 0,
        amount: 0,
        profit: 0,
    });

    const [customerName, setCustomerName] = useState('');
    const [customerSuggestions, setCustomerSuggestions] = useState([]);
    const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
    const [productSuggestions, setProductSuggestions] = useState([]);
    const [showProductSuggestions, setShowProductSuggestions] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        cusJob: '',
        cusOffice: '',
        cusAddress: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const fetchCustomerSuggestions = async (name) => {
        try {
            const response = await axios.get(`${config.BASE_URL}/customers/suggestion`, {
                params: { name },
            });
            setCustomerSuggestions(response.data);
            setShowCustomerSuggestions(true);
        } catch (error) {
            console.error('Error fetching customer suggestions:', error);
            setCustomerSuggestions([]);
            setShowCustomerSuggestions(false);
        }
    };

    const fetchProductSuggestions = async (query) => {
        try {
            const response = await axios.get(`${config.BASE_URL}/products/suggestions`, {
                params: { query },
            });
            setProductSuggestions(response.data);
            setShowProductSuggestions(true);
        } catch (error) {
            console.error('Error fetching product suggestions:', error);
            setProductSuggestions([]);
            setShowProductSuggestions(false);
        }
    };
    const fetchCustomerDetails = async (cusName) => {
        try {
            const response = await axios.get(`${config.BASE_URL}/customer/cusName/${cusName}`);
            const customer = response.data;
            setCustomerDetails({
                cusJob: customer.cusJob || '',
                cusOffice: customer.cusOffice || '',
                cusAddress: customer.cusAddress || '',
            });
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };

    const handleCustomerSelect = (customer) => {
        setCustomerName(customer.cusName);
        setFormData((prev) => ({
            ...prev,
            cusId: customer.cusId,
        }));
        setCustomerSuggestions([]);
        setShowCustomerSuggestions(false);
        fetchCustomerDetails(customer.cusName);
    };

    const handleProductSelect = (product) => {
        setFormData((prev) => ({
            ...prev,
            productCode: product.productName,
            warranty: product.productWarranty,
            description: product.productDescription,
        }));
        setProductSuggestions([]);
        setShowProductSuggestions(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'customerName') {
            setCustomerName(value);
            if (value.length > 2) {
                fetchCustomerSuggestions(value);
            }
            return;
        }

        const updatedData = { ...formData, [name]: value };

        const unitCost = parseFloat(updatedData.unitCost) || 0;
        const ourMarginPercentage = parseFloat(updatedData.ourMarginPercentage) || 0;
        const otherMarginPercentage = parseFloat(updatedData.otherMarginPercentage) || 0;
        const qty = parseInt(updatedData.qty) || 1;
        const discountPercentage = parseFloat(updatedData.discountPercentage) || 0;
        updatedData.ourMarginValue = (unitCost * ourMarginPercentage) / 100;
        updatedData.otherMarginValue = (unitCost * otherMarginPercentage) / 100;
        updatedData.pricePlusMargin = updatedData.ourMarginValue + updatedData.otherMarginValue;
        updatedData.sellingRate = updatedData.pricePlusMargin / 0.9;
        updatedData.sellingRateRounded = Math.ceil(updatedData.sellingRate / 10) * 10;
        updatedData.unitPrice = updatedData.sellingRateRounded;
        updatedData.discountValue = (updatedData.sellingRateRounded * discountPercentage) / 100;
        updatedData.discountedPrice = updatedData.sellingRateRounded - updatedData.discountValue;
        updatedData.amount = updatedData.discountedPrice * qty;
        updatedData.profit = (updatedData.ourMarginValue + parseFloat(updatedData.otherMarginPercentage)) * qty;

        setFormData(updatedData);
    };

    const handleAddEntry = () => {
        if (formData.unitCost > 0 && formData.qty > 0) {
            if (isEditing && editingIndex !== null) {
                const updatedEntries = [...entries];
                updatedEntries[editingIndex] = { ...formData, customerName, needImage: entries[editingIndex].needImage };
                setEntries(updatedEntries);
                setIsEditing(false);
                setEditingIndex(null);
            } else {
                setEntries([...entries, { ...formData, customerName, needImage: false }]);
            }
            setFormData({
                descriptionCustomer: '',
                productCode: '',
                description: '',
                warranty: '',
                supplier: '',
                unitCost: 0,
                ourMarginPercentage: 0,
                ourMarginValue: 0,
                otherMarginPercentage: 0,
                otherMarginValue: 0,
                pricePlusMargin: 0,
                sellingRate: 0,
                sellingRateRounded: 0,
                uom: '',
                qty: 1,
                unitPrice: 0,
                discountPercentage: 0,
                discountValue: 0,
                discountedPrice: 0,
                amount: 0,
                profit: 0,
            });
        } else {
            alert('Please fill in all required fields correctly.');
        }
    };

    const handleDelete = (index) => {
        setEntries(entries.filter((_, i) => i !== index));
    };

    const calculateTotals = () => {
        return entries.reduce(
            (acc, entry) => ({
                totalAmount: acc.totalAmount + parseFloat(entry.amount),
                totalProfit: acc.totalProfit + parseFloat(entry.profit),
            }),
            { totalAmount: 0, totalProfit: 0 }
        );
    };

    const handleEdit = (index) => {
        const entryToEdit = entries[index];
        setFormData({
            ...entryToEdit,
        });
        setIsEditing(true);
        setEditingIndex(index);
        setCustomerName(entryToEdit.customerName);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    const handleSaveToDatabase = async () => {
        if (entries.length === 0) {
            alert('Please add at least one entry');
            return;
        }

        setIsSaving(true);
        const totals = calculateTotals();

        try {
            const response = await axios.post(`${config.BASE_URL}/costing`, {
                headerData: {
                    cusId: entries[0].cusId,
                    totalAmount: totals.totalAmount,
                    totalProfit: totals.totalProfit,
                    preparedBy: preparedBy 
                },
                detailsData: entries.map((entry) => ({
                    ...entry,
                    needImage: entry.needImage || false,
                })),
            });

            alert(' saved successfully');
            setEntries([]);
            setCustomerName('');
            setCustomerDetails({
                cusJob: '',
                cusOffice: '',
                cusAddress: '',
            });
            setFormData({
                descriptionCustomer: '',
                productCode: '',
                description: '',
                warranty: '',
                supplier: '',
                unitCost: 0,
                ourMarginPercentage: 0,
                ourMarginValue: 0,
                otherMarginPercentage: 0,
                otherMarginValue: 0,
                pricePlusMargin: 0,
                sellingRate: 0,
                sellingRateRounded: 0,
                uom: '',
                qty: 1,
                unitPrice: 0,
                discountPercentage: 0,
                discountValue: 0,
                discountedPrice: 0,
                amount: 0,
                profit: 0,
            });
        } catch (error) {
            console.error('Error saving :', error);
            alert('Error saving');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveDraft = async () => {
        if (entries.length === 0) {
            alert('Please add at least one entry');
            return;
        }

        setIsSaving(true);
        const totals = calculateTotals();

        try {
            const response = await axios.post(`${config.BASE_URL}/costingDraft`, {
                headerData: {
                    cusId: entries[0].cusId,
                    totalAmount: totals.totalAmount,
                    totalProfit: totals.totalProfit,
                    status: 'draft',
                    preparedBy: preparedBy || null,
                },
                detailsData: entries.map((entry) => ({
                    ...entry,
                    needImage: entry.needImage || false,
                })),
            });

            alert('Costing data saved successfully');
            setEntries([]);
        } catch (error) {
            console.error('Error saving costing data:', error);
            alert('Error saving costing data');
        } finally {
            setIsSaving(false);
        }
    };

    const [preparedBy, setPreparedBy] = useState('');

    return (
        <div className="container-fluid mt-2">
            <div className="card mb-2">
                <div className="card-body">
                    <h2 className="card-title mb-3">Quotation</h2>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Customer Name</label>
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={customerName}
                                    onChange={(e) =>
                                        handleInputChange({ target: { name: 'customerName', value: e.target.value } })
                                    }
                                />
                                {showCustomerSuggestions && customerSuggestions.length > 0 && (
                                    <ul className="list-group position-absolute w-100 z-50">
                                        {customerSuggestions.map((customer) => (
                                            <li
                                                key={customer.cusId}
                                                className="list-group-item list-group-item-action"
                                                onClick={() => handleCustomerSelect(customer)}
                                            >
                                                {customer.cusName}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Customer Job</label>
                            <input
                                type="text"
                                className="form-control bg-light"
                                value={customerDetails.cusJob}
                                readOnly
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Customer Office</label>
                            <input
                                type="text"
                                className="form-control bg-light"
                                value={customerDetails.cusOffice}
                                readOnly
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Customer Address</label>
                            <input
                                type="text"
                                className="form-control bg-light"
                                value={customerDetails.cusAddress}
                                readOnly
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Customer Product Description</label>
                            <input
                                type="text"
                                name="descriptionCustomer"
                                id="descriptionCustomer"
                                className="form-control "
                                value={formData.descriptionCustomer || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Product Name</label>
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="productCode"
                                    value={formData.productCode}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        if (e.target.value.length > 2) {
                                            fetchProductSuggestions(e.target.value);
                                        }
                                    }}
                                />
                                {showProductSuggestions && productSuggestions.length > 0 && (
                                    <ul className="list-group position-absolute w-100 z-50">
                                        {productSuggestions.map((product) => (
                                            <li
                                                key={product.productId}
                                                className="list-group-item list-group-item-action"
                                                onClick={() => handleProductSelect(product)}
                                            >
                                                {product.productName}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Warranty</label>
                            <input
                                type="text"
                                className="form-control"
                                name="warranty"
                                value={formData.warranty}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Supplier</label>
                            <input
                                type="text"
                                className="form-control"
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleInputChange}
                            />
                        </div>


                        <div className="col-md-3">
                            <label className="form-label">Unit Cost</label>
                            <input
                                type="number"
                                className="form-control"
                                name="unitCost"
                                value={formData.unitCost}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Our Margin %</label>
                            <input
                                type="number"
                                className="form-control"
                                name="ourMarginPercentage"
                                value={formData.ourMarginPercentage}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Our Margin Value</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                value={formData.ourMarginValue}
                                readOnly
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Other Margin %</label>
                            <input
                                type="number"
                                className="form-control"
                                name="otherMarginPercentage"
                                value={formData.otherMarginPercentage}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Other Margin Value</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                value={formData.otherMarginValue}
                                readOnly
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Price + Margin</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                value={formData.pricePlusMargin}
                                readOnly
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Selling Rate Before Discount</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                value={formData.sellingRate.toFixed(2)}
                                readOnly
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Selling Rate (Rounded to Nearest 10)</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                value={formData.sellingRateRounded}
                                readOnly
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Uom</label>
                            <input
                                type="text"
                                className="form-control"
                                name="uom"
                                value={formData.uom}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                name="qty"
                                value={formData.qty}
                                onChange={handleInputChange}
                            />
                        </div>


                        <div className="col-md-3">
                            <label className="form-label">Unit Price</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                value={formData.unitPrice}
                                readOnly

                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Discount %</label>
                            <input
                                type="number"
                                className="form-control"
                                name="discountPercentage"
                                value={formData.discountPercentage}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Discount Value</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                value={formData.discountValue.toFixed(2)}
                                readOnly
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Discounted Price</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                value={formData.discountedPrice.toFixed(2)}
                                readOnly
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Amount</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                value={formData.amount.toFixed(2)}
                                readOnly
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Profit</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                value={formData.profit.toFixed(2)}
                                readOnly
                            />
                        </div>

                        <div className="col-12">
                            <button
                                type="button"
                                className="btn btn-primary me-2 mb-2"
                                onClick={handleAddEntry}
                            >
                                {isEditing ? 'Update Entry' : 'Add Entry'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditingIndex(null);
                                        setFormData({
                                            descriptionCustomer: '',
                                            productCode: '',
                                            description: '',
                                            warranty: '',
                                            supplier: '',
                                            unitCost: 0,
                                            ourMarginPercentage: 0,
                                            ourMarginValue: 0,
                                            otherMarginPercentage: 0,
                                            otherMarginValue: 0,
                                            pricePlusMargin: 0,
                                            sellingRate: 0,
                                            sellingRateRounded: 0,
                                            uom: '',
                                            qty: 1,
                                            unitPrice: 0,
                                            discountPercentage: 0,
                                            discountValue: 0,
                                            discountedPrice: 0,
                                            amount: 0,
                                            profit: 0,
                                        });
                                    }}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </div>
                </div></div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th className="table-warning">Customer Product Description</th>
                            <th>Product Code</th>
                            <th>Need Image</th>
                            <th>Description</th>
                            <th>Warranty</th>
                            <th className="table-warning">Supplier</th>
                            <th className="table-warning">Unit Cost</th>
                            <th className="table-warning">Our Margin %</th>
                            <th className="table-warning">Our Margin Value</th>
                            <th className="table-warning">Other Margin %</th>
                            <th className="table-warning">Other Margin Value</th>
                            <th className="table-warning">Price + Margin</th>
                            <th className="table-warning">Selling Rate Before Discount</th>
                            <th className="table-warning">Selling Rate (Rounded to Nearest 10)</th>
                            <th>UOM</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Discount %</th>
                            <th>Discount Value</th>
                            <th>Discounted Price</th>
                            <th>Amount</th>
                            <th className="table-warning">Profit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.customerName}</td>
                                <td>{entry.descriptionCustomer}</td>
                                <td>{entry.productCode}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={entry.needImage || false}
                                        onChange={(e) => {
                                            const updatedEntries = [...entries];
                                            updatedEntries[index].needImage = e.target.checked;
                                            setEntries(updatedEntries);
                                        }}
                                    />
                                </td>
                                <td>{entry.description}</td>
                                <td>{entry.warranty}</td>
                                <td>{entry.supplier}</td>
                                <td>{entry.unitCost}</td>
                                <td>{entry.ourMarginPercentage}</td>
                                <td>{entry.ourMarginValue.toFixed(2)}</td>
                                <td>{entry.otherMarginPercentage}</td>
                                <td>{entry.otherMarginValue.toFixed(2)}</td>
                                <td>{entry.pricePlusMargin.toFixed(2)}</td>
                                <td>{entry.sellingRate.toFixed(2)}</td>
                                <td>{entry.sellingRateRounded}</td>
                                <td>{entry.uom}</td>
                                <td>{entry.qty}</td>
                                <td>{entry.unitPrice}</td>
                                <td>{entry.discountPercentage}</td>
                                <td>{entry.discountValue.toFixed(2)}</td>
                                <td>{entry.discountedPrice.toFixed(2)}</td>
                                <td>{entry.amount.toFixed(2)}</td>
                                <td>{entry.profit.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(index)}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(index)}
                                    >
                                        <Trash size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="21" className="text-end fw-bold">
                                Totals:
                            </td>
                            <td className="fw-bold">{calculateTotals().totalAmount.toFixed(2)}</td>
                            <td className="fw-bold">{calculateTotals().totalProfit.toFixed(2)}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>

                {/* 
<div className="mt-3 text-end mb-4 d-flex justify-content-end gap-2">
    <button
        type="button"
        className="btn btn-danger"
        onClick={() => window.history.back()}
    >
        Cancel
    </button>

    <button
        type="button"
        className="btn btn-success"
        onClick={handleSaveToDatabase}
        disabled={isSaving || entries.length === 0}
    >
        {isSaving ? 'Saving...' : 'Create Quotation'}
    </button>
</div> */}

                <div className="mt-3 text-end mb-4 d-flex justify-content-end gap-2">
                    <div className="me-2">
                        <input
                            type="text"
                            className="form-control "
                            placeholder="Prepared By"
                            value={preparedBy}
                            onChange={(e) => setPreparedBy(e.target.value)}
                        />
                    </div>


                </div>

          

            <div className="mt-3 text-end mb-4 d-flex justify-content-end gap-2">
                {/* <div className="me-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Prepared By"
                        value={preparedBy}
                        onChange={(e) => setPreparedBy(e.target.value)}
                    />
                </div> */}
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveDraft}
                    disabled={isSaving || entries.length === 0}
                >
                    {isSaving ? 'Saving Draft...' : 'Draft'}
                </button>

                <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSaveToDatabase}
                    disabled={isSaving || entries.length === 0}
                >
                    {isSaving ? 'Saving...' : 'Create Quotation'}
                </button>
            </div>


        </div>
        </div >
    );
};

export default CostingTable;
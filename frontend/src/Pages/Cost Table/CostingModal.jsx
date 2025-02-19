// import React, { useState, useEffect } from 'react';
// import './CostingModal.css';
// import config from '../../config';
// import axios from 'axios';

// const CostingModal = ({ showModal, closeModal, formData, onChange, onSubmit }) => {
//     const [localFormData, setLocalFormData] = useState(formData);
//     const [productCode, setProductCode] = useState('');
//     const [customerName, setCustomerName] = useState('');
//     const [customerSuggestions, setCustomerSuggestions] = useState([]);
//     const [showSuggestions, setShowSuggestions] = useState(false);

//     useEffect(() => {
//         if (showModal) {
//             setLocalFormData(formData);
//             setProductCode(formData.productCode || '');
//         }
//     }, [showModal, formData]);

//     const fetchCustomerSuggestions = async (name) => {
//         try {
//             const response = await axios.get(`${config.BASE_URL}/customers/suggestion`, {
//                 params: { name },
//             });
//             setCustomerSuggestions(response.data);
//             setShowSuggestions(true);
//         } catch (error) {
//             console.error('Error fetching customer suggestions:', error);
//             setCustomerSuggestions([]);
//             setShowSuggestions(false);
//         }
//     };

//     const handleCustomerNameChange = (e) => {
//         const value = e.target.value;
//         setCustomerName(value);

//         if (value.length > 2) {
//             fetchCustomerSuggestions(value);
//         } else {
//             setCustomerSuggestions([]);
//             setShowSuggestions(false);
//         }
//     };

//     const handleCustomerSelect = (customer) => {
//         setCustomerName(customer.cusName);
//         setLocalFormData((prevData) => ({
//             ...prevData,
//             cusId: customer.cusId, // Ensure cusId is set in formData
//         }));
//         setCustomerSuggestions([]);
//         setShowSuggestions(false);
//     };

//     const fetchProductDetails = async (code) => {
//         try {
//             const response = await axios.get(`${config.BASE_URL}/product/codeOrName/${code}`);
//             const product = response.data;

//             setLocalFormData((prevData) => ({
//                 ...prevData,
//                 warranty: product.productWarranty,
//                 description: product.productDescription,
//             }));

//             onChange({
//                 ...localFormData,
//                 productCode: code,
//                 warranty: product.productWarranty,
//                 description: product.productDescription,
//             });
//         } catch (error) {
//             console.error('Error fetching product details:', error);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'productCode') {
//             setProductCode(value);
//             fetchProductDetails(value);
//             return;
//         }

//         const updatedData = { ...localFormData, [name]: value };

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
    
//         setLocalFormData(updatedData);
//         onChange(updatedData);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit({ ...localFormData, productCode, customerName, cusId: localFormData.cusId }); // Ensure cusId is passed
//         closeModal();
//     };

//     if (!showModal) return null;

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content modal-centered">
//                 <h4>Add/Edit Costing Entry</h4>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-grid">
//                         {/* Customer Name Input with Suggestions */}
//                         <div className="form-group">
//                             <label htmlFor="customerName">Customer Name</label>
//                             <input
//                                 type="text"
//                                 name="customerName"
//                                 id="customerName"
//                                 className="form-control"
//                                 value={customerName}
//                                 onChange={handleCustomerNameChange}
//                                 autoComplete="off"
//                             />
//                             {showSuggestions && customerSuggestions.length > 0 && (
//                                 <ul className="suggestions-dropdown">
//                                     {customerSuggestions.map((customer) => (
//                                         <li
//                                             key={customer.cusId}
//                                             onClick={() => handleCustomerSelect(customer)}
//                                         >
//                                             {customer.cusName} ({customer.cusCode})
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>

                        
//                         {Object.keys(localFormData).map((key) => (
//                             <div
//                                 className={`form-group ${key === 'cusId' ? 'd-none' : ''}`}
//                                 key={key}
//                             >
//                 <label htmlFor={key} className="text-capitalize">
//                 {key === 'productCode' ? 'Product Code or Name': key === 'descriptionCustomer'? 'Customer Product Description': key.replace(/([A-Z])/g, ' $1')}
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name={key}
//                                     id={key}
//                                     className={`form-control ${
//                                         key.includes('Value') || key.includes('Price') || key === 'profit'
//                                             ? 'bg-warning'
//                                             : ''
//                                     }`}
//                                     value={key === 'productCode' ? productCode : localFormData[key]}
//                                     onChange={handleInputChange}
//                                     readOnly={key.includes('Value') || key.includes('Price') || key === 'profit'}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                     <div className="form-actions">
//                         <button type="button" className="btn btn-danger" onClick={closeModal}>
//                             Cancel
//                         </button>
//                         <button type="submit" className="btn btn-primary">
//                             Save
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // export default CostingModal;

// import React, { useState, useEffect } from 'react';
// import './CostingModal.css';
// import config from '../../config';
// import axios from 'axios';

// const CostingModal = ({ showModal, closeModal, formData, onChange, onSubmit }) => {
//     const [localFormData, setLocalFormData] = useState(formData);
//     const [productCode, setProductCode] = useState('');
//     const [customerName, setCustomerName] = useState('');
//     const [customerSuggestions, setCustomerSuggestions] = useState([]);
//     const [showSuggestions, setShowSuggestions] = useState(false);

//     useEffect(() => {
//         if (showModal) {
//             setLocalFormData(formData);
//             setProductCode(formData.productCode || '');
//         }
//     }, [showModal, formData]);

//     const fetchCustomerSuggestions = async (name) => {
//         try {
//             const response = await axios.get(`${config.BASE_URL}/customers/suggestion`, {
//                 params: { name },
//             });
//             setCustomerSuggestions(response.data);
//             setShowSuggestions(true);
//         } catch (error) {
//             console.error('Error fetching customer suggestions:', error);
//             setCustomerSuggestions([]);
//             setShowSuggestions(false);
//         }
//     };

//     const handleCustomerNameChange = (e) => {
//         const value = e.target.value;
//         setCustomerName(value);

//         if (value.length > 2) {
//             fetchCustomerSuggestions(value);
//         } else {
//             setCustomerSuggestions([]);
//             setShowSuggestions(false);
//         }
//     };

//     const handleCustomerSelect = (customer) => {
//         setCustomerName(customer.cusName);
//         setLocalFormData((prevData) => ({
//             ...prevData,
//             cusId: customer.cusId, // Ensure cusId is set in formData
//         }));
//         setCustomerSuggestions([]);
//         setShowSuggestions(false);
//     };

//     const fetchProductDetails = async (code) => {
//         try {
//             const response = await axios.get(`${config.BASE_URL}/product/codeOrName/${code}`);
//             const product = response.data;

//             setLocalFormData((prevData) => ({
//                 ...prevData,
//                 warranty: product.productWarranty,
//                 description: product.productDescription,
//             }));

//             onChange({
//                 ...localFormData,
//                 productCode: code,
//                 warranty: product.productWarranty,
//                 description: product.productDescription,
//             });
//         } catch (error) {
//             console.error('Error fetching product details:', error);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'productCode') {
//             setProductCode(value);
//             fetchProductDetails(value);
//             return;
//         }

//         const updatedData = { ...localFormData, [name]: value };

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
    
//         setLocalFormData(updatedData);
//         onChange(updatedData);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit({ ...localFormData, productCode, customerName, cusId: localFormData.cusId }); // Ensure cusId is passed
//         closeModal();
//     };

//     if (!showModal) return null;

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content modal-centered">
//                 <h4>Add/Edit Costing Entry</h4>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-grid">
//                         {/* Customer Name Input with Suggestions */}
//                         <div className="form-group">
//                             <label htmlFor="customerName">Customer Name</label>
//                             <input
//                                 type="text"
//                                 name="customerName"
//                                 id="customerName"
//                                 className="form-control"
//                                 value={customerName}
//                                 onChange={handleCustomerNameChange}
//                                 autoComplete="off"
//                             />
//                             {showSuggestions && customerSuggestions.length > 0 && (
//                                 <ul className="suggestions-dropdown">
//                                     {customerSuggestions.map((customer) => (
//                                         <li
//                                             key={customer.cusId}
//                                             onClick={() => handleCustomerSelect(customer)}
//                                         >
//                                             {customer.cusName} ({customer.cusCode})
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>

                        
//                         {Object.keys(localFormData).map((key) => (
//                             <div
//                                 className={`form-group ${key === 'cusId' ? 'd-none' : ''}`}
//                                 key={key}
//                             >
//                 <label htmlFor={key} className="text-capitalize">
//                 {key === 'productCode' ? 'Product Code or Name': key === 'descriptionCustomer'? 'Customer Product Description': key.replace(/([A-Z])/g, ' $1')}
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name={key}
//                                     id={key}
//                                     className={`form-control ${
//                                         key.includes('Value') || key.includes('Price') || key === 'profit'
//                                             ? 'bg-warning'
//                                             : ''
//                                     }`}
//                                     value={key === 'productCode' ? productCode : localFormData[key]}
//                                     onChange={handleInputChange}
//                                     readOnly={key.includes('Value') || key.includes('Price') || key === 'profit'}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                     <div className="form-actions">
//                         <button type="button" className="btn btn-danger" onClick={closeModal}>
//                             Cancel
//                         </button>
//                         <button type="submit" className="btn btn-primary">
//                             Save
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CostingModal;

// import React, { useState, useEffect } from 'react';
// import './CostingModal.css';
// import config from '../../config';
// import axios from 'axios';

// const CostingModal = ({ showModal, closeModal, formData, onChange, onSubmit }) => {
//     const [localFormData, setLocalFormData] = useState(formData);
//     const [productCode, setProductCode] = useState('');
//     const [customerName, setCustomerName] = useState('');
//     const [customerSuggestions, setCustomerSuggestions] = useState([]);
//     const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
//     const [productSuggestions, setProductSuggestions] = useState([]);
//     const [showProductSuggestions, setShowProductSuggestions] = useState(false);

//     useEffect(() => {
//         if (showModal) {
//             setLocalFormData(formData);
//             setProductCode(formData.productCode || '');
//         }
//     }, [showModal, formData]);

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

//     const handleCustomerNameChange = (e) => {
//         const value = e.target.value;
//         setCustomerName(value);

//         if (value.length > 2) {
//             fetchCustomerSuggestions(value);
//         } else {
//             setCustomerSuggestions([]);
//             setShowCustomerSuggestions(false);
//         }
//     };

//     const handleCustomerSelect = (customer) => {
//         setCustomerName(customer.cusName);
//         setLocalFormData((prevData) => ({
//             ...prevData,
//             cusId: customer.cusId,
//         }));
//         setCustomerSuggestions([]);
//         setShowCustomerSuggestions(false);
//     };

//     const handleProductSelect = (product) => {
//         setProductCode(product.productCode);
//         setLocalFormData((prevData) => ({
//             ...prevData,
//             productCode: product.productCode,
//             warranty: product.productWarranty,
//             description: product.productDescription,
//         }));
//         setProductSuggestions([]);
//         setShowProductSuggestions(false);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'productCode') {
//             setProductCode(value);
//             if (value.length > 2) {
//                 fetchProductSuggestions(value);
//             } else {
//                 setProductSuggestions([]);
//                 setShowProductSuggestions(false);
//             }
//             return;
//         }

//         const updatedData = { ...localFormData, [name]: value };

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
    
//         setLocalFormData(updatedData);
//         onChange(updatedData);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit({ ...localFormData, productCode, customerName, cusId: localFormData.cusId });
//         closeModal();
//     };

//     if (!showModal) return null;

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content modal-centered">
//                 <h4>Add/Edit Costing Entry</h4>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-grid">
//                         {/* Customer Name Input with Suggestions */}
//                         <div className="form-group">
//                             <label htmlFor="customerName">Customer Name</label>
//                             <input
//                                 type="text"
//                                 name="customerName"
//                                 id="customerName"
//                                 className="form-control"
//                                 value={customerName}
//                                 onChange={handleCustomerNameChange}
//                                 autoComplete="off"
//                             />
//                             {showCustomerSuggestions && customerSuggestions.length > 0 && (
//                                 <ul className="suggestions-dropdown">
//                                     {customerSuggestions.map((customer) => (
//                                         <li
//                                             key={customer.cusId}
//                                             onClick={() => handleCustomerSelect(customer)}
//                                         >
//                                             {customer.cusName} ({customer.cusCode})
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>

//                         {/* Product Code/Name Input with Suggestions */}
//                         <div className="form-group">
//                             <label htmlFor="productCode">Product Code or Name</label>
//                             <input
//                                 type="text"
//                                 name="productCode"
//                                 id="productCode"
//                                 className="form-control"
//                                 value={productCode}
//                                 onChange={handleInputChange}
//                                 autoComplete="off"
//                             />
//                             {showProductSuggestions && productSuggestions.length > 0 && (
//                                 <ul className="suggestions-dropdown">
//                                     {productSuggestions.map((product) => (
//                                         <li
//                                             key={product.productId}
//                                             onClick={() => handleProductSelect(product)}
//                                         >
//                                             {product.productName} ({product.productCode})
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>

//                         {Object.keys(localFormData).map((key) => (
//                             <div
//                                 className={`form-group ${key === 'cusId' ? 'd-none' : ''}`}
//                                 key={key}
//                             >
//                                 <label htmlFor={key} className="text-capitalize">
//                                     {key === 'productCode' ? 'Product Code or Name' : key === 'descriptionCustomer' ? 'Customer Product Description' : key.replace(/([A-Z])/g, ' $1')}
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name={key}
//                                     id={key}
//                                     className={`form-control ${
//                                         key.includes('Value') || key.includes('Price') || key === 'profit'
//                                             ? 'bg-warning'
//                                             : ''
//                                     }`}
//                                     value={key === 'productCode' ? productCode : localFormData[key]}
//                                     onChange={handleInputChange}
//                                     readOnly={key.includes('Value') || key.includes('Price') || key === 'profit'}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                     <div className="form-actions">
//                         <button type="button" className="btn btn-danger" onClick={closeModal}>
//                             Cancel
//                         </button>
//                         <button type="submit" className="btn btn-primary">
//                             Save
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CostingModal;



//--------------without customer

// import React, { useState, useEffect } from 'react';
// import './CostingModal.css';
// import config from '../../config';
// import axios from 'axios';

// const CostingModal = ({ showModal, closeModal, formData, onChange, onSubmit }) => {
//     const [localFormData, setLocalFormData] = useState(formData);
//     const [productCode, setProductCode] = useState('');
//     const [customerName, setCustomerName] = useState('');
//     const [customerSuggestions, setCustomerSuggestions] = useState([]);
//     const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
//     const [productSuggestions, setProductSuggestions] = useState([]);
//     const [showProductSuggestions, setShowProductSuggestions] = useState(false);

//     useEffect(() => {
//         if (showModal) {
//             setLocalFormData(formData);
//             setProductCode(formData.productCode || '');
//         }
//     }, [showModal, formData]);

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

//     const handleCustomerNameChange = (e) => {
//         const value = e.target.value;
//         setCustomerName(value);

//         if (value.length > 2) {
//             fetchCustomerSuggestions(value);
//         } else {
//             setCustomerSuggestions([]);
//             setShowCustomerSuggestions(false);
//         }
//     };

//     const handleCustomerSelect = (customer) => {
//         setCustomerName(customer.cusName);
//         setLocalFormData((prevData) => ({
//             ...prevData,
//             cusId: customer.cusId,
//         }));
//         setCustomerSuggestions([]);
//         setShowCustomerSuggestions(false);
//     };

//     const handleProductSelect = (product) => {
//         setProductCode(product.productCode);
//         setLocalFormData((prevData) => ({
//             ...prevData,
//             productCode: product.productCode,
//             warranty: product.productWarranty,
//             description: product.productDescription,
//         }));
//         setProductSuggestions([]);
//         setShowProductSuggestions(false);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'productCode') {
//             setProductCode(value);
//             if (value.length > 2) {
//                 fetchProductSuggestions(value);
//             } else {
//                 setProductSuggestions([]);
//                 setShowProductSuggestions(false);
//             }
//             return;
//         }

//         const updatedData = { ...localFormData, [name]: value };

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
    
//         setLocalFormData(updatedData);
//         onChange(updatedData);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit({ ...localFormData, productCode, customerName, cusId: localFormData.cusId });
//         closeModal();
//     };

//     if (!showModal) return null;

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content modal-centered">
//                 <h4>Add/Edit Costing Entry</h4>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-grid">
//                         {/* Customer Name Input with Suggestions */}
//                         <div className="form-group">
//                             <label htmlFor="customerName">Customer Name</label>
//                             <input
//                                 type="text"
//                                 name="customerName"
//                                 id="customerName"
//                                 className="form-control"
//                                 value={customerName}
//                                 onChange={handleCustomerNameChange}
//                                 autoComplete="off"
//                             />
//                             {showCustomerSuggestions && customerSuggestions.length > 0 && (
//                                 <ul className="suggestions-dropdown">
//                                     {customerSuggestions.map((customer) => (
//                                         <li
//                                             key={customer.cusId}
//                                             onClick={() => handleCustomerSelect(customer)}
//                                         >
//                                             {customer.cusName} ({customer.cusCode})
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>

//                         {/* Commented out the explicit Product Code/Name Input with Suggestions */}
//                         {/* <div className="form-group">
//                             <label htmlFor="productCode">Product Code or Name</label>
//                             <input
//                                 type="text"
//                                 name="productCode"
//                                 id="productCode"
//                                 className="form-control"
//                                 value={productCode}
//                                 onChange={handleInputChange}
//                                 autoComplete="off"
//                             />
//                             {showProductSuggestions && productSuggestions.length > 0 && (
//                                 <ul className="suggestions-dropdown">
//                                     {productSuggestions.map((product) => (
//                                         <li
//                                             key={product.productId}
//                                             onClick={() => handleProductSelect(product)}
//                                         >
//                                             {product.productName} ({product.productCode})
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div> */}

//                         {Object.keys(localFormData).map((key) => (
//                             <div
//                                 className={`form-group ${key === 'cusId' ? 'd-none' : ''}`}
//                                 key={key}
//                             >
//                                 <label htmlFor={key} className="text-capitalize">
//                                     {key === 'productCode' ? 'Product Code or Name' : key === 'descriptionCustomer' ? 'Customer Product Description' : key.replace(/([A-Z])/g, ' $1')}
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name={key}
//                                     id={key}
//                                     className={`form-control ${
//                                         key.includes('Value') || key.includes('Price') || key === 'profit'
//                                             ? 'bg-warning'
//                                             : ''
//                                     }`}
//                                     value={key === 'productCode' ? productCode : localFormData[key]}
//                                     onChange={handleInputChange}
//                                     readOnly={key.includes('Value') || key.includes('Price') || key === 'profit'}
//                                 />
//                                 {/* Show product suggestions only for the productCode field */}
//                                 {key === 'productCode' && showProductSuggestions && productSuggestions.length > 0 && (
//                                     <ul className="suggestions-dropdown">
//                                         {productSuggestions.map((product) => (
//                                             <li
//                                                 key={product.productId}
//                                                 onClick={() => handleProductSelect(product)}
//                                             >
//                                                 {product.productName} ({product.productCode})
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                     <div className="form-actions">
//                         <button type="button" className="btn btn-danger" onClick={closeModal}>
//                             Cancel
//                         </button>
//                         <button type="submit" className="btn btn-primary">
//                             Save
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CostingModal;

import React, { useState, useEffect } from 'react';
import './CostingModal.css';
import config from '../../config';
import axios from 'axios';

const CostingModal = ({ showModal, closeModal, formData, onChange, onSubmit }) => {
    const [localFormData, setLocalFormData] = useState(formData);
    const [productCode, setProductCode] = useState('');
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

    useEffect(() => {
        if (showModal) {
            setLocalFormData(formData);
            setProductCode(formData.productCode || '');
        }
    }, [showModal, formData]);

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
            console.log('Customer Details Response:', response.data); // Debugging line
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
    

    const handleCustomerNameChange = (e) => {
        const value = e.target.value;
        setCustomerName(value);

        if (value.length > 2) {
            fetchCustomerSuggestions(value);
        } else {
            setCustomerSuggestions([]);
            setShowCustomerSuggestions(false);
        }
    };

    const handleCustomerSelect = (customer) => {
        setCustomerName(customer.cusName);
        setLocalFormData((prevData) => ({
            ...prevData,
            cusId: customer.cusId,
        }));
        setCustomerSuggestions([]);
        setShowCustomerSuggestions(false);
        fetchCustomerDetails(customer.cusName); // Fetch customer details when a customer is selected
    };

    const handleProductSelect = (product) => {
        setProductCode(product.productName); // Changed from productCode to productName
        setLocalFormData((prevData) => ({
            ...prevData,
            productCode: product.productName, // Changed from productCode to productName
            warranty: product.productWarranty,
            description: product.productDescription,
        }));
        setProductSuggestions([]);
        setShowProductSuggestions(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'productCode') {
            setProductCode(value);
            if (value.length > 2) {
                fetchProductSuggestions(value);
            } else {
                setProductSuggestions([]);
                setShowProductSuggestions(false);
            }
            return;
        }

        const updatedData = { ...localFormData, [name]: value };

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
    
        setLocalFormData(updatedData);
        onChange(updatedData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...localFormData, productCode, customerName, cusId: localFormData.cusId });
        closeModal();
    };

    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-centered">
                <h4>Add/Edit Costing Entry</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {/* Customer Name Input with Suggestions */}
                        <div className="form-group">
                            <label htmlFor="customerName">Customer Name</label>
                            <input
                                type="text"
                                name="customerName"
                                id="customerName"
                                className="form-control"
                                value={customerName}
                                onChange={handleCustomerNameChange}
                                autoComplete="off"
                            />
                            {showCustomerSuggestions && customerSuggestions.length > 0 && (
                                <ul className="suggestions-dropdown">
                                    {customerSuggestions.map((customer) => (
                                        <li
                                            key={customer.cusId}
                                            onClick={() => handleCustomerSelect(customer)}
                                        >
                                            {customer.cusName} ({customer.cusCode})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Read-only Customer Details Fields */}
                        <div className="form-group">
                            <label htmlFor="cusJob">Customer Job Position</label>
                            <input
                                type="text"
                                name="cusJob"
                                id="cusJob"
                                className="form-control bg-warning"
                                value={customerDetails.cusJob}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cusOffice">Customer Company</label>
                            <input
                                type="text"
                                name="cusOffice"
                                id="cusOffice"
                                className="form-control bg-warning"
                                value={customerDetails.cusOffice}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cusAddress">Customer Address</label>
                            <input
                                type="text"
                                name="cusAddress"
                                id="cusAddress"
                                className="form-control bg-warning"
                                value={customerDetails.cusAddress}
                                readOnly
                            />
                        </div>

                       {/* First render descriptionCustomer */}
<div className="form-group">
    <label htmlFor="descriptionCustomer">Customer Product Description</label>
    <input
        type="text"
        name="descriptionCustomer"
        id="descriptionCustomer"
        className="form-control"
        value={localFormData.descriptionCustomer || ''}
        onChange={handleInputChange}
    />
</div>

{/* Product search field */}
<div className="form-group">
    <label htmlFor="productSearch">Product</label>
    <input
        type="text"
        name="productSearch"
        id="productSearch"
        className="form-control"
        value={productCode}
        onChange={(e) => {
            const value = e.target.value;
            setProductCode(value);
            if (value.length > 2) {
                fetchProductSuggestions(value);
            } else {
                setProductSuggestions([]);
                setShowProductSuggestions(false);
            }
        }}
        autoComplete="off"
    />
    {showProductSuggestions && productSuggestions.length > 0 && (
        <ul className="suggestions-dropdown">
            {productSuggestions.map((product) => (
                <li
                    key={product.productId}
                    onClick={() => handleProductSelect(product)}
                >
                    {product.productName}
                </li>
            ))}
        </ul>
    )}
</div>

{/* Then render remaining fields */}
{Object.keys(localFormData)
    .filter(key => !['cusId', 'descriptionCustomer', 'productCode'].includes(key))
    .map((key) => (
        <div
            className="form-group"
            key={key}
        >
            <label htmlFor={key} className="text-capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
                type="text"
                name={key}
                id={key}
                className={`form-control ${
                    key.includes('Value') || key.includes('Price') || key === 'profit'
                        ? 'bg-warning'
                        : ''
                }`}
                value={localFormData[key]}
                onChange={handleInputChange}
                readOnly={key.includes('Value') || key.includes('Price') || key === 'profit'}
            />
        </div>
    ))}
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-danger" onClick={closeModal}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CostingModal;
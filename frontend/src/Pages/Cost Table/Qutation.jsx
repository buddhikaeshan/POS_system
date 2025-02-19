// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import config from '../../config';
// import { useNavigate } from 'react-router';
// import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
// import './Qutation.css'

// function Qutation() {
//   const [costings, setCostings] = useState([]); // Store the fetched data
//   const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows

//   const navigate = useNavigate();

//   const handleViewClick = (id) => {
//     navigate(`/qutation-invoice/${id}`);  // Pass header.id as URL parameter
//   };

//   // Fetch data from the backend
//   useEffect(() => {
//     axios.get(`${config.BASE_URL}/costings`)
//       .then(response => {
//         setCostings(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching costings:', error);
//       });
//   }, []);

//   // Toggle row expansion
//   const toggleRow = (id) => {
//     setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   return (
//     <div className="mt-3 container-fluid">
//       <div className="d-flex justify-content-between align-items-center">
//         <h1>Costing Data</h1>
//         <button
//           className="btn btn-warning"
//           onClick={() => navigate('/costing-table')}
//         >
//           Create Quotation +
//         </button>
//       </div>

//       <div style={{ borderRadius: "5px"}}>
//         <table className="mt-4 table table-bordered table-dark  table-striped ">
//           <thead>
//             <tr>
//               <th>Quote No</th>
//               <th>Total Amount</th>
//               <th>Total Profit</th>
//               <th>Prepared By</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {costings.map(header => (
//               <React.Fragment key={header.id}>
//                 {/* Costing Header Row */}
//                 <tr>
//                   <td>{header.id}</td>
//                   <td>Rs. {header.total_amount}</td>
//                   <td>Rs. {header.total_profit}</td>
//                   <td>{header.preparedBy}</td>
//                   <td style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <button
//                       className="btn btn-primary btn-sm"
//                       onClick={() => toggleRow(header.id)}
//                       style={{ marginRight: '8px' }} // Adds space between buttons
//                     >
//                       {expandedRows[header.id] ? (
//                         <>
//                           <ChevronUp />
//                         </>
//                       ) : (
//                         <>
//                           <ChevronDown />
//                         </>
//                       )}
//                     </button>
//                     <button className="btn btn-success" onClick={() => handleViewClick(header.id)}>
//                       <Eye />
//                     </button>
//                   </td>

//                 </tr>
//                 {/* Costing Details (Visible when expanded) */}
//                 {expandedRows[header.id] && (
//                   <tr>
//                     <td colSpan="4">
//                       <table className="table table-sm table-striped">
//                         <thead>
//                           <tr>
//                             <th>S/N</th>
//                             <th>Customer Product Description</th>
//                             <th>Product Code</th>
//                             <th>Description</th>
//                             <th>Warranty</th>
//                             <th>Supplier</th>
//                             <th>Unit Cost</th>
//                             <th>Our Margin %</th>
//                             <th>Our Margin Value</th>
//                             <th>Price + Margin</th>
//                             <th>Selling Rate Before Discount</th>
//                             <th>Selling Rate Before Discount Rounded To Near 10</th>
//                             <th>UOM</th>
//                             <th>Qty</th>
//                             <th>Unit Price</th>
//                             <th>Discount %</th>
//                             <th>Discount Value</th>
//                             <th>Discounted Price</th>
//                             <th>Amount</th>
//                             <th>Profit</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {header.CostingDetails.map(detail => (
//                             <tr key={detail.id}>
//                               <td>{detail.id}</td>
//                               <td>{detail.description_customer}</td>
//                               <td>{detail.product_code}</td>
//                               <td>{detail.description}</td>
//                               <td>{detail.warranty}</td>
//                               <td>{detail.supplier}</td>
//                               <td>Rs. {detail.unit_cost}</td>
//                               <td>{detail.our_margin_percentage}%</td>
//                               <td>Rs. {detail.our_margin_value}</td>
//                               <td>Rs. {detail.price_plus_margin}</td>
//                               <td>Rs. {detail.selling_rate}</td>
//                               <td>Rs. {detail.selling_rate_rounded}</td>
//                               <td>{detail.uom}</td>
//                               <td>{detail.qty}</td>
//                               <td>Rs. {detail.unit_price}</td>
//                               <td>{detail.discount_percentage}%</td>
//                               <td>Rs. {detail.discount_value}</td>
//                               <td>Rs. {detail.discounted_price}</td>
//                               <td>Rs. {detail.amount}</td>
//                               <td>Rs. {detail.profit}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>

//       </div>
//     </div>
//   );
// }

// export default Qutation;



// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import config from "../../config";
// import { useNavigate } from "react-router";
// import { ChevronDown, ChevronUp, Eye, Edit, Save } from "lucide-react";
// import "./Qutation.css";

// function Qutation() {
//   const [costings, setCostings] = useState([]);
//   const [expandedRows, setExpandedRows] = useState({});
//   const [editingRow, setEditingRow] = useState(null);
//   const [editedPreparedBy, setEditedPreparedBy] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`${config.BASE_URL}/costings`)
//       .then((response) => {
//         setCostings(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching costings:", error);
//       });
//   }, []);

//   const toggleRow = (id) => {
//     setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleEditClick = (id, currentValue) => {
//     setEditingRow(id);
//     setEditedPreparedBy(currentValue);
//   };

//   const handleSaveClick = (id) => {
//     axios
//       .put(`${config.BASE_URL}/costings/${id}/prepared-by`, {
//         preparedBy: editedPreparedBy,
//       })
//       .then((response) => {
//         setCostings((prev) =>
//           prev.map((item) =>
//             item.id === id ? { ...item, preparedBy: editedPreparedBy } : item
//           )
//         );
//         setEditingRow(null);
//       })
//       .catch((error) => {
//         console.error("Error updating preparedBy:", error);
//       });
//   };

//   return (
//     <div className="mt-3 container-fluid">
//       <div className="d-flex justify-content-between align-items-center">
//         <h1>Costing Data</h1>
//         <button className="btn btn-warning" onClick={() => navigate("/costing-table")}>
//           Create Quotation +
//         </button>
//       </div>

//       <div style={{ borderRadius: "5px" }}>
//         <table className="mt-4 table table-bordered table-dark table-striped">
//           <thead>
//             <tr>
//               <th>Quote No</th>
//               <th>Total Amount</th>
//               <th>Total Profit</th>
//               <th>Prepared By</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {costings.map((header) => (
//               <React.Fragment key={header.id}>
//                 <tr>
//                   <td>{header.id}</td>
//                   <td>Rs. {header.total_amount}</td>
//                   <td>Rs. {header.total_profit}</td>
//                   <td>
//                     {editingRow === header.id ? (
//                       <input
//                         type="text"
//                         value={editedPreparedBy}
//                         onChange={(e) => setEditedPreparedBy(e.target.value)}
//                         className="form-control form-control-sm"
//                         style={{ width: "150px", display: "inline-block" }}
//                       />
//                     ) : (
//                       header.preparedBy
//                     )}
//                   </td>
//                   <td>
//                     {editingRow === header.id ? (
//                       <button className="btn btn-success btn-sm" onClick={() => handleSaveClick(header.id)}>
//                         <Save size={16} />
//                       </button>
//                     ) : (
//                       <button className="btn btn-secondary btn-sm" onClick={() => handleEditClick(header.id, header.preparedBy)}>
//                         <Edit size={16} />
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Qutation;



//---------------------------------------------------------------------------------------------------------------------------


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import config from "../../config";
// import { useNavigate } from "react-router";
// import { ChevronDown, ChevronUp, Eye, Edit, Save } from "lucide-react";
// import "./Qutation.css";

// function Qutation() {
//   const [costings, setCostings] = useState([]);
//   const [expandedRows, setExpandedRows] = useState({});
//   const [editingRow, setEditingRow] = useState(null);
//   const [editedPreparedBy, setEditedPreparedBy] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`${config.BASE_URL}/costings`)
//       .then((response) => {
//         setCostings(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching costings:", error);
//       });
//   }, []);

//   const toggleRow = (id) => {
//     setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleViewClick = (id) => {
//     navigate(`/qutation-invoice/${id}`);
//   };

//   const handleEditClick = (id, currentValue) => {
//     setEditingRow(id);
//     setEditedPreparedBy(currentValue);
//   };

//   const handleSaveClick = (id) => {
//     axios
//       .put(`${config.BASE_URL}/costings/${id}/prepared-by`, {
//         preparedBy: editedPreparedBy,
//       })
//       .then((response) => {
//         setCostings((prev) =>
//           prev.map((item) =>
//             item.id === id ? { ...item, preparedBy: editedPreparedBy } : item
//           )
//         );
//         setEditingRow(null);
//       })
//       .catch((error) => {
//         console.error("Error updating preparedBy:", error);
//       });
//   };

//   return (
//     <div className="mt-3 container-fluid">
//       <div className="d-flex justify-content-between align-items-center">
//         <h1>Costing Data</h1>
//         <button className="btn btn-warning" onClick={() => navigate("/costing-table")}>
//           Create Quotation +
//         </button>
//       </div>

//       <div style={{ borderRadius: "5px" }}>
//         <table className="mt-4 table table-bordered table-dark table-striped">
//           <thead>
//             <tr>
//               <th>Quote No</th>
//               <th>Total Amount</th>
//               <th>Total Profit</th>
//               <th>Prepared By</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {costings.map((header) => (
//               <React.Fragment key={header.id}>
//                 <tr>
//                   <td>{header.id}</td>
//                   <td>Rs. {header.total_amount}</td>
//                   <td>Rs. {header.total_profit}</td>
//                   <td>
//                     {editingRow === header.id ? (
//                       <input
//                         type="text"
//                         value={editedPreparedBy}
//                         onChange={(e) => setEditedPreparedBy(e.target.value)}
//                         className="form-control form-control-sm"
//                         style={{ width: "150px", display: "inline-block" }}
//                       />
//                     ) : (
//                       header.preparedBy
//                     )}
//                   </td>
//                   <td style={{ display: 'flex', gap: '8px' }}>



//                     {editingRow === header.id ? (
//                       <button 
//                         className="btn btn-success btn-sm"
//                         onClick={() => handleSaveClick(header.id)}
//                       >
//                         <Save size={16} />
//                       </button>
//                     ) : (
//                       <button 
//                         className="btn btn-secondary btn-sm"
//                         onClick={() => handleEditClick(header.id, header.preparedBy)}
//                       >
//                         <Edit size={16} />
//                       </button>
//                     )}


//                     <button 
//                       className="btn btn-warning btn-sm"
//                       onClick={() => handleViewClick(header.id)}
//                     >
//                       <Eye size={16} />
//                     </button>




//                     <button
//                       className="btn btn-primary btn-sm"
//                       onClick={() => toggleRow(header.id)}
//                     >
//                       {expandedRows[header.id] ? (
//                         <ChevronUp size={16} />
//                       ) : (
//                         <ChevronDown size={16} />
//                       )}
//                     </button>


//                   </td>
//                 </tr>
//                 {/* Expanded Details Row */}
//                 {expandedRows[header.id] && (
//                   <tr>
//                     <td colSpan="5">
//                       <table className="table table-sm table-striped">
//                         <thead>
//                           <tr>
//                             <th>S/N</th>
//                             <th>Customer Product Description</th>
//                             <th>Product Code</th>
//                             <th>Description</th>
//                             <th>Warranty</th>
//                             <th>Supplier</th>
//                             <th>Unit Cost</th>
//                             <th>Our Margin %</th>
//                             <th>Our Margin Value</th>
//                             <th>Price + Margin</th>
//                             <th>Selling Rate Before Discount</th>
//                             <th>Selling Rate Before Discount Rounded To Near 10</th>
//                             <th>UOM</th>
//                             <th>Qty</th>
//                             <th>Unit Price</th>
//                             <th>Discount %</th>
//                             <th>Discount Value</th>
//                             <th>Discounted Price</th>
//                             <th>Amount</th>
//                             <th>Profit</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {header.CostingDetails.map(detail => (
//                             <tr key={detail.id}>
//                               <td>{detail.id}</td>
//                               <td>{detail.description_customer}</td>
//                               <td>{detail.product_code}</td>
//                               <td>{detail.description}</td>
//                               <td>{detail.warranty}</td>
//                               <td>{detail.supplier}</td>
//                               <td>Rs. {detail.unit_cost}</td>
//                               <td>{detail.our_margin_percentage}%</td>
//                               <td>Rs. {detail.our_margin_value}</td>
//                               <td>Rs. {detail.price_plus_margin}</td>
//                               <td>Rs. {detail.selling_rate}</td>
//                               <td>Rs. {detail.selling_rate_rounded}</td>
//                               <td>{detail.uom}</td>
//                               <td>{detail.qty}</td>
//                               <td>Rs. {detail.unit_price}</td>
//                               <td>{detail.discount_percentage}%</td>
//                               <td>Rs. {detail.discount_value}</td>
//                               <td>Rs. {detail.discounted_price}</td>
//                               <td>Rs. {detail.amount}</td>
//                               <td>Rs. {detail.profit}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Qutation;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import config from "../../config";
// import { useNavigate } from "react-router";
// import { ChevronDown, ChevronUp, Eye, Edit, Save, Trash2 } from "lucide-react";
// import "./Qutation.css";

// function Qutation() {
//   const [costings, setCostings] = useState([]);
//   const [expandedRows, setExpandedRows] = useState({});
//   const [editingRow, setEditingRow] = useState(null);
//   const [editedPreparedBy, setEditedPreparedBy] = useState("");
//   const [editingDetail, setEditingDetail] = useState(null);
//   const [editedDetailData, setEditedDetailData] = useState({});

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCostings();
//   }, []);

//   const fetchCostings = () => {
//     axios
//       .get(`${config.BASE_URL}/costings`)
//       .then((response) => {
//         setCostings(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching costings:", error);
//       });
//   };

//   const toggleRow = (id) => {
//     setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleViewClick = (id) => {
//     navigate(`/qutation-invoice/${id}`);
//   };

//   // const handleEditClick = (id, currentValue) => {
//   //   setEditingRow(id);
//   //   setEditedPreparedBy(currentValue);
//   // };

//   const handleEditClick = (id) => {
//     navigate(`/costing-table/edit/${id}`);
//   };

//   const handleSaveClick = (id) => {
//     axios
//       .put(`${config.BASE_URL}/costings/${id}/prepared-by`, {
//         preparedBy: editedPreparedBy,
//       })
//       .then(() => {
//         setCostings((prev) =>
//           prev.map((item) =>
//             item.id === id ? { ...item, preparedBy: editedPreparedBy } : item
//           )
//         );
//         setEditingRow(null);
//       })
//       .catch((error) => {
//         console.error("Error updating preparedBy:", error);
//       });
//   };

//   const handleEditDetailClick = (detail) => {
//     setEditingDetail(detail.id);
//     setEditedDetailData(detail);
//   };

//   const handleDetailInputChange = (field, value) => {
//     setEditedDetailData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSaveDetailClick = async (headerId, detailId) => {
//     try {
//       await axios.put(`${config.BASE_URL}/costings/${headerId}/details/${detailId}`, editedDetailData);
//       fetchCostings();
//       setEditingDetail(null);
//       setEditedDetailData({});
//     } catch (error) {
//       console.error("Error updating detail:", error);
//     }
//   };

//   const handleDeleteDetail = async (headerId, detailId) => {
//     if (window.confirm("Are you sure you want to delete this item?")) {
//       try {
//         await axios.delete(`${config.BASE_URL}/costings/${headerId}/details/${detailId}`);
//         fetchCostings();
//       } catch (error) {
//         console.error("Error deleting detail:", error);
//       }
//     }
//   };

//   const renderEditableCell = (detail, field, type = "text") => {
//     if (editingDetail === detail.id) {
//       return (
//         <input
//           type={type}
//           value={editedDetailData[field] || ""}
//           onChange={(e) => handleDetailInputChange(field, e.target.value)}
//           className="form-control form-control-sm"
//         />
//       );
//     }
//     return detail[field];
//   };

//   return (
//     <div className="mt-3 container-fluid">
//       <div className="d-flex justify-content-between align-items-center">
//         <h1>Quotation</h1>
//         <button className="btn btn-warning" onClick={() => navigate("/costing-table")}>
//           Create Quotation +
//         </button>
//       </div>

//       <div style={{ borderRadius: "5px" }}>
//         <table className="mt-4 table table-bordered table-dark table-striped">
//           <thead>
//             <tr>
//               <th>Quote No</th>
//               <th>Total Amount</th>
//               <th>Total Profit</th>
//               <th>Prepared By</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {costings.map((header) => (
//               <React.Fragment key={header.id}>
//                 <tr>
//                   <td>{header.id}</td>
//                   <td>Rs. {header.total_amount}</td>
//                   <td>Rs. {header.total_profit}</td>
//                   {/* <td>
//                     {editingRow === header.id ? (
//                       <input
//                         type="text"
//                         value={editedPreparedBy}
//                         onChange={(e) => setEditedPreparedBy(e.target.value)}
//                         className="form-control form-control-sm"
//                       />
//                     ) : (
//                       header.preparedBy
//                     )}
//                   </td>
//                   <td className="d-flex gap-2">
//                     {editingRow === header.id ? (
//                       <button 
//                         className="btn btn-success btn-sm"
//                         onClick={() => handleSaveClick(header.id)}
//                       >
//                         <Save size={16} />
//                       </button>
//                     ) : (
//                       <button 
//                         className="btn btn-warning btn-sm"
//                         onClick={() => handleEditClick(header.id, header.preparedBy)}
//                       >
//                         <Edit size={16} />
//                       </button>
//                     )}
//                     <button 
//                       className="btn btn-primary btn-sm"
//                       onClick={() => handleViewClick(header.id)}
//                     >
//                       <Eye size={16} />
//                     </button>
//                     <button
//                       className="btn btn-success btn-sm"
//                       onClick={() => toggleRow(header.id)}
//                     >
//                       {expandedRows[header.id] ? (
//                         <ChevronUp size={16} />
//                       ) : (
//                         <ChevronDown size={16} />
//                       )}
//                     </button>
//                   </td> */}
// <td>{header.preparedBy}</td>
//                   <td className="d-flex gap-2">
//                     <button 
//                       className="btn btn-warning btn-sm"
//                       onClick={() => handleEditClick(header.id)}
//                     >
//                       <Edit size={16} />
//                     </button>
//                     <button 
//                       className="btn btn-primary btn-sm"
//                       onClick={() => handleViewClick(header.id)}
//                     >
//                       <Eye size={16} />
//                     </button>
//                     <button
//                       className="btn btn-success btn-sm"
//                       onClick={() => toggleRow(header.id)}
//                     >
//                       {expandedRows[header.id] ? (
//                         <ChevronUp size={16} />
//                       ) : (
//                         <ChevronDown size={16} />
//                       )}
//                     </button>
//                   </td>

//                 </tr>
//                 {expandedRows[header.id] && (
//                   <tr>
//                     <td colSpan="5">
//                       <div className="table-responsive">
//                         <table className="table table-sm table-striped">
//                           <thead>
//                             <tr>

//                               <th>S/N</th>
//                               <th>Customer Description</th>
//                               <th>Product Code</th>
//                               <th>Description</th>
//                               <th>Warranty</th>
//                               <th>Supplier</th>
//                               <th>Unit Cost</th>
//                               <th>Our Margin %</th>
//                               <th>Our Margin Value</th>
//                               <th>Price + Margin</th>
//                               <th>Selling Rate</th>
//                               <th>Selling Rate Rounded</th>
//                               <th>UOM</th>
//                               <th>Qty</th>
//                               <th>Unit Price</th>
//                               <th>Discount %</th>
//                               <th>Discount Value</th>
//                               <th>Discounted Price</th>
//                               <th>Amount</th>
//                               <th>Profit</th>
//                               <th>Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {header.CostingDetails.map(detail => (
//                               <tr key={detail.id}>

//                                 <td>{detail.id}</td>
//                                 <td>{renderEditableCell(detail, 'description_customer')}</td>
//                                 <td>{renderEditableCell(detail, 'product_code')}</td>
//                                 <td>{renderEditableCell(detail, 'description')}</td>
//                                 <td>{renderEditableCell(detail, 'warranty')}</td>
//                                 <td>{renderEditableCell(detail, 'supplier')}</td>
//                                 <td>{renderEditableCell(detail, 'unit_cost', 'number')}</td>
//                                 <td>{renderEditableCell(detail, 'our_margin_percentage', 'number')}</td>
//                                 <td>{renderEditableCell(detail, 'our_margin_value', 'number')}</td>
//                                 <td>{renderEditableCell(detail, 'price_plus_margin', 'number')}</td>
//                                 <td>{renderEditableCell(detail, 'selling_rate', 'number')}</td>
//                                 <td>{renderEditableCell(detail, 'selling_rate_rounded', 'number')}</td>
//                                 <td>{renderEditableCell(detail, 'uom')}</td>
//                                 <td>{renderEditableCell(detail, 'qty', 'number')}</td>
//                                 <td>{renderEditableCell(detail, 'unit_price', 'number')}</td>
//                                 <td>{renderEditableCell(detail, 'discount_percentage', 'number')}</td>
//                                 <td>{renderEditableCell(detail, 'discount_value', 'number')}</td>
//                                 <td>{renderEditableCell(detail, 'discounted_price', 'number')}</td>
//                                 <td>{renderEditableCell(detail, 'amount', 'number')}</td>
//                                 <td>{renderEditableCell(detail, 'profit', 'number')}</td>

//                                 <td>
//                                   {editingDetail === detail.id ? (
//                                     <button
//                                       className="btn btn-success btn-sm"
//                                       onClick={() => handleSaveDetailClick(header.id, detail.id)}
//                                     >
//                                       <Save size={16} />
//                                     </button>
//                                   ) : (
//                                     <div className="d-flex gap-2">
//                                       <button
//                                         className="btn btn-secondary btn-sm"
//                                         onClick={() => handleEditDetailClick(detail)}
//                                       >
//                                         <Edit size={16} />
//                                       </button>
//                                       <button
//                                         className="btn btn-danger btn-sm"
//                                         onClick={() => handleDeleteDetail(header.id, detail.id)}
//                                       >
//                                         <Trash2 size={16} />
//                                       </button>
//                                     </div>
//                                   )}
//                                 </td>


//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Qutation;





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import config from "../../config";
// import { useNavigate } from "react-router";
// import { ChevronDown, ChevronUp, Eye, Edit, Save, Trash2 } from "lucide-react";
// import "./Qutation.css";

// function Qutation() {
//     const [costings, setCostings] = useState([]);
//     const [expandedRows, setExpandedRows] = useState({});

//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchCostings();
//     }, []);

//     const fetchCostings = () => {
//         axios
//             .get(`${config.BASE_URL}/costings`)
//             .then((response) => {
//                 setCostings(response.data);
//             })
//             .catch((error) => {
//                 console.error("Error fetching costings:", error);
//             });
//     };

//     const toggleRow = (id) => {
//         setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
//     };

//     const handleViewClick = (id) => {
//         navigate(`/qutation-invoice/${id}`);
//     };

//     const handleEditClick = (id) => {
//       navigate(`/costing-table/edit/${id}`);
//   };

//           const handleDeleteDetail = async (headerId, detailId) => {
//     if (window.confirm("Are you sure you want to delete this item?")) {
//       try {
//         await axios.delete(`${config.BASE_URL}/costings/${headerId}/details/${detailId}`);
//         fetchCostings();
//       } catch (error) {
//         console.error("Error deleting detail:", error);
//       }
//     }
//   };

//     return (
//         <div className="mt-3 container-fluid">
//             <div className="d-flex justify-content-between align-items-center">
//                 <h1>Quotation</h1>
//                 <button className="btn btn-warning" onClick={() => navigate("/costing-table")}>
//                     Create Quotation +
//                 </button>
//             </div>

//             <div style={{ borderRadius: "5px" }}>
//                 <table className="mt-4 table table-bordered table-dark table-striped">
//                     <thead>
//                         <tr>
//                             <th>Quote No</th>
//                             <th>Total Amount</th>
//                             <th>Total Profit</th>
//                             <th>Prepared By</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {costings.map((header) => (
//                             <React.Fragment key={header.id}>
//                                 <tr>
//                                     <td>{header.id}</td>
//                                     <td>Rs. {header.total_amount}</td>
//                                     <td>Rs. {header.total_profit}</td>
//                                     <td>{header.preparedBy}</td>
//                                     <td className="d-flex gap-2">
//                                         <button 
//                                             className="btn btn-warning btn-sm"
//                                             onClick={() => handleEditClick(header.id)}
//                                         >
//                                             <Edit size={16} />
//                                         </button>
//                                         <button 
//                                             className="btn btn-primary btn-sm"
//                                             onClick={() => handleViewClick(header.id)}
//                                         >
//                                             <Eye size={16} />
//                                         </button>
//                                         <button
//                                             className="btn btn-success btn-sm"
//                                             onClick={() => toggleRow(header.id)}
//                                         >
//                                             {expandedRows[header.id] ? (
//                                                 <ChevronUp size={16} />
//                                             ) : (
//                                                 <ChevronDown size={16} />
//                                             )}
//                                         </button>
//                                     </td>
//                                 </tr>
//                                 {expandedRows[header.id] && (
//                                     <tr>
//                                         <td colSpan="5">
//                                             <div className="table-responsive">
//                                                 <table className="table table-sm table-striped">
//                                                     <thead>
//                                                         <tr>
//                                                             <th>S/N</th>
//                                                             <th>Customer Description</th>
//                                                             <th>Product Code</th>
//                                                             <th>Description</th>
//                                                             <th>Warranty</th>
//                                                             <th>Supplier</th>
//                                                             <th>Unit Cost</th>
//                                                             <th>Our Margin %</th>
//                                                             <th>Our Margin Value</th>
//                                                             <th>Price + Margin</th>
//                                                             <th>Selling Rate</th>
//                                                             <th>Selling Rate Rounded</th>
//                                                             <th>UOM</th>
//                                                             <th>Qty</th>
//                                                             <th>Unit Price</th>
//                                                             <th>Discount %</th>
//                                                             <th>Discount Value</th>
//                                                             <th>Discounted Price</th>
//                                                             <th>Amount</th>
//                                                             <th>Profit</th>
//                                                             <th>Actions</th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {header.CostingDetails.map(detail => (
//                                                             <tr key={detail.id}>
//                                                                 <td>{detail.id}</td>
//                                                                 <td>{detail.description_customer}</td>
//                                                                 <td>{detail.product_code}</td>
//                                                                 <td>{detail.description}</td>
//                                                                 <td>{detail.warranty}</td>
//                                                                 <td>{detail.supplier}</td>
//                                                                 <td>{detail.unit_cost}</td>
//                                                                 <td>{detail.our_margin_percentage}</td>
//                                                                 <td>{detail.our_margin_value}</td>
//                                                                 <td>{detail.price_plus_margin}</td>
//                                                                 <td>{detail.selling_rate}</td>
//                                                                 <td>{detail.selling_rate_rounded}</td>
//                                                                 <td>{detail.uom}</td>
//                                                                 <td>{detail.qty}</td>
//                                                                 <td>{detail.unit_price}</td>
//                                                                 <td>{detail.discount_percentage}</td>
//                                                                 <td>{detail.discount_value}</td>
//                                                                 <td>{detail.discounted_price}</td>
//                                                                 <td>{detail.amount}</td>
//                                                                 <td>{detail.profit}</td>
//                                                                 <td>
//                                                                     {/* <div className="d-flex gap-2">
//                                                                         <button
//                                                                             className="btn btn-secondary btn-sm"
//                                                                             onClick={() => handleEditDetailClick(detail)}
//                                                                         >
//                                                                             <Edit size={16} />
//                                                                         </button>
//                                                                         <button
//                                                                             className="btn btn-danger btn-sm"
//                                                                             onClick={() => handleDeleteDetail(header.id, detail.id)}
//                                                                         >
//                                                                             <Trash2 size={16} />
//                                                                         </button>
//                                                                     </div> */}
//                                                                 </td>
//                                                             </tr>
//                                                         ))}
//                                                     </tbody>
//                                                 </table>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </React.Fragment>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// export default Qutation;

import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { useNavigate } from "react-router";
import { ChevronDown, ChevronUp, Eye, Edit, Save, Trash2 } from "lucide-react";
import "./Qutation.css";

function Qutation() {
  const [costings, setCostings] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [showDraft, setShowDraft] = useState(true);
  const [showQuotations, setShowQuotations] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCostings();
  }, [showDraft, showQuotations]);

  const fetchCostings = () => {
    let url = `${config.BASE_URL}/costings`;
    if (showDraft && !showQuotations) {
      url += "?status=draft";
    } else if (!showDraft && showQuotations) {
      url += "?status!=draft";
    }

    axios
      .get(url)
      .then((response) => {
        setCostings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching costings:", error);
      });
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleViewClick = (id) => {
    navigate(`/qutation-invoice/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/costing-table/edit/${id}`);
  };

  const handleDeleteDetail = async (headerId, detailId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${config.BASE_URL}/costings/${headerId}/details/${detailId}`);
        fetchCostings();
      } catch (error) {
        console.error("Error deleting detail:", error);
      }
    }
  };

  const handleDelete= async (headerId) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await axios.delete(`${config.BASE_URL}/costing/${headerId}`);
        fetchCostings();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const filteredCostings = costings.filter((header) => {
    if (showDraft && showQuotations) {
      return true;
    } else if (showDraft) {
      return header.status === 'draft';
    } else if (showQuotations) {
      return header.status !== 'draft';
    }
    return false;
  });

  return (
    <div className="mt-3 container-fluid">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Quotation</h2>
        <button className="btn btn-warning" onClick={() => navigate("/costing-table")}>
          Create Quotation +
        </button>
      </div>

      {/* <div className="d-flex justify-content-end mb-3">
                
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="showDraft"
                        checked={showDraft}
                        onChange={(e) => setShowDraft(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="showDraft">
                    Quotations
                    </label>
                </div>

                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="showQuotations"
                        checked={showQuotations}
                        onChange={(e) => setShowQuotations(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="showQuotations">
                        Draft
                    </label>
                </div>


            </div> */}

      <div style={{ borderRadius: "5px" }}>
        <table className="mt-4 table table-bordered table-dark table-striped">
          <thead>
            <tr>
              <th>Quote No</th>
              <th>Total Amount</th>
              <th>Total Profit</th>
              <th>Prepared By</th>
              <th>View</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCostings.map((header) => (
              <React.Fragment key={header.id}>
                <tr>
                  <td>{header.id}</td>
                  <td>Rs. {header.total_amount}</td>
                  <td>Rs. {header.total_profit}</td>
                  <td>{header.preparedBy}</td>
                  <td> <button
                    className="btn btn-primary btn-sm "
                    onClick={() => handleViewClick(header.id)}
                  >
                    <Eye size={16} />
                  </button>
                  </td>
                  <td className="d-flex gap-2">

                  <button
                      className="btn btn-success btn-sm"
                      onClick={() => toggleRow(header.id)}
                    >
                      {expandedRows[header.id] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>


                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditClick(header.id)}
                    >
                      <Edit size={16} />
                    </button>

                   

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(header.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                {expandedRows[header.id] && (
                  <tr>
                    <td colSpan="6">
                      <div className="table-responsive">
                        <table className="table table-sm table-striped">
                          <thead>
                            <tr>
                              <th>S/N</th>
                              <th>Customer Description</th>
                              <th>Product Code</th>
                              <th>Description</th>
                              <th>Warranty</th>
                              <th>Supplier</th>
                              <th>Unit Cost</th>
                              <th>Our Margin %</th>
                              <th>Our Margin Value</th>
                              <th>Price + Margin</th>
                              <th>Selling Rate</th>
                              <th>Selling Rate Rounded</th>
                              <th>UOM</th>
                              <th>Qty</th>
                              <th>Unit Price</th>
                              <th>Discount %</th>
                              <th>Discount Value</th>
                              <th>Discounted Price</th>
                              <th>Amount</th>
                              <th>Profit</th>
                              <th></th>
                              {/* <th>Actions</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {header.CostingDetails.map(detail => (
                              <tr key={detail.id}>
                                <td>{detail.id}</td>
                                <td>{detail.description_customer}</td>
                                <td>{detail.product_code}</td>
                                <td>{detail.description}</td>
                                <td>{detail.warranty}</td>
                                <td>{detail.supplier}</td>
                                <td>{detail.unit_cost}</td>
                                <td>{detail.our_margin_percentage}</td>
                                <td>{detail.our_margin_value}</td>
                                <td>{detail.price_plus_margin}</td>
                                <td>{detail.selling_rate}</td>
                                <td>{detail.selling_rate_rounded}</td>
                                <td>{detail.uom}</td>
                                <td>{detail.qty}</td>
                                <td>{detail.unit_price}</td>
                                <td>{detail.discount_percentage}</td>
                                <td>{detail.discount_value}</td>
                                <td>{detail.discounted_price}</td>
                                <td>{detail.amount}</td>
                                <td>{detail.profit}</td>
                                <td>
                                  {/* <div className="d-flex gap-2">
                                                                        <button
                                                                            className="btn btn-secondary btn-sm"
                                                                            onClick={() => handleEditDetailClick(detail)}
                                                                        >
                                                                            <Edit size={16} />
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-danger btn-sm"
                                                                            onClick={() => handleDeleteDetail(header.id, detail.id)}
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div> */}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Qutation;
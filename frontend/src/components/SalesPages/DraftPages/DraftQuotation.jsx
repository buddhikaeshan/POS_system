import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router";
import { ChevronDown, ChevronUp, Eye, Edit, Save, Trash2 } from "lucide-react";
import "../../../Pages/Cost Table/Qutation.css";
import config from "../../../config";

function DraftQuotaion() {
    const [costings, setCostings] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [showDraft, setShowDraft] = useState(false);
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


    return (
        <div className="mt-3 container-fluid">
            <div className="d-flex justify-content-between align-items-center">
                <h2>Draft Quotation</h2>
                <button className="btn btn-warning" onClick={() => navigate("/costing-table")}>
                    Create New Quotation +
                </button>
            </div>

            <div className="d-flex justify-content-end mb-3">
                
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


            </div>

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

export default DraftQuotaion;
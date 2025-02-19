import React from 'react';

function ConfirmModal({ onConfirm, onClose }) {
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start", 
            paddingTop: "20%", 
            zIndex: 1000, 
        }}>
            <div className="p-3" style={{
                background: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                width: "100%",
                maxWidth: "400px",
                padding: "20px"
            }}>
                <div className='col-md-12'>
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <h5 style={{
                                color: "#d9534f",
                                fontSize: "18px",
                                fontWeight: "bold",
                                marginBottom: "15px"
                            }}>Confirmation</h5>
                            <hr style={{ border: "1px solid #f0f0f0" }} />
                            <p style={{
                                color: "#333",
                                fontSize: "16px",
                                lineHeight: "1.5"
                            }}>Are you sure you want to delete this?</p>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                        <button
                            type="button"
                            className="btn btn-secondary mr-2"
                            style={{
                                backgroundColor: "#6c757d",
                                color: "#fff",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                fontSize: "14px",
                                cursor: "pointer"
                            }}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            style={{
                                backgroundColor: "#d9534f",
                                color: "#fff",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                fontSize: "14px",
                                cursor: "pointer"
                            }}
                            onClick={onConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;

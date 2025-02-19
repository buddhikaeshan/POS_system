import React, { useState } from "react";

function ChequeForm() {
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        chequeNo: "",
        chequeAmount: "",
        chequeDate: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.chequeNo || !formData.chequeAmount || !formData.chequeDate) {
            setError("All fields are required.");
            return;
        }

        if (isNaN(formData.chequeAmount)) {
            setError("Cheque amount must be a valid number.");
            return;
        }

        setError(null); 
        console.log("Form submitted:", formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleClose = () => {
        console.log("Modal closed");
    };

    return (
        <div
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "50px", zIndex: 1000, }}>
            <div
                className="p-3"
                style={{ background: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", width: "100%", maxWidth: "400px", padding: "20px", }} >
                <h4>Add New Cheque</h4>
                {error && <div className="error-message" style={{ color: "red" }}>{error}</div>}
                <form onSubmit={handleSubmit} className="mt-2">
                    <div className="form-group">
                        <label htmlFor="chequeNo">Cheque Number</label>
                        <input type="text" className="form-control" id="chequeNo" name="chequeNo" value={formData.chequeNo} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="chequeAmount">Cheque Amount</label>
                        <input type="text" className="form-control" id="chequeAmount" name="chequeAmount" value={formData.chequeAmount} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="chequeDate">Cheque Date</label>
                        <input type="date" className="form-control" id="chequeDate" name="chequeDate" value={formData.chequeDate} onChange={handleChange} />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn" style={{ backgroundColor: "red", color: "white", borderRadius: "none", padding: "10px 20px", }} onClick={handleClose} >
                            Close
                        </button>
                        <button type="submit" className="btn" style={{ backgroundColor: "yellow", color: "black", borderRadius: "none", padding: "10px 20px", }}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChequeForm;

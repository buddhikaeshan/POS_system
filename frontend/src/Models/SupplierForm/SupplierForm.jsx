import React, { useState, useEffect } from 'react';
import '../StaffModel/StaffModal.css';
import config from '../../config';

const SupplierForm = ({ closeModal, showModal, onSave, supplier }) => {
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        nic: '',
        contact1: '',
        contact2: '',
        company: '',
    });

    useEffect(() => {
        if (showModal && supplier) {
            setFormData({
                name: supplier.supplierName,
                address: supplier.supplierAddress,
                email: supplier.supplierEmail,
                nic: supplier.supplierNic,
                contact1: supplier.supplierTP,
                contact2: supplier.supplierSecondTP,
                company: supplier.supplierCompany,
            });
        } else if (!showModal) {
            setFormData({
                name: '',
                address: '',
                email: '',
                nic: '',
                contact1: '',
                contact2: '',
                company: '',
            });
            setFormErrors({});
            setError(null);
        }
    }, [showModal, supplier]);

    const validate = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Supplier name is required';
        }
        if (!formData.address.trim()) {
            errors.address = 'Address is required';
        }
        if (!formData.contact1.trim()) {
            errors.contact1 = 'At least one contact number is required';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const supplierData = {
            supplierName: formData.name,
            supplierAddress: formData.address,
            supplierEmail: formData.email,
            supplierNic: formData.nic,
            supplierTP: formData.contact1,
            supplierSecondTP: formData.contact2,
            supplierCompany: formData.company,
        };

        try {
            const response = await fetch(`${config.BASE_URL}/supplier${supplier ? `/${supplier.supplierId}` : ''}`, {
                method: supplier ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(supplierData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'An error occurred.');
            } else {
                setSuccessMessage(supplier ? 'Supplier updated successfully!' : 'Supplier created successfully!');
                closeModal();
                onSave();
            }
        } catch (err) {
            setError('Failed to save supplier. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }
    };

    if (!showModal) return null;

    return (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "5%", zIndex: 1000, }}>
            <div className="p-3" style={{ background: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", width: "100%", maxWidth: "400px", padding: "20px" }}>
                <h4>{supplier ? 'Update Supplier' : 'Add Supplier'}</h4>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )}
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Supplier Name <span>*</span></label>
                        <input type="text" value={formData.name} onChange={handleChange} name="name" id="name" className="form-control" />
                        {formErrors.name && <p className="error">{formErrors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Supplier Address <span>*</span></label>
                        <input type="text" value={formData.address} onChange={handleChange} name="address" id="address" className="form-control" />
                        {formErrors.address && <p className="error">{formErrors.address}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email <span>(optional)</span></label>
                        <input type="email" value={formData.email} onChange={handleChange} name="email" id="email" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nic">NIC <span>(optional)</span> </label>
                        <input type="text" value={formData.nic} onChange={handleChange} name="nic" id="nic" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact1">Contact 1 <span>*</span></label>
                        <input type="text" value={formData.contact1} onChange={handleChange} name="contact1" id="contact1" className="form-control" />
                        {formErrors.contact1 && <p className="error">{formErrors.contact1}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="company">Company<span>*</span></label>
                        <input type="text" value={formData.company} onChange={handleChange} name="company" id="company" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact2">Contact 2 <span>(optional)</span></label>
                        <input type="text" value={formData.contact2} onChange={handleChange} name="contact2" id="contact2" className="form-control" />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" style={{ backgroundColor: "red", color: "white", borderRadius: "nome", padding: "10px ,20px ", }} onClick={closeModal}>Close</button>
                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: "yellow", color: "black", borderRadius: "nome", padding: "10px ,20px ", }}>Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SupplierForm;

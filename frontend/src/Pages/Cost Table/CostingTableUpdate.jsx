import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash, Edit } from 'lucide-react';
import axios from 'axios';
import config from '../../config';

const CostingTableUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    fetchCostingData();
  }, [id]);

  const [preparedBy, setPreparedBy] = useState('');

  const fetchCostingData = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/costings/${id}`);
      const { customer, CostingDetails, preparedBy } = response.data;


      setCustomerName(customer?.cusName || '');
      setCustomerDetails({
        cusJob: customer?.cusJob || '',
        cusOffice: customer?.cusOffice || '',
        cusAddress: customer?.cusAddress || '',

      });
      setPreparedBy(preparedBy || '');

      const transformedDetails = CostingDetails.map(detail => ({
        cusId: response.data.cusId,
        descriptionCustomer: detail.description_customer,
        productCode: detail.product_code,
        needImage: detail.needImage,
        description: detail.description,
        warranty: detail.warranty,
        supplier: detail.supplier,
        unitCost: detail.unit_cost,
        ourMarginPercentage: detail.our_margin_percentage,
        ourMarginValue: detail.our_margin_value,
        otherMarginPercentage: detail.other_margin_percentage,
        otherMarginValue: detail.other_margin_value,
        pricePlusMargin: detail.price_plus_margin,
        sellingRate: detail.selling_rate,
        sellingRateRounded: detail.selling_rate_rounded,
        uom: detail.uom,
        qty: detail.qty,
        unitPrice: detail.unit_price,
        discountPercentage: detail.discount_percentage,
        discountValue: detail.discount_value,
        discountedPrice: detail.discounted_price,
        amount: detail.amount,
        profit: detail.profit,
        customerName: customer?.cusName || ''
      }));

      setEntries(transformedDetails);
    } catch (error) {
      console.error('Error fetching costing data:', error);
      alert('Error loading costing data');
    }
  };


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

    // Ensure all numeric fields are parsed as numbers
    const unitCost = parseFloat(updatedData.unitCost) || 0;
    const ourMarginPercentage = parseFloat(updatedData.ourMarginPercentage) || 0;
    const otherMarginPercentage = parseFloat(updatedData.otherMarginPercentage) || 0;
    const qty = parseInt(updatedData.qty) || 1;
    const discountPercentage = parseFloat(updatedData.discountPercentage) || 0;

    // Calculate values
    updatedData.ourMarginValue = parseFloat((unitCost * ourMarginPercentage) / 100) || 0;
    updatedData.otherMarginValue = parseFloat((unitCost * otherMarginPercentage) / 100) || 0;
    updatedData.pricePlusMargin = parseFloat(updatedData.ourMarginValue + updatedData.otherMarginValue) || 0;
    updatedData.sellingRate = parseFloat(updatedData.pricePlusMargin / 0.9) || 0;
    updatedData.sellingRateRounded = Math.ceil(updatedData.sellingRate / 10) * 10 || 0;
    updatedData.unitPrice = parseFloat(updatedData.sellingRateRounded) || 0;
    updatedData.discountValue = parseFloat((updatedData.sellingRateRounded * discountPercentage) / 100) || 0;
    updatedData.discountedPrice = parseFloat(updatedData.sellingRateRounded - updatedData.discountValue) || 0;
    updatedData.amount = parseFloat(updatedData.discountedPrice * qty) || 0;
    updatedData.profit = parseFloat((updatedData.ourMarginValue + parseFloat(updatedData.otherMarginPercentage)) * qty) || 0;

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

  const handleUpdateToDatabase = async () => {
    if (entries.length === 0) {
      alert('Please add at least one entry');
      return;
    }

    setIsSaving(true);
    const totals = calculateTotals();

    try {
      const response = await axios.put(`${config.BASE_URL}/costings/${id}`, {
        headerData: {
          cusId: entries[0].cusId,
          totalAmount: totals.totalAmount,
          totalProfit: totals.totalProfit,
          status: 'draft',
          preparedBy: preparedBy,
        },
        detailsData: entries.map((entry) => ({
          ...entry,
          needImage: entry.needImage || false,
        })),
      });

      alert('Costing data updated successfully');
      navigate('/qutation');
    } catch (error) {
      console.error('Error updating costing data:', error);
      alert('Error updating costing data');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container-fluid mt-2">
      <div className="card mb-2">
        <div className="card-body">
          <h2 className="card-title mb-3">Update Quotation</h2>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Customer Name</label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control bg-light"
                  value={customerName}
                  onChange={(e) =>
                    handleInputChange({ target: { name: 'customerName', value: e.target.value } })
                  }
                  readOnly
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
                value={formData.ourMarginValue ? Number(formData.ourMarginValue).toFixed(2) : "0.00"}
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
                value={formData.otherMarginValue ? Number(formData.otherMarginValue).toFixed(2) : "0.00"}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Price + Margin</label>
              <input
                type="number"
                className="form-control bg-light"
                value={formData.pricePlusMargin ? Number(formData.pricePlusMargin).toFixed(2) : "0.00"}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Selling Rate Before Discount</label>
              <input
                type="number"
                className="form-control bg-light"
                value={formData.sellingRate ? Number(formData.sellingRate).toFixed(2) : "0.00"}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Selling Rate (Rounded to Nearest 10)</label>
              <input
                type="number"
                className="form-control bg-light"
                value={formData.sellingRateRounded ? Number(formData.sellingRateRounded) : "0"}
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
                value={formData.unitPrice ? Number(formData.unitPrice).toFixed(2) : "0.00"}
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
                value={formData.discountValue ? Number(formData.discountValue).toFixed(2) : "0.00"}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Discounted Price</label>
              <input
                type="number"
                className="form-control bg-light"
                value={formData.discountedPrice ? Number(formData.discountedPrice).toFixed(2) : "0.00"}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-control bg-light"
                value={formData.amount ? Number(formData.amount).toFixed(2) : "0.00"}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Profit</label>
              <input
                type="number"
                className="form-control bg-light"
                value={formData.profit ? Number(formData.profit).toFixed(2) : "0.00"}
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
            {entries.map((entry, index) => {
              // Ensure all numeric fields are valid numbers
              const ourMarginValue = parseFloat(entry.ourMarginValue) || 0;
              const otherMarginValue = parseFloat(entry.otherMarginValue) || 0;
              const pricePlusMargin = parseFloat(entry.pricePlusMargin) || 0;
              const sellingRate = parseFloat(entry.sellingRate) || 0;
              const discountValue = parseFloat(entry.discountValue) || 0;
              const discountedPrice = parseFloat(entry.discountedPrice) || 0;
              const amount = parseFloat(entry.amount) || 0;
              const profit = parseFloat(entry.profit) || 0;

              return (
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
                  <td>{ourMarginValue.toFixed(2)}</td>
                  <td>{entry.otherMarginPercentage}</td>
                  <td>{otherMarginValue.toFixed(2)}</td>
                  <td>{pricePlusMargin.toFixed(2)}</td>
                  <td>{sellingRate.toFixed(2)}</td>
                  <td>{entry.sellingRateRounded}</td>
                  <td>{entry.uom}</td>
                  <td>{entry.qty}</td>
                  <td>{entry.unitPrice}</td>
                  <td>{entry.discountPercentage}</td>
                  <td>{discountValue.toFixed(2)}</td>
                  <td>{discountedPrice.toFixed(2)}</td>
                  <td>{amount.toFixed(2)}</td>
                  <td>{profit.toFixed(2)}</td>
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
              );
            })}
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

        {/* <div className="mt-3 text-end mb-4 d-flex justify-content-end gap-2">
          <div className="me-2">
            <input
              type="text"
              className="form-control"
              placeholder="Prepared By"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
            />
          </div>
        </div> */}

<div className="mt-3 text-end mb-4 d-flex justify-content-end gap-2">
  <div className="me-2 d-flex align-items-center">
    <label className="me-2">Prepared By:</label>
    <input
      type="text"
      className="form-control"
      placeholder="Enter name"
      value={preparedBy}
      onChange={(e) => setPreparedBy(e.target.value)}
    />
  </div>
</div>



        <div className="mt-3 text-end mb-4 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => navigate('/qutation')}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-success"
            onClick={handleUpdateToDatabase}
            disabled={isSaving || entries.length === 0}
          >
            {isSaving ? 'Updating...' : 'Update Quotation'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CostingTableUpdate
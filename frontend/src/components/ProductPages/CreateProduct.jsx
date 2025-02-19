import React, { useState, useEffect } from 'react';
import './Product.css';
import config from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProd = location.state?.selectedProd;

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    productCategory: 'select',
    productName: '',
    productCode: '',
    sellingPrice: '',
    buyingPrice: '',
    warranty: '',
    description: '',
    unit: '',
    image: '',
    productBrand: '',
    productEmi:''
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = () => {
    fetch(`${config.BASE_URL}/products`)
      .then(response => response.json())
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Pre-fill form if editing a product
  useEffect(() => {
    if (selectedProd) {
      setFormData({
        productCategory: selectedProd.category || 'select',
        productName: selectedProd.productName || '',
        productCode: selectedProd.productCode || '',
        sellingPrice: selectedProd.productSellingPrice || '',
        buyingPrice: selectedProd.productBuyingPrice || '',
        warranty: selectedProd.productWarranty || '',
        description: selectedProd.productDescription || '',
        unit: selectedProd.productUnit || '',
        productEmi:selectedProd.productEmi || '',
        image: '',
        productBrand: selectedProd.productBrand,
      });
    }
  }, [selectedProd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.productCategory === 'select') {
      setError('Please select a valid product category.');
      return;
    }

    const formDataToSend = new FormData();
    // Append all text fields
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('productCode', formData.productCode);
    formDataToSend.append('productSellingPrice', formData.sellingPrice);
    formDataToSend.append('productBuyingPrice', formData.buyingPrice);
    formDataToSend.append('productDescription', formData.description);
    formDataToSend.append('productWarranty', formData.warranty);
    formDataToSend.append('categoryId', formData.productCategory);
    formDataToSend.append('productUnit', formData.unit);
    formDataToSend.append('productEmi', formData.productEmi);
    formDataToSend.append('productBrand', formData.productBrand);

    console.log(formData);

    // Append the image file if provided
    if (image) {
      formDataToSend.append('productImage', image);
    }

    try {
      const url = selectedProd
        ? `${config.BASE_URL}/product/${selectedProd.productId}`
        : `${config.BASE_URL}/product`;
      const method = selectedProd ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage(`${selectedProd ? 'Product updated' : 'Product created'} successfully`);
        setTimeout(() => {
          navigate('/product/product-list');
        }, 1000);
        handleReset();
        fetchProducts();
      } else {
        setError(result.error || `Failed to ${selectedProd ? 'update' : 'create'} product`);
      }

    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing the product.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setFormData({
      productCategory: 'select',
      productName: '',
      productCode: '',
      sellingPrice: '',
      buyingPrice: '',
      warranty: '',
      description: '',
      productEmi:'',
      unit: '',
      image: '',
      productBrand: '',
    });
    setImage(null);
    setPreview('');
  };
  return (
    <div>
      <div className="scrolling-container">
        <h4>{selectedProd ? 'Edit Product' : 'Add Product'}</h4>
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
        <div className="row">
          <form action="" className='col-md-8 product-form' onSubmit={handleSubmit}>
            <div className="row">
              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>Product category</label>
                <select name="productCategory" id="" onChange={handleChange} className="form-control" value={formData.productCategory}>
                  <option value="select">Select Product Category</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>Product Image</label>
                <input type="file" name='image' id='' accept="image/*" onChange={handleImageChange} className='form-control' />
                {preview && (
                  <div style={{ margin: '10px auto' }}>
                    <img src={preview} alt="Preview" style={{ width: '100px', height: 'auto' }} />
                  </div>
                )}
              </div>
              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>Product Name</label>
                <input onChange={handleChange} type="text" name='productName' id='' value={formData.productName} className='form-control' />
              </div>
            </div>

            <div className="row">
              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>Product Brand</label>
                <input onChange={handleChange} type="text" name='productBrand' id='' value={formData.productBrand} className='form-control' />
              </div>

              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>Product Code</label>
                <input onChange={handleChange} type="text" name='productCode' id='' value={formData.productCode} className='form-control' />
              </div>

              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>Model Number</label>
                <input onChange={handleChange} type="text" name='productEmi' id='' value={formData.productEmi} className='form-control' />
              </div>
            </div>

            <div className="row">
              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>Buying price (Per Unit)</label>
                <input onChange={handleChange} type="number" name='buyingPrice' id='' onWheel={(e) => e.target.blur()} value={formData.buyingPrice} className='form-control' />
              </div>
              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>Selling Price (Per Unit)</label>
                <input onChange={handleChange} type="number" name='sellingPrice' onWheel={(e) => e.target.blur()} id='' value={formData.sellingPrice} className='form-control' />
              </div>

              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>Unit (G/KG/K24/K30)</label>
                <input onChange={handleChange} type="text" name='unit' id='' onWheel={(e) => e.target.blur()} value={formData.unit} className='form-control' />
              </div>
            </div>

            <div className="row">
              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>Description</label>
                <textarea onChange={handleChange} name='description' id='' value={formData.description} className='form-control' rows={2}></textarea>
              </div>


              {/* <div className="row">
              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>Warranty</label>
                <select name='warranty' id='' value={formData.warranty} className='form-control' onChange={handleChange} >
                  <option value="No Warranty">No Warranty</option>
                  <option value="1 Months">1 Months</option>
                  <option value="2 Months">2 Months</option>
                  <option value="3 Months">3 Months</option>
                  <option value="4 Months">4 Months</option>
                  <option value="5 Months">5 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="7 Months">7 Months</option>
                  <option value="8 Months">8 Months</option>
                  <option value="9 Months">9 Months</option>
                  <option value="10 Months">10 Months</option>
                  <option value="11 Months">11 Months</option>
                  <option value="12 Months">12 Months</option>
                  <option value="13 Months">13 Months</option>
                  <option value="14 Months">14 Months</option>
                  <option value="15 Months">15 Months</option>
                  <option value="16 Months">16 Months</option>
                  <option value="17 Months">17 Months</option>
                  <option value="18 Months">18 Months</option>
                  <option value="19 Months">19 Months</option>
                  <option value="20 Months">20 Months</option>
                  <option value="21 Months">21 Months</option>
                  <option value="22 Months">22 Months</option>
                  <option value="23 Months">23 Months</option>
                  <option value="24 Months">24 Months</option>
                  <option value="25 Months">25 Months</option>
                  <option value="26 Months">26 Months</option>
                  <option value="27 Months">27 Months</option>
                  <option value="28 Months">28 Months</option>
                  <option value="29 Months">29 Months</option>
                  <option value="30 Months">30 Months</option>
                  <option value="31 Months">31 Months</option>
                  <option value="32 Months">32 Months</option>
                  <option value="33 Months">33 Months</option>
                  <option value="34 Months">34 Months</option>
                  <option value="35 Months">35 Months</option>
                  <option value="36 Months">36 Months</option>
                </select>
              </div>
            </div> */}

                <div className="product-details col-md-4 mb-2">
                  <label htmlFor="warranty" className="mb-1">Warranty</label>
                  <input
                    type="text"
                    name="warranty"
                    id="warranty"
                    value={formData.warranty}
                    className="form-control"
                    onChange={handleChange}
                    placeholder="Enter warranty period (e.g., 12 Months, 1 Year)"
                  />
                </div>
            </div>
            <div className="sales-add btn d-grid d-md-flex me-md-2 justify-content-end px-5">
              <button type='reset' className="btn btn-danger mb-2 text-bold" onReset={handleReset} style={{ fontSize: "13px" }}>Clear</button>
              <button className="btn btn-primary btn-md mb-2" style={{ fontSize: "13px" }}>{selectedProd ? 'Update Product' : 'Create Product'}</button>
            </div>
          </form>

          <div className="showProduct col-md-4">
            <h4>Products With Category</h4>
            {products.length > 0 ? (
              products.map(product => (<div className="mb-1">
                <div key={product.productId} className="showProduct-group">
                  <p>{product.productName}</p>
                  <p>{product.category ? product.category.categoryName : 'No Category'}</p>
                </div>
              </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProduct;
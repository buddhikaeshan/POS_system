import React, { useEffect, useState } from 'react';
import Table from '../Table/Table';
import ConfirmModal from '../../Models/ConfirmModal';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);

  const columns = ['id', 'Product','Product Brand','Model Number', 'Product Code', 'Weight(g/Kg)', 'Buying Price', 'Selling Price', 'Warranty (months)', 'Profit', 'Description', "CategoryId", 'Category', 'Status'];
  const btnName = ['Create Product +'];

  useEffect(() => {
    fetchProductList();
  });

  const fetchProductList = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/products`);
      if (!response.ok) {
        setError(`Failed to fetch product list: ${response.status} ${response.statusText}`);
      }
      const prod = await response.json();
      const formattedData = prod.map(prod => [
        prod.productId,
        prod.productName,
        prod.productBrand,
        prod.productEmi,
        prod.productCode,
        prod.productUnit,
        prod.productBuyingPrice,
        prod.productSellingPrice,
        prod.productWarranty,
        prod.productProfit,
        prod.productDescription,
        prod.category?.categoryId,
        prod.category?.categoryName,
        <select
          className="form-control"
          value={prod.productStatus}
          onChange={(e) => handleStatusChange(prod.productId, e.target.value)}
        >
          <option value="In stock">In stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      ]);
      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(`Error fetching product list: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const response = await fetch(`${config.BASE_URL}/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productStatus: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update product status: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
      }
      await fetchProductList();
    } catch (error) {
      setError(`Error updating product status: ${error.message}`);
    }
  };

  const handleDelete = (rowIndex) => {
    setSelectedProductIndex(rowIndex);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const productId = data[selectedProductIndex][0];
      const response = await fetch(`${config.BASE_URL}/product/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete Product: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
      }

      setData(prevData => prevData.filter((_, index) => index !== selectedProductIndex));
      await fetchProductList();
    } catch (err) {
      setError(`Error deleting product: ${err.message}`);
      alert('This product is used for creating invoices.');
    } finally {
      setIsModalOpen(false);
      setSelectedProductIndex(null);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setSelectedProductIndex(null);
  };

  const handleEdit = (rowIndex) => {
    const selectedProdData = data[rowIndex];
    const selectedProd = {
      productId: selectedProdData[0],
      category: selectedProdData[11],
      productName: selectedProdData[1],
      productBrand:selectedProdData[2],
      productEmi: selectedProdData[3],
      productCode: selectedProdData[4],
      productUnit: selectedProdData[5],
      productBuyingPrice: selectedProdData[6],
      productSellingPrice: selectedProdData[7],
      productWarranty: selectedProdData[8],
      productProfit: selectedProdData[9],
      productDescription: selectedProdData[10],
    };

    navigate('/product/create', { state: { selectedProd } });
  };

  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/product/create');
  };

  const title = 'Product List';
  const invoice = 'product_list.pdf';

  return (
    <div>
      <div className="scrolling-container">
        <h4>Product List</h4>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <Table
            data={data}
            columns={columns}
            btnName={btnName}
            onAdd={handleAddProduct}
            onDelete={handleDelete}
            onEdit={handleEdit}
            showDate={false}
            title={title}
            invoice={invoice}
          />
        )}
        {isModalOpen && (
          <ConfirmModal
            onConfirm={confirmDelete}
            onClose={cancelDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;

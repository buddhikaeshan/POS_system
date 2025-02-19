import React, { useState, useEffect } from 'react';
import { CirclePlus, Plus, PlusCircle, ShoppingCart, User } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './NewSales.css';
import Table from '../Table/Table'
import config from '../../config';
import CustomerSearch from './CustomerSearch';
import ProductSearch from './ProductSearch';
import Header from '../SideBar/Header';

const DraftSales = ({ invoice }) => {
  const [tableData, setTableData] = useState([]);
  const [users, setUsers] = useState([]);
  const [productId, setProductId] = useState('');
  const [stockId, setStockId] = useState('');
  const [invoiceStatus, setInvoiceStatus] = useState('invoice');
  const [cusId, setCusId] = useState('');
  const [file, setFile] = useState(null);
  const { invoiceId } = useParams();
  const [draft, setDraft] = useState('false')
  const [invoiceTy, setInvoiceType] = useState('');
  const { invoiceType } = useParams();

  useEffect(() => {
    handleInvoicetype(invoiceType)
  }, [invoiceType])
  const handleInvoicetype = (invoiceType) => {
    if (invoiceType === 'invoice') {
      setInvoiceType('Invoice')
    }
    if (invoiceType === 'delivery') {
      setInvoiceType('Delivery')
    }
    if (invoiceType === 'performa') {
      setInvoiceType('Performa')
    }
  }

  const DateTime = () => {
    const now = new Date();
    const NewTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);

    const [date, time] = NewTime.split(', ');
    return { date: date.split('/').reverse().join('-'), time };
  };
  // const Columns = ['Product Code', 'Product Name', 'Product Price', 'Quantity', 'Discount', 'Total Price', 'Warranty', 'Product ID', 'Stock ID', "ID", 'Actions'];
  const Columns = ['Product Code', 'Product Name', 'Product Price', 'Discount as %', 'Discount as amount', "discounted Price", 'Quantity', 'Total Price', 'Warranty', 'Product ID', 'Stock ID', "ID", 'Actions'];
  const [formData, setFormData] = useState({
    cusName: '',
    cusNic: '',
    cusCode: '',
    cusAddress: '',
    productNo: '',
    productName: '',
    productPrice: '',
    qty: '',
    discount: '',
    discountRs: '',
    totalPrice: '',
    productNote: '',
    discountPrice: '',
    emi: '',
    amount: '',
    card: '',
    cheque: '',
    chequeDate: '',
    online: '',
    bank: '',
    cash: '',
    user: '',
    userName: '',
    paidAmount: '',
    dueAmount: '',
    note: '',
    invoiceDate: DateTime().date + " " + DateTime().time,
    invoiceNo: '',
    purchaseNo: '',
    salesPerson: '',
    cusJob: '',
    cusOffice: '',
    discountType: '',
    discountProductPrice: '',
  });

  const [customerStore, setCustomerStore] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [delivary, setDelivary] = useState('invoice')
  const [showCard, setCard] = useState(false);
  const [showCash, setCash] = useState(false);
  const [showCredit, setCredit] = useState(false);
  const [showCheque, setCheque] = useState(false);
  const [showBank, setBank] = useState(false);
  const [showOnline, setOnline] = useState(false);
  const [transactionType, setTransactionType] = useState(true)

  useEffect(() => {
    if (invoiceId) {
      fetchDraftInvoiceData(invoiceId);
    }
  }, [invoiceId]);

  //invoice data fetch===========================================================================
  const fetchDraftInvoiceData = async (invoiceId) => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoice/${invoiceId}`);
      if (response.ok) {
        const invoiceData = await response.json();

        const productResponse = await fetch(`${config.BASE_URL}/invoiceProducts/${invoiceId}`);
        const products = await productResponse.json();

        const transactionResponse = await fetch(`${config.BASE_URL}/transaction/invoice/${invoiceId}`);
        const transaction = await transactionResponse.json();

        setTableData(products.map(product => {
          const productPrice = parseFloat(product.unitAmount);
          const invoiceDiscount = parseFloat(product.discount);
          const discountedProductPrice = productPrice - invoiceDiscount;
          const discountPercentage = (productPrice > 0) ? (invoiceDiscount / productPrice) * 100 : 0; // Correct formula


          return [
            product.product.productCode,
            product.product.productName,
            product.unitAmount,
            discountPercentage,
            product.discount,
            discountedProductPrice,
            product.invoiceQty,
            product.totalAmount,
            product.warranty,
            product.productId,
            product.stockId,
            product.id,
            <p className='btn btn-danger' onClick={() => handleRemoveProduct(product.id)}>Remove</p>
          ];
        }));

        setFormData(prevData => ({
          ...prevData,
          purchaseNo: invoiceData.purchaseNo,
        }));

        fetchCustomerData(invoiceData.customer.cusName);
        setInvoiceStatus(invoiceData.status);
        setCustomerStore(invoiceData.store);
        setSelectedStore(invoiceData.store);

        // Calculate totals
        const totalAmount = products.reduce((sum, product) => sum + product.totalAmount, 0);
        const discount = transaction.reduce((sum, transaction) => sum + transaction.discount, 0);
        const paid = transaction.reduce((sum, transaction) => sum + transaction.paid, 0);
        const price = transaction.reduce((sum, transaction) => sum + transaction.price, 0);
        const due = transaction.reduce((sum, transaction) => sum + transaction.due, 0);
        const note = transaction.length > 0 ? transaction[0].note : '';
        const transactionType = transaction.length > 0 ? transaction[0].transactionType : '';
        setTransactionType(transactionType);

        setFormData(prevData => ({
          ...prevData,
          totalAmount: totalAmount.toFixed(2),
          discountPrice: discount.toFixed(2),
          paidAmount: paid.toFixed(2),
          dueAmount: due.toFixed(2),
          amount: price.toFixed(2),
          note: note,
        }));
      } else {
        console.error('Failed to fetch draft invoice data');
      }
    } catch (error) {
      console.error('Error fetching draft invoice data:', error);
    }
  };

  useEffect(() => {
    if (transactionType === 'cash') {
      setCash(true);
    } if (transactionType === 'card') {
      setCard(true);
    } if (transactionType === 'credit') {
      setCredit(true);
    } if (transactionType === 'cheque') {
      setCheque(true);
    } if (transactionType === 'bank') {
      setBank(true);
    } if (transactionType === 'online') {
      setOnline(true);
    }
  }, [transactionType])

  //user fetch===============================================================================================
  const fetchUserId = async () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
      try {
        const response = await fetch(`${config.BASE_URL}/user/name/${userName}`);
        if (!response.ok) throw new Error('User not found');
        const userData = await response.json();
        setFormData(prev => ({ ...prev, user: userData.userId, userName: userData.userName }));
      } catch (err) {
        console.log('err', err);
      }
    } else {
      console.log('err');
    }
  };

  useEffect(() => {
    if (!formData.user) {
      fetchUserId();
    }
  }, [formData.user]);

  //customer fetch ==========================================================================================
  const fetchCustomerData = async (cusName) => {
    try {
      const response = await fetch(`${config.BASE_URL}/customer/cusName/${cusName}`);
      if (response.ok) {
        const customerData = await response.json();
        setFormData(prevData => ({
          ...prevData,
          cusName: customerData.cusName,
          cusJob: customerData.cusJob,
          cusOffice: customerData.cusOffice,
          cusAddress: customerData.cusAddress
        }));
        setCusId(customerData.cusId);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  //handleChanger=============================================================================================
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'cusName') {
      fetchCustomerData(value);
    }
    if (name === 'productNo' || name === 'productName') {
      try {
        const response = await fetch(`${config.BASE_URL}/product/codeOrName/${value}`);
        if (response.ok) {
          const productData = await response.json();
          setProductId(productData.productId)
          setFormData(prevData => ({
            ...prevData,
            productNo: productData.productCode,
            productName: productData.productName || prevData.productName,
            productPrice: productData.productSellingPrice,
            discountProductPrice: productData.productSellingPrice,
            qty: 1,
            discount: productData.productDiscount,
            totalPrice: productData.productSellingPrice,
            productNote: productData.productWarranty + ' ' + productData.productDescription,
            emi: productData.productEmi
          }));
          if (productData.productId) {
            fetchStockData(productData.productId);
          }
        } else {
          setFormData(prevData => ({
            ...prevData,
            productPrice: '',
            qty: '',
            totalPrice: '',
            discountProductPrice: '',
            productNote: ''
          }));
          console.log('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    }

    if (name === 'salesPerson') {
      const selectedUserId = value;
      setFormData(prevData => ({
        ...prevData,
        salesPerson: selectedUserId
      }));
    }
  };

  //stock data fetch==========================================================================================
  const fetchStockData = async (productId) => {
    try {
      const response = await fetch(`${config.BASE_URL}/stock/product/${productId}`);
      if (response.ok) {
        const stockData = await response.json();
        setStockId(stockData.stockId)
      } else {
        const errorBody = await response.json();
        console.log('Error fetching stock:', errorBody);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  //data calculate=============================================================================================
  useEffect(() => {
    const productPrice = parseFloat(formData.productPrice) || 0;
    const qty = parseFloat(formData.qty) || 1;
    let discountedPrice = productPrice;

    if (formData.discountType === 'percentage') {
      const discountPercentage = parseFloat(formData.discount) || 0;
      discountedPrice = productPrice * (1 - discountPercentage / 100);
    } else if (formData.discountType === 'fixed') {
      const discountFixed = parseFloat(formData.discountRs) || 0;
      discountedPrice = productPrice - discountFixed;
    }

    const newTotalPrice = discountedPrice * qty;

    setFormData(prevData => ({
      ...prevData,
      totalPrice: newTotalPrice.toFixed(0),
      productDiscount: discountedPrice.toFixed(0),
      discountProductPrice: discountedPrice.toFixed(0),
    }));
  }, [formData.productPrice, formData.discount, formData.discountRs, formData.qty, formData.discountType]);


  //add product to table=======================================================================================
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.productNo || !formData.productName || !formData.productPrice || !formData.qty) {
      alert("Please fill in all the product details.");
      return;
    }

    // if (!stockId) {
    //   alert(`Product ${formData.productName} does not have stock available`)
    //   return;
    // }

    const productPrice = parseFloat(formData.productPrice);
    const discount = parseFloat(formData.productPrice) - parseFloat(formData.productDiscount) || 0;

    const discountPresentage = Math.round((discount / productPrice) * 100);

    const newRow = [
      formData.productNo,
      formData.productName,
      formData.productPrice,
      discountPresentage,
      formData.productPrice - formData.productDiscount || 0,
      formData.discountProductPrice,
      formData.qty,
      formData.totalPrice,
      formData.productNote,
      productId,
      stockId || '',
      0,
      <p onClick={() => removeRow(tableData.length)} className='btn btn-danger btn-sm'>Remove</p>
    ];

    setTableData(prevData => [...prevData, newRow]);
    setFormData(prevData => ({
      ...prevData,
      productNo: '',
      productName: '',
      productPrice: '',
      qty: '',
      discount: '',
      discountRs: '',
      totalPrice: '',
      productNote: '',
      emi: ''
    }));
    resetSalesPerson();
    console.log("Added new row:", newRow);
    console.log("Updated table data:", [...tableData, newRow]);

    const updatedTableData = [...tableData, newRow];
    let totalAmount = 0;
    let totalDiscount = 0;
    let payableAmount = 0;

    updatedTableData.forEach((row) => {
      const price = parseFloat(row[2]) || 0;
      const qty = parseFloat(row[6]) || 0;
      const discount = parseFloat(row[4]) || 0;
      const totalPrice = parseFloat(row[7]) || 0;

      totalAmount += price * qty;
      totalDiscount += (price * qty) - totalPrice;
      payableAmount += totalPrice;
    });
    setFormData((prevData) => ({
      ...prevData,
      totalAmount: totalAmount.toFixed(2),
      discountPrice: totalDiscount.toFixed(2),
      amount: payableAmount.toFixed(2),
      dueAmount: payableAmount.toFixed(2),
      paidAmount: 0.00
    }));
  };

  //edit columns=======================================================================================================
  const handleCellEdit = (rowIndex, cellIndex, newValue) => {
    const updatedTableData = [...tableData];

    updatedTableData[rowIndex][cellIndex] = newValue;

    const productPrice = parseFloat(updatedTableData[rowIndex][2]) || 0;
    let discountedProductPrice = productPrice;
    let discountPercentage = parseFloat(updatedTableData[rowIndex][3]) || 0;
    let qty = parseFloat(updatedTableData[rowIndex][6]) || 1;
    let discount = parseFloat(updatedTableData[rowIndex][4]);

    if (isNaN(discount)) discount = 0;
    if (isNaN(discountPercentage)) discountPercentage = 0;


    // Only recalculate if discount is changed

    if (cellIndex === 5) {
      discount = (productPrice * discountPercentage) / 100;
    }
    if (cellIndex === 3) {
      discount = (productPrice * discountPercentage) / 100;
    } else if (cellIndex === 4) {
      discountPercentage = (productPrice > 0) ? (discount / productPrice) * 100 : 0;
    }


    discountedProductPrice = productPrice - discount;
    const totalPrice = Math.round(discountedProductPrice * qty);

    updatedTableData[rowIndex][5] = discountedProductPrice.toFixed(2);
    updatedTableData[rowIndex][3] = discountPercentage;
    updatedTableData[rowIndex][4] = discount;
    updatedTableData[rowIndex][7] = Math.round(totalPrice);
    setTableData(updatedTableData);
    recalculateTotals(updatedTableData);
  };

  const recalculateTotals = (data) => {
    let totalAmount = 0;
    let totalDiscount = 0;
    let payableAmount = 0;

    data.forEach((row) => {
      const price = parseFloat(row[2]) || 0;
      const qty = parseFloat(row[6]) || 0;
      const discount = parseFloat(row[4]) || 0;
      const totalPrice = parseFloat(row[7]) || 0;

      totalAmount += price * qty;
      totalDiscount += (price * qty) - totalPrice;
      payableAmount += totalPrice;
    });

    setFormData((prevData) => ({
      ...prevData,
      totalAmount: totalAmount.toFixed(2),
      discountPrice: totalDiscount.toFixed(2),
      amount: payableAmount.toFixed(2),
      dueAmount: payableAmount.toFixed(2),
      paidAmount: 0,
    }));
  }

  //product remove=================================================================================
  const removeRow = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this product?');
    if (!confirmDelete) return;

    const updatedTableData = tableData.filter((_, i) => i !== index);
    setTableData(updatedTableData);

    // Recalculate totals after removing a row
    let totalAmount = 0;
    let totalDiscount = 0;
    let payableAmount = 0;

    updatedTableData.forEach((row) => {
      const price = parseFloat(row[2]) || 0;
      const qty = parseFloat(row[6]) || 0;
      const discount = parseFloat(row[4]) || 0;
      const totalPrice = parseFloat(row[7]) || 0;

      totalAmount += price * qty;
      totalDiscount += (price * qty) - totalPrice;
      payableAmount += totalPrice;
    });

    setFormData((prevData) => ({
      ...prevData,
      totalAmount: totalAmount.toFixed(2),
      discountPrice: totalDiscount.toFixed(2),
      amount: payableAmount.toFixed(2),
      dueAmount: payableAmount.toFixed(2),
      paidAmount: 0,
    }));
  };

  //delete invoiceProduct==========================================================================
  const handleRemoveProduct = async (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this product?');
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${config.BASE_URL}/invoiceProducts/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTableData(prevData => prevData.filter(row => row[11] !== productId));
        console.log('Product removed successfully');
      } else {
        console.error('Failed to remove product');
      }
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };


  //product search ================================================================================
  const handleProductSelect = (product) => {
    setProductId(product.productId);
    setFormData(prevData => ({
      ...prevData,
      productNo: product.productCode,
      productName: product.productName,
      productPrice: product.productSellingPrice,
      qty: 1,
      discount: product.productDiscount,
      totalPrice: product.productSellingPrice,
      discountProductPrice: product.productSellingPrice,
      productNote: product.productWarranty + ' ' + product.productDescription,
      emi: product.productEmi
    }));
    if (product.productId) {
      fetchStockData(product.productId);
    }
  };

  //store transaction and other details fun===============================================================
  const navigate = useNavigate();

  const [draftSuccess, setDraftSuccess] = useState(` has been saved successfully!✅`);
  const changeStatus = () => {
    setDraft('true');
    setDraftSuccess(` has been saved as a draft successfully!✅`)
  };
  const handleInvoice = (e) => {
    const store = e.target.value;
    setSelectedStore(store);
    setCustomerStore(store);
  };
  const handleDelivary = (e) => {
    if (e.target.checked) {
      setDelivary('notDelivered');
      setInvoiceStatus('delivery');
    } else {
      setDelivary('invoice');
    }
  }
  const handleCard = (e) => {
    setCard(e.target.checked)
  }
  const handleCash = (e) => {
    setCash(e.target.checked)
  }
  const handleCredit = (e) => {
    setCredit(e.target.checked);
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        credit: 0
      }));
    }
  }
  const handleCheque = (e) => {
    setCheque(e.target.checked)
  }
  const handleBank = (e) => {
    setBank(e.target.checked)
  }
  const handleOnlinePay = (e) => {
    setOnline(e.target.checked)
  }
  //checkbox options============================================================================
  const [checkboxStates, setCheckboxStates] = useState({
    address: false,
    bank: false,
    phone: false,
    email: false,
    note: false,
  });

  const handleCheckboxChange = (name) => {
    setCheckboxStates((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  //check purchaseno============================================================================
  const checkPurchaseNoExists = async (purchaseNo) => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoice/purchaseNo/${purchaseNo}`);
      if (response.ok) {
        const data = await response.json();
        return data.exists; // Returns true if purchaseNo exists, false otherwise
      }
      return false;
    } catch (error) {
      console.error('Error checking purchaseNo:', error);
      return false;
    }
  };

  //handleSubmit==============================================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate tableData
      if (tableData.length === 0) {
        alert('Please add at least one product before submitting.');
        return;
      }

      // Log tableData for debugging
      console.log('Table Data:', tableData);

      // Create or update the invoice
      const invoiceData = {
        invoiceDate: DateTime().date + " " + DateTime().time,
        status: invoiceStatus,
        purchaseNo: formData.purchaseNo,
        store: selectedStore,
        cusId: cusId,
        draft: draft
      };

      const invoiceResponse = await fetch(`${config.BASE_URL}/invoice/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!invoiceResponse.ok) {
        const errorData = await invoiceResponse.json();
        console.error('Invoice error details:', errorData);
        throw new Error(errorData.error || 'Failed to create invoice');
      }

      const invoiceResult = await invoiceResponse.json();
      console.log('Invoice created/updated:', invoiceResult);

      // Handle image upload
      const formDataImage = new FormData();
      formDataImage.append("image", file);

      const imageResponse = await fetch(`${config.BASE_URL}/invoice/${invoiceResult.invoiceId}`, {
        method: "POST",
        body: formDataImage,
      });

      const imageResult = await imageResponse.json();
      console.log("Image uploaded successfully:", imageResult);

      // Process products
      for (const row of tableData) {
        const productData = {
          productId: row[9],
          stockId: row[10],
          invoiceId: invoiceResult.invoiceId,
          invoiceNo: invoiceResult.invoiceNo,
          totalAmount: row[7],
          invoiceQty: row[6],
          sendQty: row[6],
          deliverdQty: 0,
          discount: row[4] || 0,
          unitAmount: row[2],
          invoiceProductStatus: delivary,
          warranty: row[8]
        };

        const invoiceProductResponse = await fetch(`${config.BASE_URL}/invoiceProductById/${row[11]}`)
        const invoiceProduct = await invoiceProductResponse.json();

        const newProductData = {
          stockId: row[10],
          totalAmount: row[7],
          invoiceQty: row[6],
          sendQty: row[6],
          deliverdQty: 0,
          discount: row[4] || 0,
          unitAmount: row[2],
          warranty: row[8],
          newStockqty: invoiceProduct.invoiceQty,
          productName: row[1]
        };

        if (row[11] > 0) {
          const updateResponse = await fetch(`${config.BASE_URL}/invoiceProducts/${row[11]}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProductData),
          });

          if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            if (errorData.insufficientProducts) {
              const errorMessage = errorData.insufficientProducts
                .map(product =>
                  `Product: ${product.productName}\n` +
                  `Available Stock: ${product.availableStock}\n` +
                  `Requested Quantity: ${product.requestedQuantity}`
                )
                .join('\n\n');

              alert(`Insufficient Stock:\n${errorMessage}`);
              return;
            }
            console.error('Error updating product:', errorData);
            throw new Error(errorData.error || 'Failed to update product');
          }

        } else {
          // Create new product
          const createResponse = await fetch(`${config.BASE_URL}/invoiceProduct`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify([productData]), // Ensure the payload is an array
          });

          if (!createResponse.ok) {
            const errorData = await createResponse.json();
            if (errorData.insufficientProducts) {
              const errorMessage = errorData.insufficientProducts
                .map(product =>
                  `Product: ${product.productName}\n` +
                  `Available Stock: ${product.availableStock}\n` +
                  `Requested Quantity: ${product.requestedQuantity}`
                )
                .join('\n\n');

              alert(`Insufficient Stock:\n${errorMessage}`);
              return;
            }
            console.error('Error creating product:', errorData);
            throw new Error(errorData.error || 'Failed to create product');
          }

          console.log('Product created:', productData);
        }
      }

      // Handle transaction data
      const transactionData = {
        transactionType: [
          showCard && 'card',
          showCash && 'cash',
          showCredit && 'credit',
          showCheque && 'cheque',
          showOnline && 'online',
          showBank && 'bank'
        ].filter(Boolean).join(' '),
        price: parseFloat(formData.amount) || 0,
        dateTime: DateTime().date + " " + DateTime().time,
        discount: parseFloat(formData.discountPrice) || 0,
        note: formData.note || '',
        paid: parseFloat(formData.paidAmount) || 0,
        due: parseFloat(formData.dueAmount) || 0,
        OgDue: parseFloat(formData.dueAmount) || 0,
        chequeDate: formData.chequeDate || DateTime().date,
        totalAmount: formData.totalAmount,
        invoiceId: invoiceResult.invoiceId,
        userId: formData.user,
        cusId: cusId
      };

      const transactionResponse = await fetch(`${config.BASE_URL}/transactions/invoiceId/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!transactionResponse.ok) {
        const errorData = await transactionResponse.json();
        console.error('Transaction error details:', errorData);
        throw new Error(errorData.error || 'Failed to create transaction');
      }

      const transactionResult = await transactionResponse.json();
      console.log('Transaction created:', transactionResult);

      alert(`${invoiceTy} ${draftSuccess}`);

      if (draft === 'false' && invoiceTy === 'invoice') {
        const queryParams = new URLSearchParams(checkboxStates).toString();
        navigate(`/invoice/${selectedStore}/${invoiceResult.invoiceNo}?${queryParams}`);
      }

      setTableData([]);
      resetForm();
      resetSalesPerson();
    } catch (error) {
      console.error('Error:', error);
      alert(`${error.message}`);
    }
  };

  //rest btn==================================================================================================
  const resetForm = () => {
    setCustomerStore('');
    setTableData([]);
    setFormData({
      cusName: '',
      cusNic: '',
      cusCode: '',
      productNo: '',
      productName: '',
      productPrice: '',
      qty: '',
      discount: '',
      discountRs: '',
      totalPrice: '',
      productNote: '',
      emi: '',
      amount: '',
      card: '',
      chequeDate: '',
      cheque: '',
      online: '',
      bank: '',
      cash: '',
      paidAmount: '',
      dueAmount: '',
      note: '',
      totalAmount: '',
      discountPrice: '',
      cusJob: '',
      cusOffice: '',
      purchaseNo: '',
      cusAddress: ''
    });
  };

  const resetSalesPerson = () => {
    setFormData(prevData => ({
      ...prevData,
      salesPerson: 'select',
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;

    setFormData((prevData) => ({
      ...prevData,
      [name]: numericValue,
    }));

    const totalPaid = parseFloat(name === 'card' ? numericValue : formData.card || 0)
      + parseFloat(name === 'cheque' ? numericValue : formData.cheque || 0)
      + parseFloat(name === 'bank' ? numericValue : formData.bank || 0)
      + parseFloat(name === 'cash' ? numericValue : formData.cash || 0)
      + parseFloat(name === 'online' ? numericValue : formData.online || 0)
      + parseFloat(name === 'credit' ? numericValue : formData.credit || 0);

    const payableAmount = parseFloat(formData.amount) || 0;
    const dueAmount = payableAmount - totalPaid;
    setFormData((prevData) => ({
      ...prevData,
      paidAmount: totalPaid.toFixed(2),
      dueAmount: dueAmount.toFixed(2),
    }));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div>
      <div className='show-Header'><Header /></div>

      <div className="scrolling-container ">
        <h4>Sales Invoice</h4>
        <form action="" onSubmit={handleSubmit} className='newsale_form'>
          <div className="customer-form">
            <div className="sales-add-form">
              <div className="customer">
                <div className="subCaption">
                  <p><User />Customer Details</p>
                  <Link to={'/customer/customer-list'} >
                    <button className="btn btn-success btn-sm mb-3" type="button" style={{ fontSize: '12px' }}>
                      Create Customer
                    </button>
                  </Link>
                </div>

                <div className="customer-details">
                  <label htmlFor="">Customer Name</label>
                  {/* <input onChange={handleChange} value={formData.cusName} type="text" className="form-control" name="cusName" id="cusName" placeholder="Customer Name" /> */}
                  <CustomerSearch
                    value={formData.cusName} type="text" className="form-control" name="cusName" id="cusName" placeholder="Customer Name"
                    onChange={handleChange}
                    onCustomerSelect={(customer) => {
                      fetchCustomerData(customer.cusName);
                    }}
                  />
                </div>
                <div className="customer-details">
                  <label htmlFor="">Customer Job</label>
                  <input onChange={handleChange} value={formData.cusJob} type="text" className="form-control" name="cusJob" id="cusJob" placeholder="Customer Job Position" />
                </div>
                <div className="customer-details">
                  <label htmlFor="">Customer Office</label>
                  <input onChange={handleChange} value={formData.cusOffice} type="text" className="form-control" name="cusOffice" id="cusOffice" placeholder="Customer Company" />
                </div>
                <div className="customer-details">
                  <label htmlFor="">Customer Address</label>
                  <input onChange={handleChange} value={formData.cusAddress} type="text" className="form-control" name="cusAddress" id="cusAddress" placeholder="Customer Address" />
                </div>

                <div className="seltction_options">
                  <div className="store">

                    <div className="payment-details">
                      <div className="payment-details-amount">
                        <input type="radio" name="store" value='Colkan' id="Colkan" checked={customerStore === 'Colkan'} onChange={handleInvoice} style={{ width: '20px' }} />
                        <label className='payment-lable' htmlFor="">Colkan</label>
                      </div>
                    </div>

                    <div className="payment-details">
                      <div className="payment-details-amount">
                        <input type="radio" name="store" value='TerraWalkers' id="TerraWalkers" checked={customerStore === 'TerraWalkers'} onChange={handleInvoice} />
                        <label className='payment-lable' htmlFor="">TerraWalkers</label>
                      </div>
                    </div>

                    <div className="payment-details">
                      <div className="payment-details-amount">
                        <input type="radio" name="store" value='Haman' id="Haman" checked={customerStore === 'Haman'} onChange={handleInvoice} />
                        <label className='payment-lable' htmlFor="">Haman</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="product">
                <div className="subCaption d-flex justify-content-between  mb-3">
                  <p className="mb-0 d-flex align-items-center">
                    <ShoppingCart className="me-2" /> Product Details
                  </p>
                  <button
                    className="btn btn-success btn-sm me-2"
                    type="button"
                    onClick={() => navigate('/product/product-list')}
                    style={{ fontSize: '12px' }}
                  >
                    Create Product
                  </button>
                </div>

                <div className="row">
                  <div className="product-details col-md-4 mb-2">
                    <label htmlFor="">Product Number</label>
                    <input onChange={handleChange} value={formData.productNo} type="text" name="productNo" className="form-control" id="productNo" placeholder="Product Code" />
                  </div>
                  <div className="product-details col-md-8 mb-2">
                    <label htmlFor="">Product Name</label>

                    {/* <input onChange={handleChange} value={formData.productName} type="text" name="productName" className="form-control" id="productName" placeholder="Product Name" /> */}
                    <ProductSearch
                      value={formData.productName}
                      onChange={handleChange}
                      onProductSelect={handleProductSelect}
                    />
                  </div>
                  <div className="product-details col-md-3 mb-2">
                    <label htmlFor="">Product Price</label>
                    <input onChange={handleChange} value={formData.productPrice} type="number" name="productPrice" className="form-control" id="price" placeholder="Product Price" onWheel={(e) => e.target.blur()} />
                  </div>
                  <div className="product-details col-md-3 mb-2">
                    <label htmlFor="">Discounted Product Price</label>
                    <input onChange={handleChange} value={formData.discountProductPrice} type="number" name="productPrice" className="form-control" id="price" placeholder="Product Price" onWheel={(e) => e.target.blur()} />
                  </div>
                  <div className="product-details col-md-3 mb-2">
                    <label htmlFor="">Quantity</label>
                    <input onChange={handleChange} value={formData.qty} type="number" name="qty" className="form-control" id="qty" placeholder="Enter Quantity" />
                  </div>
                  <div className="product-details col-md-3 mb-2">
                    <label htmlFor="">Total Amount</label>
                    <input onChange={handleChange} value={formData.totalPrice} type="number" onWheel={(e) => e.target.blur()} name="totalPrice" className="form-control" id="totalPrice" placeholder="Total Price" />
                  </div>
                  {/* <div className="product-details col-md-3 mb-2">
                      <input onChange={handleChange} value={formData.discount} type="number" onWheel={(e) => e.target.blur()} name="discount" className="form-control" id="discount" placeholder="Product Discount %" />
                    </div>
                    <div className="product-details col-md-3 mb-2">
                      <input onChange={discount} value={formData.discountRs} type="number" onWheel={(e) => e.target.blur()} name="discountRs" className="form-control" id="discountRs" placeholder="Product Discount - Rs LKR" />
                    </div> */}

                  <div className="product-details col-md-3 mb-2">
                    <label htmlFor="discountType">Discount Type</label>
                    <select
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      value={formData.discountType || ''}
                      name="discountType"
                      className="form-control"
                      id="discountType"
                    >
                      <option value="">Select Type</option>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>

                  {formData.discountType === 'percentage' && (
                    <div className="product-details col-md-3 mb-2">
                      <label htmlFor="discount">Discount (%)</label>
                      <input
                        onChange={handleChange}
                        value={formData.discount}
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        name="discount"
                        className="form-control"
                        id="discount"
                        placeholder="Product Discount %"
                      />
                    </div>
                  )}

                  {formData.discountType === 'fixed' && (
                    <div className="product-details col-md-3 mb-2">
                      <label htmlFor="discountRs">Discount (LKR)</label>
                      <input
                        onChange={handleChange}
                        value={formData.discountRs}
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        name="discountRs"
                        className="form-control"
                        id="discountRs"
                        placeholder="Product Discount - Rs LKR"
                      />
                    </div>
                  )}
                  <div className="row">
                    <div className="product-details col-md-6 mb-2">
                      <label htmlFor="">Product Note</label>
                      <textarea onChange={handleChange} value={formData.productNote} name="productNote" className="form-control" id="productNote" placeholder="Warranty" rows="3"></textarea>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className="sales-addbtn d-grid d-md-flex me-md-2 justify-content-end px-5">
              <button className="btn btn-primary btn-md" onClick={handleAddProduct} style={{ fontSize: "12px" }}>Add Product</button>
            </div>
          </div>

          <div className="product-table">
            <table className="table table-dark table-striped table-responsive">
              <thead className=''>
                <tr>
                  {Columns.map((column, index) => (
                    <th key={index}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className='text-center'>
                        {cellIndex === 2 || cellIndex === 4 || cellIndex === 3 || cellIndex === 6 || cellIndex === 8 ? (
                          <input
                            type="number"
                            value={cell}
                            onChange={(e) => handleCellEdit(rowIndex, cellIndex, e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            className='form-control'
                            style={{ width: `15ch` }}
                          />
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="payment-form">
            <div className="payment-form-group">
              <div className="sales-person-box">

                <div className="sales-person">
                  <label id='label'>Cashier</label>
                  <input type="text" name="userName" value={formData.userName} onChange={handleChange} className="form-control" readOnly />
                </div>
                <div className="sales-person">
                  <label htmlFor="" id='label'>Invoice Date</label>
                  <input type="datetime-local" className="form-control" name="invoiceDate" onChange={handleChange} value={formData.invoiceDate} id="date" />
                </div>
                <div className="sales-person">
                  <label id='label'>Purchase Order No</label>
                  <input type="text" className="form-control" name="purchaseNo" id='purchaseNo' value={formData.purchaseNo} onChange={handleChange} />
                </div>
                <div className="sales-person">
                  <label id='label'>Purchase Order Image</label>
                  <input type="file" className="form-control" onChange={handleFileChange} accept="image/*,.pdf" />
                </div>
              </div>

              <div className="amount-box">
                <div className="amount-group">
                  <label htmlFor="" id='label'>Total Amount</label>
                  <input type="number" className="form-control" value={formData.totalAmount} onChange={handleChange} id='readOnly' readOnly />
                </div>
                <div className="amount-group">
                  <label htmlFor="" id='label'>Discount</label>
                  <input type="number" className="form-control" value={formData.discountPrice} onChange={handleChange} id='readOnly' readOnly />
                </div>
              </div>
            </div>

            <div className="payment-form-group">
              <div className="payment-details-box">

                <div className="payment-details">
                  <label htmlFor="" id='label'>Payable Amount</label>
                  <input type="number" className="form-control" value={formData.amount} id='readOnly' readOnly />
                </div>

                <div className="payment-details">
                  <div className="payment-details-amount">
                    <input type="checkbox" name="cashAmount" id="cashAmount" onChange={handleCash} className='payment-method' />
                    <label htmlFor="cashAmount" id='label' className='payment-card'>Cash Payment</label>
                  </div>

                  {showCash && (
                    <input type="number" className="form-control" id='payment' name='cash' value={formData.cash} onChange={handlePaymentChange} placeholder='Cash Amount' onWheel={(e) => e.target.blur()} />
                  )}
                </div>

                <div className="payment-details">
                  <div className="payment-details-amount">
                    <input type="checkbox" name="card" id="card" onChange={handleCard} className='payment-method' />
                    <label htmlFor="card" id='label' className='payment-card'>Card Payment</label>
                  </div>
                  {showCard && (
                    <input type="number" className="form-control" id='' name='card' onChange={handlePaymentChange} value={formData.card} placeholder='Card Payment' onWheel={(e) => e.target.blur()} />
                  )}
                </div>

                <div className="payment-details">
                  <div className="payment-details-amount">
                    <input type="checkbox" name="credit" id="credit" onChange={handleCredit} className='payment-method' />
                    <label htmlFor="credit" id='label' className='payment-card'>Credit Payment</label>
                  </div>
                  {/* {showCredit && (
      <input type="number" className="form-control" id='payment' name='credit' value={formData.credit} onChange={handlePaymentChange} placeholder='credit Amount' onWheel={(e) => e.target.blur()} />
    )} */}
                  {/* {showCredit && (
    <input type="number" className="form-control" id='payment' name='credit' value={formData.credit} onChange={handlePaymentChange} placeholder='credit Amount' onWheel={(e) => e.target.blur()}
    />
  )} */}
                </div>
                <div className="payment-details">
                  <div className="payment-details-amount">
                    <input type="checkbox" name="cheque" id="cheque" onChange={handleCheque} className='payment-method' />
                    <label htmlFor="cheque" id='label' className='payment-card'>Cheque Payment</label>
                  </div>
                  {showCheque && (
                    <div>
                      <input type="number" className="form-control" id='' name='cheque' value={formData.cheque} onChange={handlePaymentChange} placeholder='Cheque Payment' onWheel={(e) => e.target.blur()} />
                      <input type="date" name="chequeDate" id="chequeDate" className='form-control mt-2' value={formData.chequeDate} onChange={handleChange} />
                    </div>
                  )}
                </div>
                <div className="payment-details">
                  <div className="payment-details-amount">
                    <input type="checkbox" name="online" id="online" onChange={handleOnlinePay} className='payment-method' />
                    <label htmlFor="online" id='label' className='payment-card'>Online Payment</label>
                  </div>
                  {showOnline && (
                    <input type="number" className="form-control" id='' name='online' value={formData.online} onChange={handlePaymentChange} placeholder='online Payment' onWheel={(e) => e.target.blur()} />
                  )}
                </div>
                <div className="payment-details">
                  <div className="payment-details-amount">
                    <input type="checkbox" name="bank" id="bank" onChange={handleBank} className='payment-method' />
                    <label htmlFor="bank" id='label' className='payment-card'>Bank Payment</label>
                  </div>
                  {showBank && (
                    <input type="number" className="form-control" id='' name='bank' value={formData.bank} onChange={handlePaymentChange} placeholder='Bank Payment' onWheel={(e) => e.target.blur()} />
                  )}
                </div>
              </div>
              <div className="amount-box">
                <div className="amount-group">
                  <label htmlFor="" id='label'>Paid Amount</label>
                  <input className="form-control" value={formData.paidAmount} type="number" onWheel={(e) => e.target.blur()} name="totalAmount" id="readOnly" readOnly />
                </div>
                <div className="amount-group">
                  <label htmlFor="" id='label'>Due Amount</label>
                  <input className="form-control" type="number" value={formData.dueAmount} onWheel={(e) => e.target.blur()} name="discount" id="readOnly" readOnly />
                </div>
                <div className="amount-group">
                  <label htmlFor="" id='label'>Note</label>
                  <textarea name="note" id="note" value={formData.note} rows={3} placeholder='Note' className='form-control' onChange={handleChange} />
                </div>
                {/* <div className="seltction_options">
                  <div className="store">
                    <div className="payment-details-amount">
                      <input type="checkbox" name="notDelivered" value='notDelivered' id="notDelivered" onChange={handleDelivary} />
                      <label className='payment-lable' htmlFor="">Delivey</label>
                    </div>
                  </div>
                </div> */}
                <div className="btn-pos mt-4 d-flex justify-content-between  align-items-center">
                  <div className="option-invoice">
                    <form action="">
                      <br />
                      <label className='invoice-type-label' htmlFor="">Address</label>
                      <input type="checkbox" name="address" checked={checkboxStates.address} onChange={() => handleCheckboxChange('address')} className='invoice-checkbox' />
                      <br />
                      <label className='invoice-type-label' htmlFor="">Bank</label>
                      <input type="checkbox" name="bank" checked={checkboxStates.bank} onChange={() => handleCheckboxChange('bank')} className='invoice-checkbox' />

                      <br />
                      <label className='invoice-type-label' htmlFor="">Phone</label>
                      <input type="checkbox" name="phone" checked={checkboxStates.phone} onChange={() => handleCheckboxChange('phone')} className='invoice-checkbox' />
                      <br />
                      <label className='invoice-type-label' htmlFor="">Email</label>
                      <input type="checkbox" name="email" checked={checkboxStates.email} onChange={() => handleCheckboxChange('email')} className='invoice-checkbox' />
                      <br />
                      <label className='invoice-type-label' htmlFor="">Note</label>
                      <input type="checkbox" name="note" checked={checkboxStates.note} onChange={() => handleCheckboxChange('note')} className='invoice-checkbox' />
                    </form>
                  </div>
                  <div className="sales-btn">
                    <div className="payment-form-button d-grid d-md-flex me-md-2 justify-content-end px-5">
                      <button className='btn btn-primary mb-2' type='submit' onClick={changeStatus} style={{ fontSize: '12px' }}>Draft</button>
                    </div>
                    <div className="payment-form-button  d-grid d-md-flex me-md-2 justify-content-end px-5">
                      <button className='btn btn-danger btn-md mb-2' type='reset' onClick={resetForm} style={{ fontSize: '12px' }} >Cancel</button>
                      <button className='btn btn-warning btn-md mb-2' type='submit' style={{ fontSize: '12px' }}>Create {invoiceTy || "invoice"}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div >
    </div >
  )
}

export default DraftSales;
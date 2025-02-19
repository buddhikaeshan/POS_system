import React, { useState, useEffect, useRef } from 'react';
import config from '../../config';

const CustomerSearch = ({ onCustomerSelect, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${config.BASE_URL}/customers/suggestions?query=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    onChange(e);
    fetchSuggestions(value);
  };

  const handleSelectCustomer = (customer) => {
    onCustomerSelect(customer);
    setShowSuggestions(false);
  };

  return (
    <div className="position-relative" ref={wrapperRef}>
      <input
        type="text"
        className="form-control"
        name="cusName"
        value={value}
        onChange={handleInputChange}
        placeholder="Customer Name"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="position-absolute w-100 bg-white shadow-sm border rounded mt-1 z-50">
          {suggestions.map((customer, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectCustomer(customer)}
            >
              {customer.cusName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;
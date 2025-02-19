import React from 'react'
import { Route, Routes } from 'react-router-dom';
import './Customer.css'
import Header from '../../components/SideBar/Header'

import CustomerList from '../../components/CustomerPages/CustomerList'
import SaleDuePayment from '../../components/CustomerPages/SaleDuePayment'
import DueCustomer from '../../components/CustomerPages/DueCustomer';

const Customer = () => {
  return (
    <div>
      <div className='show-Header'><Header /></div>
        <Routes>
            <Route path='/customer-list' element={<CustomerList/>} />
            <Route path='/dueCustomer' element={<DueCustomer/>} />
            <Route path='/sale-due-payment' element={<SaleDuePayment/>} />
        </Routes>
    </div>
  )
}

export default Customer
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SupplierDetails from '../../components/SupplierPages/SupplierDetails'
import SupplierPayments from '../../components/SupplierPages/SupplierPayments'
import Header from '../../components/SideBar/Header'
import SupplierChequePayments from '../../components/SupplierPages/SupplierChequePayments'

function Supplier() {
  return (
    <div>
      <div className='show-Header'><Header /></div>
      <Routes>
        <Route path='supplier' element={<SupplierDetails />} />
        <Route path='supplier-payments' element={<SupplierPayments />} />
        <Route path='supplierChequePayments' element={<SupplierChequePayments />} />
      </Routes>
    </div>
  )
}

export default Supplier
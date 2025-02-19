import React from 'react'
import { Route, Routes } from 'react-router-dom';
import CreateProductReturn from '../../components/StockPages/CreateProductReturn';
import ReturnedProductList from '../../components/StockPages/ReturnedProductList';
import Header from '../../components/SideBar/Header'
const Return = () => {
  return (
    <div>
      <div className='show-Header'><Header /></div>
      <Routes>
      <Route path="create" element={<CreateProductReturn />} />
        <Route path="list" element={<ReturnedProductList />} />
      </Routes>
    </div>
  )
}

export default Return
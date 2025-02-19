import React from 'react'
import { Route, Routes } from 'react-router-dom';
import StockAdjustment from '../../components/StockPages/StockAdjustment';
import StockAdjustmentHistory from '../../components/StockPages/StockAdjustmentHistory';
import NewStock from '../../components/StockPages/NewStock';
import Header from '../../components/SideBar/Header'
import ReturnStock from '../../components/StockPages/ReturnStock';
import ReturnStockList from '../../components/StockPages/ReturnStockList';

const Stock = () => {
  return (
    <div>
      <div className='show-Header'><Header /></div>
      <Routes>
        <Route path='new-stock' element={<NewStock />} />
        <Route path="adjustment" element={<StockAdjustment />} />
        <Route path="adjustment_history" element={<StockAdjustmentHistory />} />
        <Route path="returnStock" element={<ReturnStock />} />
        <Route path="returnStockList" element={<ReturnStockList />} />
      </Routes>
    </div>
  )
}

export default Stock
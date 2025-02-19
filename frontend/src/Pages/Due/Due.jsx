import React from 'react'
import { Route, Routes } from 'react-router-dom';
import './Due.css'
import Header from '../../components/SideBar/Header'
import DueCus from '../../components/Due/DueCus';
import AllDue from '../../components/Due/AllDue';
import AllDueHistory from '../../components/Due/AllDueHistory';
import ViewDue from '../../components/Due/VIewDue';
import DatedCheques from '../../components/Due/DatedCheques';


const Due = () => {
  return (
    <div>
      <div className='show-Header'><Header /></div>
        <Routes>
            
            <Route path='/due-customer-list' element={<DueCus/>} />
            <Route path='/all-due-customer-list' element={<AllDue/>} />
            <Route path='/all-due-history' element={<AllDueHistory/>} />
            <Route path='/view-cus-due-history' element={<ViewDue/>} />
            <Route path='/view-dated-cheques' element={<DatedCheques/>} />
            
        </Routes>
    </div>
  )
}

export default Due
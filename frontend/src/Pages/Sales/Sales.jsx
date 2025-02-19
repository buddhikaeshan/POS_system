import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NewSales from '../../components/SalesPages/NewSales';
import SalesHistory from '../../components/SalesPages/SalesHistory';
import Header from '../../components/SideBar/Header'
import Draft from '../../components/SalesPages/Draft';
import Credit from '../../components/SalesPages/Creadit';
import Delivery from '../../components/SalesPages/Delivery';
import Invoice from '../../components/SalesPages/Invoice';
import DraftInvoice from '../../components/SalesPages/DraftPages/DraftInvoice';
import DraftDelivery from '../../components/SalesPages/DraftPages/DraftDelivery';
import DraftCredit from '../../components/SalesPages/DraftPages/DraftPerforma';
import DraftQuotaion from '../../components/SalesPages/DraftPages/DraftQuotation';
import DraftReturns from '../../components/SalesPages/DraftPages/DraftReturns';

const Sales = () => {
  return (
    <div>
      <div className='show-Header'><Header /></div>
      <Routes>
        <Route path="new/:invoiceType" element={<NewSales />} />
        <Route path="history" element={<SalesHistory />} />
        <Route path="invoice" element={<Invoice />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="draft" element={<Draft />} />
        <Route path="credit" element={<Credit />} />
        <Route path="draftInvoice" element={<DraftInvoice />} />
        <Route path="draftDelivery" element={<DraftDelivery />} />
        <Route path="draftPerforma" element={<DraftCredit />} />
        <Route path="draftQuotation" element={<DraftQuotaion />} />
        <Route path="draftReturns" element={<DraftReturns />} />
      </Routes>
    </div>
  );
};

export default Sales;
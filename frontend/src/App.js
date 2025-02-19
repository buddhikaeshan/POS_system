import './App.css';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/SideBar/SideBar';
import Dashboard from './Pages/Dashboard/Dashboard';
import Sales from './Pages/Sales/Sales';
import Customer from './Pages/Customer/Customer';
import Product from './Pages/Product/Product';
import GRN from './Pages/GRN/GRN';
import Stock from './Pages/Stock/Stock';
import Staff from './Pages/Staff/Staff';
import StockReports from './Pages/StockReports/StockReports';
import SalesReports from './Pages/SalesReport/SalesReports';
import Supplier from './Pages/Supplier/Supplier';
import Rental from './Pages/Rental/Rental';
import Login from './Pages/Login';
import Header from './components/SideBar/Header';
import SelectInvoice from './components/invoicePages/selectInvoice';
import Upload from './Pages/Upload/Upload';
import SalesDetails from './components/SalesPages/SalesDetails';
import CostingTable from './Pages/Cost Table/CostingTable';
import CostingTableUpdate from './Pages/Cost Table/CostingTableUpdate';
import CreditNote from './components/StockPages/Credit Note/CreditNote';
import DeliveryNote from './components/DelivaryPages/DeliveryNote';
import SelectDN from './components/DelivaryPages/SelectDN';
import ProformaInvoice from './components/PerformaInvoice/ProformaInvoice';
import InvoiceNote from './components/invoicePages/InvoiceNote';
import DraftSales from './components/SalesPages/DraftSales';
import Qutation from './Pages/Cost Table/Qutation';
import QuotationInvoice from './Pages/Cost Table/QuotationInvoice';
import Return from './Pages/Return/Return';
import SelectPF from './components/PerformaInvoice/SelectPF';
import SelectCR from './components/StockPages/Credit Note/SelectCR';
import { NoteProvider } from './Context/NoteContext';
import EditDelivery from './components/DelivaryPages/EditDelivery';
import InternetModal from './components/NoConnection/InternetModal';
import Due from './Pages/Due/Due';
import CusDue from './components/Due/CusDue';
import CreatePF from './components/PerformaInvoice/CreatePF';
import DueInvoice from './components/Due/DueInvoice';
import UnpaidInvoice from './components/Due/Unpaid';
import SupplierVisePayments from './Models/SupplierForm/SupplierVisePayments';
import ScrollToTopButton from './components/ScrollToTopButton';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const userType = localStorage.getItem("userType");

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname.toLowerCase() === '/login';

  return (
    <div className="laptop:origin-top-left d-flex flex-column vh-100">
      <InternetModal />
      <div className='Header-show'>{!isLoginPage && <Header />}</div>
      <div className="d-flex flex-grow-1">
        {!isLoginPage &&
          <div className="side-bar-res">
            <SideBar />
          </div>}
        <div
          className="flex-grow-1 overflow-auto pages-content"
          style={{ marginLeft: !isLoginPage ? '200px' : '0px', width: '100%' }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={userType === "User" ? (<Navigate to="/sales/invoice" />) : (<Dashboard />)} />
            <Route path="/sales/*" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
            <Route path="/rental/*" element={<ProtectedRoute><Rental /></ProtectedRoute>} />
            <Route path="/return/*" element={<ProtectedRoute><Return /></ProtectedRoute>} />
            <Route path="/customer/*" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
            <Route path="/product/*" element={<ProtectedRoute><Product /></ProtectedRoute>} />
            <Route path="/grn/*" element={<ProtectedRoute><GRN /></ProtectedRoute>} />
            <Route path="/stock/*" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
            <Route path="/sales-reports/*" element={<ProtectedRoute><SalesReports /></ProtectedRoute>} />
            <Route path="/stock-reports/*" element={<ProtectedRoute><StockReports /></ProtectedRoute>} />
            <Route path="/staff/*" element={<ProtectedRoute><Staff /></ProtectedRoute>} />

            <Route path="/supplier/*" element={<ProtectedRoute><Supplier /></ProtectedRoute>} />
            <Route path="/supplier-payments/:supplierId" element={<ProtectedRoute><SupplierVisePayments /></ProtectedRoute>} />

            <Route path="/due-customer/*" element={<ProtectedRoute><Due /></ProtectedRoute>} />
            <Route path="/cus-due/:cusId" element={<ProtectedRoute><CusDue /></ProtectedRoute>} />
            <Route path="/dueinvoice/:cusId" element={<ProtectedRoute><DueInvoice /></ProtectedRoute>} />
            <Route path="/unpaidinvoice/:cusId" element={<ProtectedRoute><UnpaidInvoice /></ProtectedRoute>} />

            <Route path="/createInvoice/:store/:invoiceNo" element={<ProtectedRoute><SelectInvoice /></ProtectedRoute>} />
            <Route path="/invoice/:store/:invoiceNo" element={<ProtectedRoute><InvoiceNote /></ProtectedRoute>} />

            <Route path="/createPF/:store/:invoiceNo" element={<ProtectedRoute><SelectPF /></ProtectedRoute>} />
            <Route path="/createPerforma/:store/:invoiceNo" element={<ProtectedRoute><CreatePF /></ProtectedRoute>} />
            <Route path="/proformaInvoice/:store/:invoiceNo" element={<ProtectedRoute><ProformaInvoice /></ProtectedRoute>} />

            <Route path="/createDelivery/:store/:invoiceNo" element={<ProtectedRoute><SelectDN /></ProtectedRoute>} />
            <Route path="/EditDelivery/:store/:invoiceNo" element={<ProtectedRoute><EditDelivery /></ProtectedRoute>} />
            <Route path="/delivery/:store/:invoiceNo" element={<ProtectedRoute><DeliveryNote /></ProtectedRoute>} />

            <Route path="/creditNote/:store/:invoiceNo/:returnItemId" element={<ProtectedRoute><CreditNote /></ProtectedRoute>} />
            <Route path="/createCR/:invoiceNo/:returnItemId" element={<ProtectedRoute><SelectCR /></ProtectedRoute>} />

            <Route path="/salesDetails/:store/:invoiceNo" element={<ProtectedRoute><SalesDetails /></ProtectedRoute>} />

            <Route path="/DraftSales/:invoiceId/:invoiceType" element={<ProtectedRoute><DraftSales /></ProtectedRoute>} />
            <Route path="/DraftSales/:invoiceId/:invoiceType" element={<ProtectedRoute><DraftSales /></ProtectedRoute>} />
            <Route path="/DraftSales/:invoiceId/:invoiceType" element={<ProtectedRoute><DraftSales /></ProtectedRoute>} />
            <Route path="/DraftSales/:invoiceId/:invoiceType" element={<ProtectedRoute><DraftSales /></ProtectedRoute>} />

            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/costing-table" element={<ProtectedRoute><CostingTable /></ProtectedRoute>} />
            <Route path="/qutation" element={<ProtectedRoute><Qutation /></ProtectedRoute>} />
            <Route path="/qutation-invoice/:id" element={<ProtectedRoute><QuotationInvoice /></ProtectedRoute>} />
            <Route path="/costing-table/edit/:id" element={<ProtectedRoute><CostingTableUpdate /></ProtectedRoute>} />

          </Routes>
          <ScrollToTopButton />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <NoteProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </NoteProvider>
  );
}

export default App;
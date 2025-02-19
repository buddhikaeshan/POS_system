import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Boxes, Truck, FileText, Menu, FileUp, Sheet, User, AlignCenter, UserSearch, SquarePen, DatabaseBackup, CircleDollarSign, HandCoins } from 'lucide-react';
import './SideBar.css';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('token');
        localStorage.removeItem('userStatus');
        localStorage.removeItem('userType');

        navigate('/login');
    };


    useEffect(() => {
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);
    }, []);


    const checkTokenExpiration = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;

        if (payload.exp < now) {
            handleLogout();
        }
    };

    useEffect(() => {
        checkTokenExpiration();

        const intervalId = setInterval(checkTokenExpiration, 60 * 1000);

        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', handleResize);
        };
    });

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleSubmenuToggle = (index) => {
        if (activeSubmenu === index) {
            setActiveSubmenu(null);
        } else {
            setActiveSubmenu(index);
        }
    };

    const menuItems = [

        {
            title: 'Draft',
            icon: <SquarePen size={20} />,
            path: '/sales',
            submenus: [
                // { title: 'Draft', path: '/sales/draft' },
                { title: 'Invoice', path: '/sales/draftInvoice' },
                { title: 'Proforma Invoice', path: '/sales/draftPerforma' },
                { title: 'Delivery Note', path: '/sales/draftDelivery' },
                { title: 'Credit Note', path: '/sales/draftReturns' },
                { title: 'Quotatiion', path: '/sales/draftQuotation' },
            ]
        },
        {
            title: 'Sales',
            icon: <ShoppingCart size={20} />,
            path: '/sales',
            submenus: [
                // { title: 'Create Sale Invoice', path: '/sales/new' },
                { title: 'History', path: '/sales/history' },
                { title: 'Invoice', path: '/sales/invoice' },
                { title: 'Proforma Invoice', path: '/sales/credit' },
                { title: 'Delivery Note', path: '/sales/delivery' },
                { title: 'Credit Note', path: '/return/list' },
                { title: 'Quotation', path: '/qutation' },
                //{ title: 'Draft', path: '/sales/draft' },
            ]
        },
        /*{
            title: 'Rental Invoice',
            icon: <ShoppingCart size={20} />,
            path: '/sales',
            submenus: [
                { title: 'Create Rental Invoice', path: '/Rental/new' },
                { title: 'Sales History', path: '/Rental/history' },
            ]
        },*/
        // {
        //     title: 'Upload',
        //     icon: <FileUp size={20} />,
        //     path: '/upload',
        //     submenus: [
        //         { title: 'Upload Purchase Orders', path: '/upload' },
        //     ]
        // },
        // {
        //     title: 'Draft',
        //     icon: <SquarePen size={20} />,
        //     path: '/sales',
        //     submenus: [
        //         { title: 'Draft', path: '/sales/draft' },
        //     ]
        // },

        // {
        //     title: 'Costing Table',
        //     icon: <Sheet size={20} />,
        //     path: '/costing',
        //     submenus: [
        //         { title: 'Costing Table', path: '/costing-table' },
        //         { title: 'Qutation', path: '/qutation' },
        //     ]
        // },

        {
            title: 'Product',
            icon: <Package size={20} />,
            path: '/product',
            submenus: [

                { title: 'Create Category', path: '/product/category' },
                { title: 'Create Product', path: '/product/create' },
                { title: 'Product List', path: '/product/product-list' }
            ]
        },

        {
            title: 'Stock',
            icon: <Boxes size={20} />,
            path: '/stock',
            submenus: [
                { title: 'Stock Purchase', path: '/stock/new-stock' },
                // { title: 'Stock Return', path: '/return/create' },
                { title: 'Current Stock', path: '/stock-reports/current-stock' },
                { title: 'Return Stock', path: '/stock/returnStock' },
                { title: 'Return Stocks', path: '/stock/returnStockList' },
            ]
        },
        // {
        //     title: 'Return Product',
        //     icon: <DatabaseBackup size={20} />,
        //     path: '/return',
        //     submenus: [
        //{ title: 'Stock Return', path: '/return/create' },
        //         { title: 'Returned Product List', path: '/return/list' },
        //     ]
        // },
        {
            title: 'Customer',
            icon: <Users size={20} />,
            path: '/customer',
            submenus: [
                { title: 'Customer List', path: '/customer/customer-list' },
                // { title: 'Due Customers', path: '/due-customer/due-customer-list' },
                // { title: 'Due Customers', path: '/customer/dueCustomer' },
                // { title: 'Sale Due Payment', path: '/customer/sale-due-payment' },
                { title: 'Customers Due', path: '/due-customer/view-cus-due-history' },
                { title: 'Current Due List', path: '/due-customer/all-due-customer-list' },
                { title: 'All Due History', path: '/due-customer/all-due-history' },
                { title: 'Cheques Received', path: '/due-customer/view-dated-cheques' },
                // { title: 'View Due History', path: '/due-customer/all-due-history' },
                // { title: 'View Cus History', path: '/due-customer/view-cus-due-history' },
                // { title: 'Sale Due Payment', path: '/customer/sale-due-payment' },
            ]
        },



        // {
        //     title: 'GRN',
        //     icon: <File size={20} />,
        //     path: '/grn',
        //     submenus: [
        //         { title: 'Create GRN', path: '/grn/create-grn' },
        //         { title: 'GRN List', path: '/grn/list-grn' },
        //         { title: 'GRN Search', path: '/grn/search-grn' }
        //     ]
        // },

        {
            title: 'Supplier',
            icon: <Truck size={20} />,
            path: '/Supplier',
            submenus: [
                { title: 'Supplier List', path: '/supplier/supplier' },
                { title: 'Supplier Payable', path: '/supplier/supplier-payments' },
                { title: 'Cheques Drawn', path: '/supplier/supplierChequePayments' },
            ]
        },

        {
            title: 'Incomes',
            icon: <CircleDollarSign size={20} />,
            path: '/income',
            submenus: [
                { title: 'Enter Incomes', path: '/income/category' },
                { title: 'Create Category', path: '/income/enter' },
                { title: 'Create Incomes', path: '/income/create' },
                { title: 'Income List ', path: '/income/incomeslist' },
            ]
        },

        {
            title: 'Expenses',
            icon: <HandCoins size={20} />,
            path: '/expenses',
            submenus: [
                { title: 'Enter Expenses', path: '/expenses/category' },
                { title: 'Create Category', path: '/expenses/enter' },
                { title: 'Create Expenses', path: '/expenses/create' },
                { title: 'Expenses List ', path: '/expenses/expenseslist' },
            ]
        },


        // {
        //     title: 'Finance',
        //     icon: <BadgeDollarSignIcon size={20} />,
        //     path: '/finance',
        //     submenus: [
        //         { title: 'Daily Summary', path: '/finance/daily' },
        //         { title: 'Financial finance', path: '/finance/financial' },
        //         { title: 'Product Performance', path: '/finance/product' }
        //     ]
        // }, 
        userType !== 'User' && {
            title: 'Sales Reports',
            icon: <FileText size={20} />,
            path: '/sales-reports',
            submenus: [
                { title: 'Daily Summary', path: '/sales-reports/daily-summary' },
                { title: 'Sales History', path: '/sales-reports/sales-history' },
                { title: 'Profit and Loss Account', path: '/sales-reports' },
            ]
        },
        // {
        //     title: 'Stock Reports',
        //     icon: <FileText size={20} />,
        //     path: '/stock-reports',
        //     submenus: [
        //         { title: 'Current Stock', path: '/stock-reports/current-stock' },
        //         // { title: 'Stock History', path: '/stock-reports/stock-history' },
        //     ]
        // },
        userType !== 'User' && {
            title: 'Staff',
            icon: <User size={20} />,
            path: '/staff',
            submenus: [
                { title: 'Create Staff', path: '/staff/create-staff' },
                { title: 'Head ', path: '/staff/create-store' },
            ]
        },
    ].filter(Boolean);

    return (
        <>

            <button
                className="toggle-btn d-md-none rounded bg-warning mr-4"
                onClick={toggleSidebar}
                style={{
                    position: 'fixed',
                    top: '10px',
                    left: '10px',
                    zIndex: 1030,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                <Menu size={24} />
            </button>
            <div className="scrolling-sidebar">
                <nav className={`col-md-3 col-lg-2 d-md-block bg-color sidebar ${isCollapsed ? 'collapsed' : ''}`}
                    style={{
                        transform: isCollapsed ? 'translateX(-100%)' : 'translateX(0)',
                        transition: 'transform 0.3s ease-in-out'
                    }}
                >
                    <div className="text-center mt-2 p-2">
                        {/* <h1>LOGO</h1> */}
                    </div>
                    <div className="position-sticky pt-3">
                        <ul className="nav flex-column">
                            {userType !== 'User' && (
                                <li className="nav-item">
                                    <Link to="/" className="nav-link d-flex align-items-center">
                                        <span className="me-2"><LayoutDashboard size={20} /></span>
                                        <span className="fs-8 p-2 menu-link d-md-inline">Dashboard</span>
                                    </Link>
                                </li>
                            )}
                            {menuItems.map((item, index) => (
                                <li key={index} className="nav-item">
                                    <div className="nav-link d-flex align-items-center" onClick={() => handleSubmenuToggle(index)} style={{ cursor: 'pointer' }} >
                                        <span className="me-2">{item.icon}</span>
                                        <span className="fs-8 p-2 menu-link d-md-inline">{item.title}</span>
                                    </div>
                                    <div className={`submenu ${activeSubmenu === index ? 'expanded' : 'collapsed'}`}>
                                        <ul className="nav flex-column ms-3">
                                            {item.submenus.map((submenu, subIndex) => (
                                                <li key={subIndex} className="nav-item nav-sub">
                                                    <Link to={submenu.path} className="nav-link">{submenu.title}</Link>
                                                </li>

                                            ))}

                                        </ul>

                                    </div>

                                </li>

                            ))}

                        </ul>

                    </div>
                    <div className="d-flex justify-content-center mt-auto p-5">
                        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                    </div>
                </nav>

            </div>
        </>
    );
};

export default Sidebar;
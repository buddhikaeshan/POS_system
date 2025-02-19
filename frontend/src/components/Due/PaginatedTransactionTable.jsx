// import React, { useState } from 'react';

// const PaginatedTransactionTable = ({ 
//     data, 
//     showColumns, 
//     columnLabels, 
//     checkedRows, 
//     onCheckboxChange 
// }) => {
//     const ROWS_PER_PAGE = 12;
//     const [currentPage, setCurrentPage] = useState(Math.ceil(data.length / ROWS_PER_PAGE)); // Start with last page

//     // Calculate total pages
//     const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);

//     // Get current page's data
//     const indexOfLastRow = currentPage * ROWS_PER_PAGE;
//     const indexOfFirstRow = indexOfLastRow - ROWS_PER_PAGE;
//     const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     return (
//         <div>
//             <table className="table table-bordered">
//                 <thead className="table-light">
//                     <tr>
//                         {showColumns.date && <th>Date</th>}
//                         {showColumns.invoiceNo && <th>Invoice No</th>}
//                         {showColumns.chequeDetails && <th>Cheque Details</th>}
//                         {showColumns.chequeDate && <th>Payment Date</th>}
//                         {showColumns.datedCheque && <th>Dated Cheque</th>}
//                         <th>Days Left</th>
//                         {showColumns.debit && <th>Debit (Rs)</th>}
//                         {showColumns.credit && <th>Credit (Rs)</th>}
//                         {showColumns.balance && <th>Balance (Rs)</th>}
//                         {showColumns.paid && <th>Status</th>}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {currentRows.map((row, index) => {
//                         const actualIndex = indexOfFirstRow + index;
//                         const isOldInvoice = row.isMainRow && 
//                             ((new Date() - new Date(row.soldDate)) / (1000 * 60 * 60 * 24) >= 30) && 
//                             row.status === 'No';

//                         return (
//                             <tr
//                                 key={actualIndex}
//                                 style={{
//                                     backgroundColor: isOldInvoice ? '#ffcccc' : 
//                                                    row.isPaymentRow ? '#f0f0f0' : 'inherit'
//                                 }}
//                             >
//                                 {showColumns.date && <td>{row.soldDate}</td>}
//                                 {showColumns.invoiceNo && <td>{row.invoiceNo}</td>}
//                                 {showColumns.chequeDetails && <td>{row.chequeDetails}</td>}
//                                 {showColumns.chequeDate && <td>{row.paymentDate}</td>}
//                                 {showColumns.datedCheque && <td>{row.datedCheque}</td>}
//                                 <td style={{ 
//                                     color: row.daysLeftColor || 'inherit', 
//                                     fontWeight: "bold" 
//                                 }}>
//                                     {row.daysLeftText || '-'}
//                                 </td>
//                                 {showColumns.debit && <td>{row.debit || ''}</td>}
//                                 {showColumns.credit && <td>{row.credit || ''}</td>}
//                                 {showColumns.balance && <td>{row.balance}</td>}
//                                 {showColumns.paid && (
//                                     <td>
//                                         {row.isMainRow && (
//                                             <>
//                                                 <span style={{ 
//                                                     color: row.status === 'No' ? 'red' : 'green',
//                                                     fontWeight: row.status === 'Yes' ? 'bold' : 'normal'
//                                                 }}>
//                                                     {row.status}
//                                                 </span>
//                                                 {row.status === 'No' && (
//                                                     <input
//                                                         type="checkbox"
//                                                         className="form-check-input ms-2"
//                                                         checked={checkedRows[actualIndex] || false}
//                                                         onChange={() => onCheckboxChange(actualIndex)}
//                                                     />
//                                                 )}
//                                             </>
//                                         )}
//                                     </td>
//                                 )}
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//                 <nav aria-label="Transaction table pagination" className="d-flex justify-content-center mt-4">
//                     <ul className="pagination">
//                         <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                             <button 
//                                 className="page-link" 
//                                 onClick={() => handlePageChange(currentPage - 1)}
//                                 disabled={currentPage === 1}
//                             >
//                                 &lt;
//                             </button>
//                         </li>
//                         {[...Array(totalPages)].map((_, i) => (
//                             <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
//                                 <button
//                                     className="page-link"
//                                     onClick={() => handlePageChange(i + 1)}
//                                 >
//                                     {i + 1}
//                                 </button>
//                             </li>
//                         ))}
//                         <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                             <button 
//                                 className="page-link" 
//                                 onClick={() => handlePageChange(currentPage + 1)}
//                                 disabled={currentPage === totalPages}
//                             >
//                                 &gt;
//                             </button>
//                         </li>
//                     </ul>
//                 </nav>
//             )}
//         </div>
//     );
// };

// export default PaginatedTransactionTable;

// import React, { useState } from 'react';

// const PaginatedTransactionTable = ({ 
//     data, 
//     showColumns, 
//     columnLabels, 
//     checkedRows, 
//     onCheckboxChange 
// }) => {
//     const ROWS_PER_PAGE = 12;
//     const [currentPage, setCurrentPage] = useState(Math.ceil(data.length / ROWS_PER_PAGE)); // Start with last page

//     // Calculate total pages
//     const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);

//     // Get current page's data
//     const indexOfLastRow = currentPage * ROWS_PER_PAGE;
//     const indexOfFirstRow = indexOfLastRow - ROWS_PER_PAGE;
//     const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     return (
//         <div>
//             <div className="table-responsive"> {/* Added Bootstrap class */}
//                 <table className="table table-bordered">
//                     <thead className="table-light">
//                         <tr>
//                             {showColumns.date && <th>Date</th>}
//                             {showColumns.invoiceNo && <th>Invoice No</th>}
//                             {showColumns.chequeDetails && <th>Cheque Details</th>}
//                             {showColumns.chequeDate && <th>Payment Date</th>}
//                             {showColumns.datedCheque && <th>Dated Cheque</th>}
//                             <th>Days Left</th>
//                             {showColumns.debit && <th>Debit (Rs)</th>}
//                             {showColumns.credit && <th>Credit (Rs)</th>}
//                             {showColumns.balance && <th>Balance (Rs)</th>}
//                             {showColumns.paid && <th>Status</th>}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentRows.map((row, index) => {
//                             const actualIndex = indexOfFirstRow + index;
//                             const isOldInvoice = row.isMainRow && 
//                                 ((new Date() - new Date(row.soldDate)) / (1000 * 60 * 60 * 24) >= 30) && 
//                                 row.status === 'No';

//                             return (
//                                 <tr
//                                     key={actualIndex}
//                                     style={{
//                                         backgroundColor: isOldInvoice ? '#ffcccc' : 
//                                                        row.isPaymentRow ? '#f0f0f0' : 'inherit'
//                                     }}
//                                 >
//                                     {showColumns.date && <td>{row.soldDate}</td>}
//                                     {showColumns.invoiceNo && <td>{row.invoiceNo}</td>}
//                                     {showColumns.chequeDetails && <td>{row.chequeDetails}</td>}
//                                     {showColumns.chequeDate && <td>{row.paymentDate}</td>}
//                                     {showColumns.datedCheque && <td>{row.datedCheque}</td>}
//                                     <td style={{ 
//                                         color: row.daysLeftColor || 'inherit', 
//                                         fontWeight: "bold" 
//                                     }}>
//                                         {row.daysLeftText || '-'}
//                                     </td>
//                                     {showColumns.debit && <td>{row.debit || ''}</td>}
//                                     {showColumns.credit && <td>{row.credit || ''}</td>}
//                                     {showColumns.balance && <td>{row.balance}</td>}
//                                     {showColumns.paid && (
//                                         <td>
//                                             {row.isMainRow && (
//                                                 <>
//                                                     <span style={{ 
//                                                         color: row.status === 'No' ? 'red' : 'green',
//                                                         fontWeight: row.status === 'Yes' ? 'bold' : 'normal'
//                                                     }}>
//                                                         {row.status}
//                                                     </span>
//                                                     {row.status === 'No' && (
//                                                         <input
//                                                             type="checkbox"
//                                                             className="form-check-input ms-2"
//                                                             checked={checkedRows[actualIndex] || false}
//                                                             onChange={() => onCheckboxChange(actualIndex)}
//                                                         />
//                                                     )}
//                                                 </>
//                                             )}
//                                         </td>
//                                     )}
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//                 <nav aria-label="Transaction table pagination" className="d-flex justify-content-center mt-4">
//                     <ul className="pagination">
//                         <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                             <button 
//                                 className="page-link" 
//                                 onClick={() => handlePageChange(currentPage - 1)}
//                                 disabled={currentPage === 1}
//                             >
//                                 &lt;
//                             </button>
//                         </li>
//                         {[...Array(totalPages)].map((_, i) => (
//                             <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
//                                 <button
//                                     className="page-link"
//                                     onClick={() => handlePageChange(i + 1)}
//                                 >
//                                     {i + 1}
//                                 </button>
//                             </li>
//                         ))}
//                         <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                             <button 
//                                 className="page-link" 
//                                 onClick={() => handlePageChange(currentPage + 1)}
//                                 disabled={currentPage === totalPages}
//                             >
//                                 &gt;
//                             </button>
//                         </li>
//                     </ul>
//                 </nav>
//             )}
//         </div>
//     );
// };

// export default PaginatedTransactionTable;


import React, { useState } from 'react';

const PaginatedTransactionTable = ({ 
    data, 
    showColumns, 
    columnLabels, 
    checkedRows, 
    onCheckboxChange,
    itemsPerPage = 10 
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    
    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        {showColumns.date && <th>Date</th>}
                        {showColumns.invoiceNo && <th>Invoice No</th>}
                        {showColumns.chequeDetails && <th>Cheque Details</th>}
                        {showColumns.chequeDate && <th>Payment Date</th>}
                        {showColumns.datedCheque && <th>Dated Cheque</th>}
                        {showColumns.daysLeft && <th>Days Left</th>}
                        {showColumns.daysOfDue && <th>No of Days Due</th>}
                        {showColumns.debit && <th>Debit (Rs)</th>}
                        {showColumns.credit && <th>Credit (Rs)</th>}
                        {showColumns.balance && <th>Balance (Rs)</th>}
                        {showColumns.paid && <th>Status</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((row, index) => {
                        const actualIndex = indexOfFirstItem + index;
                        const isOldInvoice = row.isMainRow && 
                            ((new Date() - new Date(row.soldDate)) / (1000 * 60 * 60 * 24) >= 30) && 
                            row.status === 'No';

                        return (
                            <tr
                                key={index}
                                style={{
                                    backgroundColor: isOldInvoice ? '#ffcccc' : 
                                                   row.isPaymentRow ? '#f0f0f0' : 'inherit'
                                }}
                            >
                                {showColumns.date && <td>{row.soldDate}</td>}
                                {showColumns.invoiceNo && <td>{row.invoiceNo}</td>}
                                {showColumns.chequeDetails && <td>{row.chequeDetails}</td>}
                                {showColumns.chequeDate && <td>{row.paymentDate}</td>}
                                {showColumns.datedCheque && <td>{row.datedCheque}</td>}
                                {showColumns.daysLeft && <td style={{ 
                                    color: row.daysLeftColor || 'inherit', 
                                    fontWeight: "bold" 
                                }}>
                                    {row.daysLeftText || '-'}
                                </td>}
                                {showColumns.daysOfDue && (
                                    <td>{row.isMainRow ? row.daysDue : '-'}</td>
                                )}
                                {showColumns.debit && <td>{row.debit || ''}</td>}
                                {showColumns.credit && <td>{row.credit || ''}</td>}
                                {showColumns.balance && <td>{row.balance}</td>}
                                {showColumns.paid && (
                                    <td>
                                        {row.isMainRow && (
                                            <>
                                                <span style={{ 
                                                    color: row.status === 'No' ? 'red' : 'green',
                                                    fontWeight: row.status === 'Yes' ? 'bold' : 'normal'
                                                }}>
                                                    {row.status}
                                                </span>
                                                {row.status === 'No' && (
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input ms-2"
                                                        checked={checkedRows[actualIndex] || false}
                                                        onChange={() => onCheckboxChange(actualIndex)}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-3">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default PaginatedTransactionTable;
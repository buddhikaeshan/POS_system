import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DatePicker from "react-datepicker";
import { isValid, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./Table.css";

const Table = ({
    data,
    title,
    invoice,
    columns,
    onAdd,
    btnName,
    onEdit,
    onDelete,
    onRowClick,
    showSearch = true,
    showButton = true,
    showActions = true,
    showEdit = true,
    showDelete = true,
    showRow = true,
    showPDF = true,
    showDate = true,
}) => {
    const [tableData, setTableData] = useState(data);
    const [tableColumns, setTableColumns] = useState(columns);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        setTableData(Array.isArray(data) ? data : []);
    }, [data]);

    useEffect(() => {
        setTableColumns(columns);
    }, [columns]);

    const filteredData = tableData.filter((tableDatum) => {
        const query = searchQuery.toLowerCase();

        const tableDate = tableDatum[2] ? new Date(tableDatum[2]) : null;
        const formattedTableDate = isValid(tableDate)
            ? format(tableDate, "yyyy-MM-dd")
            : null;

        const matchesQuery = tableDatum.some((item) =>
            item != null && item.toString().toLowerCase().includes(query)
        );

        const matchesDateRange =
            (!startDate || !endDate ||
                (formattedTableDate >= format(startDate, "yyyy-MM-dd") &&
                    formattedTableDate <= format(endDate, "yyyy-MM-dd")));

        return matchesQuery && matchesDateRange;
    });

    const currentItems =
        itemsPerPage === -1
            ? filteredData
            : filteredData.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            );

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text(title, 20, 20);

        const headers = columns.map((column) => ({
            content: column,
            styles: { halign: "center" },
        }));
        const tableData = filteredData.map((row) =>
            row.map((cell) => ({ content: cell, styles: { halign: "center" } }))
        );

        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 30,
            theme: "striped",
            margin: { top: 10, right: 10, bottom: 10, left: 10 },
            styles: { fontSize: 5, halign: "center", valign: "middle" },
            headStyles: { fillColor: [255, 216, 126], textColor: 0, fontSize: 5 },
            bodyStyles: { textColor: 50 },
            alternateRowStyles: { fillColor: [250, 250, 250] },
        });

        doc.save(invoice);
    };

    const resetFilters = () => {
        setStartDate(null);
        setEndDate(null);
    };

    return (
        <div>
            <div className="container-fluid p-2">
                <div className="flex-t-h">
                    {showSearch && (
                        <div className="mb-2 me-2">
                            <input
                                type="text"
                                className="form-control form-con"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                style={{ fontSize: "12px" }}
                            />
                        </div>
                    )}

                    {showRow && (
                        <div className="mb-2 me-2" style={{ fontSize: "12px" }}>
                            <select
                                className="form-control form-con-row"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                style={{ fontSize: "10px" }}
                            >
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={-1}>All</option>
                            </select>
                        </div>
                    )}

                    <div className="d-flex ms-auto flex-se">
                        {showDate && (
                            <div className="d-flex me-2 date">
                                <div className="mb-2 me-2 " style={{ fontSize: "10px" }}>
                                    <DatePicker
                                        selectsRange
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) => {
                                            setStartDate(update[0]);
                                            setEndDate(update[1]);
                                        }}
                                        placeholderText="Select Date Range"
                                        className="form-control"
                                        dateFormat="yyyy-MM-dd"
                                        style={{ fontSize: "10px" }}
                                    />
                                </div>
                                <div>
                                    <button className="btn btn-danger" onClick={resetFilters} style={{ fontSize: "10px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {showPDF && (
                            <div className="me-2">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={generatePDF}
                                    style={{ fontSize: "12px" }}
                                >
                                    Generate PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {showButton && (
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-warning text-dark" onClick={onAdd} style={{ fontSize: "12px" }}>
                            {btnName}
                        </button>
                    </div>
                )}

                <div className="mt-2">
                    <div className="table-table" style={{ borderRadius: "5px"}}>
                        <table className="table table-hover table-bordered table-responsive table-dark table-striped">
                            <thead className="table-primary">
                                <tr >
                                    {tableColumns.map((item, index) => (
                                        <th
                                            key={index}
                                            style={{
                                                backgroundColor: "#555",
                                                color: "white",
                                                textAlign: "center",
                                                fontSize: "13px",

                                            }}
                                        >
                                            {item}
                                        </th>
                                    ))}
                                    {showActions && (
                                        <th
                                            style={{
                                                backgroundColor: "#555",
                                                color: "white",
                                                fontSize: "13px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((datum, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        onClick={() =>
                                            onRowClick && onRowClick(datum)
                                        } // Add onRowClick handler
                                    >
                                        {datum.map((item, colIndex) => (
                                            <td
                                                key={colIndex}
                                                style={{
                                                    textAlign: "center",
                                                    fontSize: "13px",
                                                    fontWeight: "500"
                                                }}
                                            >
                                                {item}
                                            </td>
                                        ))}
                                        {showActions && (
                                            <td style={{
                                                textAlign: "center",
                                            }}>
                                                {showEdit && (
                                                    <button
                                                        className="btn btn-warning btn-sm mr-3 "
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent triggering onRowClick
                                                            onEdit(rowIndex);
                                                        }}
                                                        style={{ fontSize: "10px" }}
                                                    >
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>
                                                )}{" "}
                                                {showDelete && (
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent triggering onRowClick
                                                            onDelete(rowIndex);
                                                        }}
                                                        style={{ fontSize: "10px" }}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;

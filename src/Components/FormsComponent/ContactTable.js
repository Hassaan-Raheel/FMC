import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Url } from "../../Services/Api";
import "../../Pages/ECommerce/ECommerce.css";
import "./FormsComponent.css";
import "../../Pages/Page.css";
import DataTable from "react-data-table-component";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
// import BottomToust from "../../Components/BottomToust/BottomToust";
import { Tooltip } from "antd";

const ContactTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const rowsPerPage = 7;

    const fetchTableData = async () => {
        setLoading(true);
        setTimeout(async () => {
            try {
                const response = await axios.get(`${Url}/api/v1/contact/get`);
                const getContact = response.data || [];
                setData(getContact.data);
                console.log(getContact.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        }, 2000);
    };

    useEffect(() => {
        fetchTableData();
    }, []);

    const handleCloseMessageModal = () => {
        setShowMessage(false);
    };

    useEffect(() => {
        if (showMessage === true) {
            const timeOut = setTimeout(() => {
                setShowMessage(false);
            }, 3000);

            return () => clearTimeout(timeOut);
        }
    }, [showMessage]);

    const customStyles = {
        headCells: {
            style: {
                height: "52px",
                background: "transparent",
                opacity: "1",
                textAlign: "center",
                justifyContent: "center",
                border: "none",
                color: "var(--text-color-1)",
                fontFamily: "var(--font-family)",
                fontWeight: "var(--font-weight-medium)",
                fontSize: "var(--font-size-medium)",
                overflow: "wrap",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
            },
        },
        cells: {
            style: {
                height: "66px",
                justifyContent: "center",
                textAlign: "center",
                background: "transparent",
                borderTop: "var(--standered-border)",
                borderRight: "none",
                color: "var(--text-color-1)",
                fontFamily: "var(--font-family)",
                fontWeight: "var(--font-weight-regular)",
                fontSize: "var(--font-size-small)",
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflow: "wrap",
                textOverflow: "ellipsis",
            },
        },
    };

    const columns = [
        {
            name: (
                <input
                    type="checkbox"
                    style={{ margin: 0 }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedRows.length === data.length && data.length > 0}
                />
            ),
            cell: (row) =>
                loading ? (
                    <ShimmerLoader width="20px" height="20px" />
                ) : (
                    <input
                        type="checkbox"
                        style={{ margin: 0 }}
                        onChange={() => handleRowSelect(row.uid)}
                        checked={selectedRows.includes(row.uid)}
                    />
                ),
            ignoreRowClick: true,
            width: "50px",
        },
        {
            name: "Name",
            selector: (row) =>
                loading ? (
                    <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
                ) : (
                    row.name
                ),
            width: "150px",
        },
        {
            name: "Contact",
            selector: (row) =>
                loading ? (
                    <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
                ) : (
                    row.contactNo
                ),
            width: "150px",
        },
        {
            name: "Email",
            selector: (row) => (
                <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                    {loading ? (
                        <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
                    ) : (
                        <Tooltip title={row.email}>
                            <span>
                                {row.email
                                    ? row.email.split("@")[0].slice(0, 10) + "..." + (row.email.includes("@") ? row.email.split("@")[1] : "")
                                    : "N/A"}
                            </span>
                        </Tooltip>
                    )}
                </div>
            ),
            width: "150px",
        },      
        {
            name: "Zip Code",
            selector: (row) =>
                loading ? (
                    <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
                ) : (
                    row.zipcode
                ),
            width: "150px",
        },
        {
            name: "State",
            selector: (row) =>
                loading ? (
                    <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
                ) : (
                    row.state
                ),
            width: "150px",
        },
        {
            name: "Message",
            selector: (row) => (
                <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                    {loading ? (
                        <ShimmerLoader width="125px" height="22.5px" borderRadius="20px" />
                    ) : (
                        <Tooltip title={row.message}>
                            <span>
                                {row.message
                                    ? row.message.split(" ").slice(0, 7).join(" ") + (row.message.split(" ").length > 7 ? "..." : "")
                                    : "N/A"}
                            </span>
                        </Tooltip>
                    )}
                </div>
            ),
            minWidth: "150px",
        }
    ];

    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            const allRowIds = data.map((row) => row.uid);
            setSelectedRows(allRowIds);
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowSelect = (rowId) => {
        setSelectedRows((prevSelected) => {
            if (prevSelected.includes(rowId)) {
                return prevSelected.filter((id) => id !== rowId);
            } else {
                return [...prevSelected, rowId];
            }
        });
    };

    const totalPages = Math.ceil(data.length / rowsPerPage);

    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const placeholderRows = Array(7).fill({ uid: "", name: "", image: "" });

    const displayedData = loading ? placeholderRows : paginatedData;

    return (
        <div className="ContactTableComponent">

            <div className="Main-Container-Table">

                <div className="Main-Container">
                    <div className="Contact-Data">
                        <div>
                            <DataTable
                                columns={columns}
                                data={displayedData}
                                customStyles={customStyles}
                            />
                            <Pagination
                                activePageIndex={currentPage}
                                totalPages={totalPages}
                                onPrevPage={handlePrevPage}
                                onNextPage={handleNextPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* <BottomToust
                showMessage={showMessage}
                message={toastMessage}
                handleCloseMessageModal={() => handleCloseMessageModal()}
            /> */}
        </div>
    );
};

export default ContactTable;
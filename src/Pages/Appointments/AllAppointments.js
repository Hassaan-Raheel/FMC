import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Page.css";
import "./Appointments.css";
import { Url } from "../../Services/Api";
import DataTable from "react-data-table-component";
import BottomToust from "../../Components/BottomToust/BottomToust";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import actionIcon from "../../Assets/Images/ActionBtn 30 x 30.png";
import { PiNotePencil } from "react-icons/pi";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import RescheduleModal from "../../Components/AppointmentsComponent/ReScheduleModal";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import CustomDropdown from "../../Components/UI-Controls/Dropdown/dropdown";
import { DatePicker } from "antd";
import InputField from "../../Components/UI-Controls/InputField/InputField";
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

export const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

const AllAppointments = () => {
    const { RangePicker } = DatePicker;
    const rowsPerPage = 10;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(data);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [storeId, setStoreId] = useState("");
    const [appointmentId, setAppointmentId] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [filtersModified, setFiltersModified] = useState(false);
    const [dateRange, setDateRange] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    async function fetchTableData() {
        setLoading(true);
        try {
            const URL = `${Url}/api/v1/appointments/get-appointments`;
            const response = await axios.get(URL);
            console.log("Result is:", response.data);

            const reversedOrders = response.data.data.reverse();
            console.log("Reverse Appointments:", reversedOrders);

            setData(reversedOrders);
            setFilteredData(reversedOrders);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

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

    const toggleDropdown = (id) => {
        setOpenDropdownId((prevId) => (prevId === id ? null : id)); 
    };

    const handleReschedule = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const handleAction = (action, row) => {
        console.log(`Action: ${action} triggered for row:`, row);
        // Perform specific action based on the selected option
        switch (action) {
            case "completed":
                handleCompleted(row);
                setOpenDropdownId(null);
                break;
            case "reschedule":
                handleReschedule(row);
                console.log("Re-Schedule Row:", row);
                setOpenDropdownId(null);
                break;
            case "delete":
                handleDelete(row);
                setOpenDropdownId(null);
                break;
            default:
                break;
        }
    };

    const handleClickOutside = (event) => {
        if (
            !event.target.closest(".dropdown-menu") &&
            !event.target.closest(".bar-icon")
        ) {
            setOpenDropdownId(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFilters = () => {
        if (
            !storeId &&
            !appointmentId &&
            !selectedStatus &&
            !selectedMethod &&
            (!dateRange || dateRange.length !== 2)
        ) {
            let warningMessage = "Kindly select or enter respective filtration value...";
            setToastMessage(warningMessage);
            setShowMessage(true);
            return;
        }

        console.log("Selected Filters:", {
            storeId,
            appointmentId,
            selectedStatus,
            selectedMethod,
            dateRange,
        });

        const filteredData = data.filter((item) => {
            const statusMatch = selectedStatus
                ? item.status.toLowerCase() === selectedStatus.toLowerCase()
                : true;

            const storeIdMatch = storeId 
                ? item.selectedStore?.store_id 
                    ? item.selectedStore.store_id.toString().includes(storeId) 
                    : false
                : true;

            const appointmentIdMatch = appointmentId
                ? item.appointmentId.toString().includes(appointmentId)
                : true;

            let dateMatch = true;
            if (dateRange && dateRange.length === 2) {
                // Convert dateRange to native JavaScript Date objects
                const startDate = new Date(dateRange[0].toDate());
                const endDate = new Date(dateRange[1].toDate());

                // Set the time to the start of the day for startDate and end of the day for endDate
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);

                // Convert item.createdAt to a JavaScript Date
                const itemDate = new Date(item.createdAt);

                dateMatch = itemDate >= startDate && itemDate <= endDate;

                console.log("Date Comparison:", {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    itemDate: itemDate.toISOString(),
                    dateMatch,
                });
            }

            return (
                statusMatch &&
                storeIdMatch &&
                appointmentIdMatch &&
                dateMatch
            );
        });

        setFilteredData(filteredData);
        setFiltersApplied(true);
        setFiltersModified(false);
    };

    useEffect(() => {
        if (filtersApplied && filtersModified) {
            handleFilters();
            setFiltersModified(false);
        }
    }, [
        storeId,
        appointmentId,
        selectedStatus,
        selectedMethod,
        filtersApplied,
        filtersModified,
    ]);

    const handleFilterChange = (value, fieldName) => {
        if (fieldName === "storeId") {
            setStoreId(value);
        } else if (fieldName === "appointmentId") {
            setAppointmentId(value);
        } else if (fieldName === "status") {
            setSelectedStatus(value);
        } else if (fieldName === "date") {
            setDateRange(value);
        }
        setFiltersModified(true);
    };

    const handleResetFilters = () => {
        setStoreId("");
        setAppointmentId("");
        setSelectedStatus(null);
        setSelectedMethod(null);
        setDateRange(null);
        setFiltersApplied(false);
        setFiltersModified(false);
        fetchTableData();
    };

    const StatusOptions = [
        { value: "pending", label: "Pending" },
        { value: "canceled", label: "Canceled" },
        { value: "booked", label: "Booked" },
        { value: "completed", label: "Completed" },
    ];

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
            },
        },
    };

    const AppointmentsColumns = [
        {
            name: "Booking",
            selector: (row) => {
                if (loading) {
                    return <ShimmerLoader width="80px" height="22.5px" borderRadius="20px" />;
                }
                return formatDate(row.createdAt);
            },
            width: "125px",
        },
        {
            name: "Name",
            selector: (row) =>
                loading ? (
                    <ShimmerLoader width="80px" height="22.5px" borderRadius="20px" />
                ) : (
                    `${row.details?.firstName || "N/A"} ${row.details?.lastName || ""}`
                ),
            width: "115px",
        },
        {
            name: "Email",
            selector: (row) =>
                loading ? (
                    <ShimmerLoader width="80px" height="22.5px" borderRadius="20px" />
                ) : (
                    <div style={{
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        {row.details?.email || "N/A"}
                    </div>
                ),
            width: "160px",
            wrap: true,
        },
        {
            name: "Contact",
            selector: (row) =>
                loading ? (
                    <ShimmerLoader width="80px" height="22.5px" borderRadius="20px" />
                ) : (
                    row.details?.contact || "N/A"
                ),
            width: "125px",
        },
        {
            name: "Location",
            selector: (row) =>
                loading ? (
                    <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
                ) : (
                    row.selectedStore?.city || "N/A"
                ),
            width: "130px",
        },
        {
            name: "Appointment",
            selector: (row) =>
                loading ? (
                    <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", fontWeight: "600", color: 'var(--active-element-color)' }}>
                            {formatDate(row.selectedDate) || "N/A"}
                        </span>
                        <span style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}>
                            {row.selectedSlot || "N/A"}
                        </span>
                    </div>
                ),
            width: "160px",
        },
        {
            name: "Status",
            cell: (row) => {
                if (loading) {
                    return <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />;
                }

                let textColor, backgroundColor, stockLabel;

                switch (row.status) {
                    case "booked":
                        textColor = "#5285B4";
                        backgroundColor = "#5285B410";
                        stockLabel = "Booked";
                        break;
                    case "canceled":
                        textColor = "#F08F9F";
                        backgroundColor = "#F08F9F10";
                        stockLabel = "Canceled";
                        break;
                    case "pending":
                        textColor = "#F4B074";
                        backgroundColor = "#F4B07410";
                        stockLabel = "Pending";
                        break;
                    case "completed":
                        textColor = "#41BC63";
                        backgroundColor = "#EBF9F1";
                        stockLabel = "Completed";
                        break;
                    default:
                        textColor = "#999";
                        backgroundColor = "#E0E0E010";
                        stockLabel = "Unknown";
                }

                return (
                    <div
                        style={{
                            color: textColor,
                            backgroundColor: backgroundColor,
                            padding: "5px 10px",
                            borderRadius: "5px",
                            display: "inline-block",
                            fontWeight: 600,
                        }}
                    >
                        {stockLabel}
                    </div>
                );
            },
            width: "130px",
        },
        {
            name: "Action",
            cell: (row) =>
                loading ? (
                    <ShimmerLoader width="60px" height="22.5px" />
                ) : (
                    <div key={row._id} style={{ position: "relative" }}>
                        <img
                            src={actionIcon}
                            alt="Action Icon"
                            width="40"
                            height="40"
                            style={{ cursor: "pointer", margin: 0, padding: 0 }}
                            className={`bar-icon ${openDropdownId === row._id ? "rotated" : ""
                                }`}
                            onClick={() => toggleDropdown(row._id)}
                        />
                        {openDropdownId === row._id && (
                            <div className={`dropdown-menu show animate-dropdown-left`}>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    <li
                                        key="completed"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            padding: "5px 10px",
                                            border: "none",
                                        }}
                                        onClick={() => handleAction("completed", row)}
                                    >
                                        <IoEyeOutline className="ActionIcon" />
                                        Completed
                                    </li>
                                    <li
                                        key="reschedule"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            padding: "5px 10px",
                                            border: "none",
                                        }}
                                        onClick={() => handleAction("reschedule", row)}
                                    >
                                        <PiNotePencil className="ActionIcon" />
                                        Reschedule
                                    </li>
                                    <li
                                        key="delete"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            padding: "5px 10px",
                                            border: "none",
                                        }}
                                        onClick={() => handleAction("delete", row)}
                                    >
                                        <RiDeleteBin6Line className="ActionIcon" />
                                        Delete
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ),
            width: "100px",
        },
    ];

    function handleCompleted(id) {
        console.log("Complete Appointment:", id);
    }

    function handleDelete(id) {
        console.log("Deleting Appointment with ID:", id);
    }

    const totalPages = Math.ceil(
        (Array.isArray(filteredData) ? filteredData.length : 0) / rowsPerPage
    );

    const paginatedData = Array.isArray(filteredData)
        ? filteredData.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
        )
        : [];

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

    const disabledDate = (current) => {
        return current && current > new Date();
    };

    return (
        <div className="AllAppointments-Layout">

            <div className="Appointments-Row01">
                <div className="Appointments-1stRow">
                    <div className="Appointments-Title">All Appointments</div>
                </div>
            </div>

            <div className="Appointments-Row02">
                <Accordion allowZeroExpanded className="Appointments-Accordion">
                    <AccordionItem>
                        <AccordionItemHeading>
                            <AccordionItemButton>Filters</AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            {/* First Row: Labels */}
                            <div className="filter-row-01">
                                <div className="filter-label">Store ID</div>
                                <div className="filter-label">Appointment ID</div>
                                <div className="filter-label">Date</div>
                                <div className="filter-label">Status</div>
                            </div>

                            {/* Second Row: React Select Fields */}
                            <div className="filter-row-02">
                                <InputField
                                    value={storeId}
                                    name="storeId"
                                    onChange={(e) =>
                                        handleFilterChange(e.target.value, "storeId")
                                    }
                                    placeholder="Enter Store ID"
                                />
                                <InputField
                                    value={appointmentId}
                                    name="appointmentId"
                                    onChange={(e) =>
                                        handleFilterChange(e.target.value, "appointmentId")
                                    } // Using handleFilterChange
                                    placeholder="Enter Appointment ID"
                                />
                                <div className="Order-filter-date-wrapper">
                                    <RangePicker
                                        format="YYYY-MM-DD"
                                        onChange={(dates) => handleFilterChange(dates, "date")}
                                        value={dateRange}
                                        style={{ width: "100%", height: "75%" }}
                                        disabledDate={disabledDate}
                                    />
                                </div>
                                <div className="custom-dropdown-wrapper-Filter">
                                    <CustomDropdown
                                        options={StatusOptions}
                                        selectedOption={
                                            StatusOptions.find(
                                                (option) => option.value === selectedStatus
                                            )?.label || "Select a Status"
                                        }
                                        handleOptionChange={(value) =>
                                            handleFilterChange(value, "status")
                                        }
                                        dropdownWidth={245}
                                        dropdownMarginBottom="13px"
                                        backgroundColor="var(--third-layer-bg)"
                                        optionsWidth={243}
                                        optionsBackgroundColor="var(--third-layer-bg)"
                                        optionsHeight={80}
                                        dropdownSelectedStyle="7px"
                                    />
                                </div>
                            </div>

                            {/* Fifth Row: Apply Filters Button */}
                            <div className="filter-row-04">
                                {!filtersApplied ? (
                                    <CustomBtn
                                        label="Apply Filters"
                                        withIcon={true}
                                        iconType="filter"
                                        className="FilterBtn-OrderPage"
                                        onClick={handleFilters}
                                        type="submit"
                                    />
                                ) : (
                                    <>
                                        <CustomBtn
                                            label="Reset"
                                            withIcon={true}
                                            iconType="reset"
                                            className="ResetBtn-OrderPage"
                                            onClick={handleResetFilters}
                                            type="button"
                                        />
                                        <CustomBtn
                                            label="Apply Filters"
                                            withIcon={true}
                                            iconType="filter"
                                            className="FilterBtn-OrderPage"
                                            type="submit"
                                            style={{ backgroundColor: "green" }}
                                        />
                                    </>
                                )}
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="Appointments-Row01">
                <div className="Orders-Table-Data">
                    <div>
                        <DataTable
                            columns={AppointmentsColumns}
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

            {isModalOpen && (
                <RescheduleModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    appointment={selectedAppointment}
                    setIsModalOpen={setIsModalOpen}
                    fetchTableData={fetchTableData}
                />
            )}

            <BottomToust
                showMessage={showMessage}
                message={toastMessage}
                handleCloseMessageModal={() => handleCloseMessageModal()}
            />
        </div>
    );
};

export default AllAppointments;
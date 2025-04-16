import React from "react";
import "./ECommerce.css";
import "../Page.css";
import axios from "axios";
import { Url } from "../../Services/Api";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import actionIcon from "../../Assets/Images/ActionBtn 30 x 30.png";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";
import { format, formatDistanceToNow, isYesterday, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { formatDate } from "../../Components/UI-Controls/DateFormat/DateFormat1";
import LastActiveTimestamp from "../../Components/UI-Controls/DateFormat/LastActive";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import InputField from "../../Components/UI-Controls/InputField/InputField";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";

const AllCustomers = () => {
  const rowsPerPage = 10;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [custName, setCustName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [filtersModified, setFiltersModified] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchTableData();
  }, []);

  const timeZone = "America/New_York"; // Philadelphia time zone

  async function fetchTableData() {
    setLoading(true);
    setTimeout(async () => {
      try {
        const URL = `${Url}/api/v1/web-users/get`;
        const token = sessionStorage.getItem("authToken");
  
        if (!token) {
          throw new Error("Authorization token not found.");
        }
  
        const { data } = await axios.get(URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
  
        const reversedData = data.data.reverse();
        setData(reversedData);
        setFilteredData(reversedData);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data?.message || error.message
        );
      } finally {
        setLoading(false);
      }
    }, 2000);
  }  

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

  const toggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleAction = (action, row) => {
    console.log(`Action: ${action} triggered for row:`, row);
    // Perform specific action based on the selected option
    switch (action) {
      case "view":
        setOpenDropdownId(null);
        break;
      case "edit":
        setOpenDropdownId(null);
        break;
      case "delete":
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

  const CustomerColumns = [
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
            onChange={() => handleRowSelect(row._id)}
            checked={selectedRows.includes(row._id)}
          />
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "50px",
    },
    {
      name: "Customer",
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="200px" height="22.5px" borderRadius="20px" />
        ) : (
          <div>
            <div>
              {row.first_name} {row.last_name}
            </div>{" "}
            {/* Display first and last name */}
            <div style={{ fontSize: "0.9em", color: "#666" }}>
              {row.email}
            </div>{" "}
            {/* Display reviewer email */}
          </div>
        ),
      width: "280px",
    },
    {
      name: "Last Active",
      selector: (row) => row.lastLogin,
      width: "200px",
      cell: (row) => {
        if (loading) {
          return <ShimmerLoader width="120px" height="22.5px" borderRadius="20px" />;
        }
    
        if (row.lastLogin) {
          const lastLoginAt = toZonedTime(parseISO(row.lastLogin), timeZone);
          const now = new Date();
          let displayText;
    
          if (isYesterday(lastLoginAt)) {
            displayText = `Yesterday, ${format(lastLoginAt, "h:mm a")}`;
          } else if (now - lastLoginAt < 24 * 60 * 60 * 1000) {
            displayText = formatDistanceToNow(lastLoginAt, { addSuffix: true });
          } else {
            displayText = <LastActiveTimestamp createdAt={row.lastLogin} />;
          }
    
          return (
            <div style={{
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              maxHeight: "44px",
            }}>
              {displayText}
            </div>
          );
        }
        
        return "No data";
      },
    },    
    {
      name: "Registered Date",
      selector: (row) => {
        if (loading) {
          return <ShimmerLoader width="120px" height="22.5px" borderRadius="20px" />;
        }
        const { hoursAgo, showYesterday, formattedDate } = formatDate(row.createdAt);
        if (showYesterday) {
          return "Yesterday";
        } else if (hoursAgo) {
          return hoursAgo;
        } else if (formattedDate) {
          return formattedDate;
        } else {
          return new Date(row.createdAt).toLocaleDateString();
        }
      },
      width: "150px",
    },    
    {
      name: "Orders Qty",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : row.orders ? (
          row.orders.length
        ) : (
          0
        ),
      width: "140px",
    },
    {
      name: "City",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : (
          row.billing_address?.city || "N/A"
        ),
      width: "125px",
    },
    {
      name: "Action",
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="60px" height="22.5px" />
        ) : (
          <div style={{ position: "relative" }}>
            <img
              src={actionIcon}
              alt="Action Icon"
              width="40"
              height="40"
              style={{ cursor: "pointer", margin: 0, padding: 0 }}
              className={`bar-icon ${
                openDropdownId === row._id ? "rotated" : ""
              }`}
              onClick={() => toggleDropdown(row._id)}
            />
            {openDropdownId === row._id && (
              <div className={`dropdown-menu show animate-dropdown-left`}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "5px 10px",
                      border: "none",
                    }}
                    onClick={() => handleAction("view", row)}
                  >
                    <IoEyeOutline style={{ marginRight: "12px" }} className="icon-img-updated"/>
                    View
                  </li>
                  <li
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "5px 10px",
                      border: "none",
                    }}
                    onClick={() => handleAction("edit", row)}
                  >
                    <FiEdit style={{ marginRight: "12px" }} className="icon-img-updated"/>
                    Edit
                  </li>
                  <li
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "5px 10px",
                      border: "none",
                    }}
                    onClick={() => handleAction("delete", row)}
                  >
                    <RiDeleteBin6Line style={{ marginRight: "12px" }} className="icon-img-updated"/>
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

  const handleFilters = () => {
    if (!custName && !email && !phoneNo) {
      toast.warning("Kindly select or enter respective filtration value...");
      return;
    }

    console.log("Selected Filters:", {
      custName,
      email,
      phoneNo,
    });

    const filteredData = data.filter((item) => {
      const fullName = `${item.first_name || ""} ${item.last_name || ""}`
        .trim()
        .toLowerCase();

      const custNameMatch = custName
        ? fullName.includes(custName.toLowerCase())
        : true;

      const emailMatch = email ? item.email.toString().includes(email) : true;

      const phoneMatch = phoneNo ? item.email.toString().includes(email) : true;

      return custNameMatch && emailMatch && phoneMatch;
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
  }, [custName, email, phoneNo, filtersApplied, filtersModified]);

  const handleFilterChange = (value, fieldName) => {
    if (fieldName === "custName") {
      setCustName(value);
    } else if (fieldName === "email") {
      setEmail(value);
    } else if (fieldName === "phoneNo") {
      setPhoneNo(value);
    }
    setFiltersModified(true);
  };

  const handleResetFilters = () => {
    setCustName("");
    setEmail("");
    setPhoneNo("");
    setFiltersApplied(false);
    setFiltersModified(false);
    fetchTableData();
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allRowIds = data.map((row) => row._id);
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

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Slice data for current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Page change handlers
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
    <div className="AllOrderPage">
      <div className="Filters-Section">
        <Accordion allowZeroExpanded className="accordion">
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>Filters</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {/* First Row: Labels */}
              <div className="filter-row-01">
                <div className="filter-label">Customer Name</div>
                <div className="filter-label">Email</div>
                <div className="filter-label">Phone #</div>
              </div>

              {/* Second Row: React Select Fields */}
              <div className="filter-row-02">
                <InputField
                  value={custName}
                  name="custName"
                  onChange={(e) =>
                    handleFilterChange(e.target.value, "custName")
                  }
                  placeholder="Enter Customer Name"
                />
                <InputField
                  value={email}
                  name="email"
                  onChange={(e) => handleFilterChange(e.target.value, "email")}
                  placeholder="Enter Email Address"
                />
                <InputField
                  value={phoneNo}
                  name="phoneNo"
                  onChange={(e) =>
                    handleFilterChange(e.target.value, "phoneNo")
                  }
                  placeholder="Enter Phone Number"
                />
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

      {/* {loading && (
        <div className="backdrop">
          <MainLoader />
        </div>
      )} */}

      <div className="Orders-Table-Data">
        <div>
          <DataTable
            columns={CustomerColumns}
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

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AllCustomers;

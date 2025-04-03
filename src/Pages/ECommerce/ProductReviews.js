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
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useState, useEffect, useRef } from "react";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import { formatDate } from "../../Components/UI-Controls/DateFormat/DateFormat1";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import InputField from "../../Components/UI-Controls/InputField/InputField";
import CustomDropdown from "../../Components/UI-Controls/Dropdown/dropdown";
import { DatePicker } from "antd";
import RatingReview from "../../Components/UI-Controls/StarRating/Rating";
import { FaStar, FaRegStar } from 'react-icons/fa';
import BottomToust from "../../Components/BottomToust/BottomToust";
import { CiWarning } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { MdCheckCircleOutline } from "react-icons/md";
// import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";

const AllProductReviews = () => {
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [custName, setCustName] = useState("");
  const [prdName, setPrdName] = useState("");
  const [rating, setRating] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filtersModified, setFiltersModified] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  
  const rowsPerPage = 10;

  useEffect(() => {
    fetchTableData();
  }, []);

  async function fetchTableData() {
    setLoading(true);
    setTimeout(async () => {
      try {
        const URL = `${Url}/api/v1/reviews/get`;
        const { data } = await axios.get(URL);
  
        const reversedReviews = data.reviews.reverse();
        setData(reversedReviews);
        setFilteredData(reversedReviews);
      } catch (error) {
        console.error("Error fetching data:", error);
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
      case "edit":
        handleEdit(row);
        setOpenDropdownId(null);
        break;
      case "delete":
        confirmDelete(row);
        setOpenDropdownId(null);
        break;
      case "view":
        handleView(row);
        setOpenDropdownId(null);
        break;
      case "approved":
        setOpenDropdownId(null);
        break;
      case "reject":
        setOpenDropdownId(null);
        break;
      case "trash":
        setOpenDropdownId(null);
        break;
      default:
        break;
    }
  };

  const handleEdit = (row) => {
    navigate("/E-Commerce/Product-Reviews/Edit-Review", { state: row });
  };

  const handleView = (row) => {
    navigate("/E-Commerce/Product-Reviews/View-Review", { state: row });
  };

  /* --- Handle Delete Functionality --- */
  const confirmDelete = (row) => {
    setCurrentRowId(row._id);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const handleDelete = () => {
    console.log(`Deleting item with ID: ${currentRowId}`);
    if (currentRowId) {
      deleteItem(currentRowId);
    }
  };

  const deleteItem = async (id) => {
    setIsLoading(true);
    setIsActive(true);

    try {
      let failureMessage = "Review deleted successfully!";
      // console.log(`Attempting to delete item with ID: ${id}`);

      // const response = await fetch(`${Url}/api/v1/products/delete/${id}`, {
      //   method: "DELETE",
      // });

      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }

      // const responseData = await response.json();
      // console.log(`Delete response: `, responseData);
      // console.log(`Selection with ID ${id} deleted successfully.`);

      // setData((prevItems) => prevItems.filter((item) => item._id !== id));

      setToastMessage(failureMessage);
      setShowMessage(true);

      fetchTableData();
    } catch (error) {
      let errorMessage = "Failed to delete the selection. Please try again.";
      console.error("Error deleting item:", error);
      setToastMessage(errorMessage);
      setShowMessage(true);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsActive(false);
      }, 5000);
      setShowConfirm(false);
    }
  };

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

  const ReviewColumns = [
    {
      name: "Reviewer",
      cell: (row) => (loading ? <ShimmerLoader width="150px" height="22.5px" borderRadius="20px" /> :
        <div>
          <div>{row.reviewer}</div>
          <div style={{ fontSize: "0.9em", color: "#666" }}>
            {row.reviewer_email}
          </div>{" "}
          {/* Display reviewer email */}
        </div>
      ),
      width: "240px",
    },
    {
      name: "Star Rating",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="60px" height="22.5px" borderRadius="20px" />
        ) : (
          <div style={{ display: "flex", gap: "3px" }}>
            {Array.from({ length: 5 }, (_, index) => {
              let color = "gray";
              if (row.rating <= 1) {
                color = "#ee6b6e";
              } else if (row.rating >= 1.5 && row.rating <= 3.0) {
                color = "orange";
              } else if (row.rating > 3) {
                color = "#17B169";
              }

              return (
                <span key={index}>
                  {index < row.rating ? (
                    <FaStar style={{ color, fontSize: "15px" }} />
                  ) : (
                    <FaRegStar style={{ color, fontSize: "15px" }} />
                  )}
                </span>
              );
            })}
          </div>
        ),
      width: "140px",
    },
    {
      name: "Review",
      selector: (row) => row.review,
      width: "150px",
      cell: (row) => (loading ? <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" /> :
        <div style={{
          whiteSpace: "normal",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          maxHeight: "44px",
        }}>
          {row.review}
        </div>
      ),
    },
    {
      name: "Status",
      cell: (row) => {
        let textColor;
        let backgroundColor;
        let stockLabel;

        switch (row.status) {
          case "approved":
            textColor = "#5285B4";
            backgroundColor = "#5285B4" + "10";
            stockLabel = "Approved";
            break;
          case "rejected":
            textColor = "#F08F9F";
            backgroundColor = "#F08F9F" + "10";
            stockLabel = "Rejected";
            break;
          case "pending":
            textColor = "#F4B074";
            backgroundColor = "#F4B074" + "10";
            stockLabel = "Pending";
            break;
          default:
            textColor = "#43CC5C";
            backgroundColor = "#43CC5C" + "10";
            stockLabel = "Delivered";
        }

        return (loading ? <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" /> :
          <div
            style={{
              color: textColor,
              backgroundColor: backgroundColor,
              padding: "5px 10px 5px 10px",
              borderRadius: "5px",
              boxSizing: "border-box", // Ensures consistent box sizing
              display: "inline-block", // Keeps the content inline without breaking the layout
              fontWeight: 600,
            }}
          >
            {stockLabel} {/* Render the mapped label */}
          </div>
        );
      },
      width: "125px",
    },
    {
      name: "Product Name",
      selector: (row) => (loading ? <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" /> : row.product_name),
      width: "190px",
    },
    {
      name: "Date",
      selector: (row) => {
        if (loading) {
          return <ShimmerLoader width="80px" height="22.5px" borderRadius="20px" />;
        }

        const { hoursAgo, showYesterday, formattedDate } = formatDate(row.date_created);

        if (showYesterday) {
          return "Yesterday";
        } else if (hoursAgo) {
          return hoursAgo;
        } else if (formattedDate) {
          return formattedDate;
        } else {
          return new Date(row.date_created).toLocaleDateString();
        }
      },
      width: "125px",
    },
    {
      name: "Action",
      cell: (row) => (loading ? <ShimmerLoader width="60px" height="22.5px" /> :
        <div style={{ position: "relative" }}>
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "5px 10px",
                    border: "none",
                  }}
                  onClick={() => handleAction("view", row)}
                >
                  <IoEyeOutline style={{ marginRight: "12px" }} className="icon-img-updated" />
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
                  <FiEdit style={{ marginRight: "12px" }} className="icon-img-updated" />
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
                  onClick={() => handleAction("approved", row)}
                >
                  <MdCheckCircleOutline style={{ marginRight: "12px" }} className="icon-img-updated" />
                  Approved
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "5px 10px",
                    border: "none",
                  }}
                  onClick={() => handleAction("reject", row)}
                >
                  <MdOutlineCancel style={{ marginRight: "12px" }} className="icon-img-updated" />
                  Reject
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "5px 10px",
                    border: "none",
                  }}
                  onClick={() => handleAction("trash", row)}
                >
                  <FiTrash2 style={{ marginRight: "12px" }} className="icon-img-updated" />
                  Trash
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
                  <RiDeleteBin6Line style={{ marginRight: "12px" }} className="icon-img-updated" />
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

  useEffect(() => {
    // console.log("Updated Selected Status:", selectedStatus);
  }, [selectedStatus]);

  const handleFilters = () => {
    if (
      !custName &&
      !prdName &&
      !selectedStatus &&
      !rating &&
      (!dateRange || dateRange.length !== 2)
    ) {
      let warningMessage = "Kindly select or enter respective filtration value...";
      setToastMessage(warningMessage);
      setShowMessage(true);
      return;
    }

    console.log("Selected Filters:", {
      custName,
      prdName,
      selectedStatus,
      rating,
      dateRange,
    });

    const filteredData = data.filter((item) => {
      const statusMatch = selectedStatus
        ? item.status.toLowerCase() === selectedStatus.toLowerCase()
        : true;

      const custNameMatch = custName
        ? item.reviewer.toString().includes(custName)
        : true;

      const prdNameMatch = prdName
        ? item.product_name.toString().includes(prdName)
        : true;

      const ratingMatch = rating
        ? parseFloat(item.rating) === parseFloat(rating)
        : true;

      let dateMatch = true;
      if (dateRange && dateRange.length === 2) {
        const startDate = new Date(dateRange[0].toDate());
        const endDate = new Date(dateRange[1].toDate());

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const itemDate = new Date(item.date_created);

        dateMatch = itemDate >= startDate && itemDate <= endDate;

        console.log("Date Comparison:", {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          itemDate: itemDate.toISOString(),
          dateMatch,
        });
      }

      return (
        statusMatch && custNameMatch && prdNameMatch && dateMatch && ratingMatch
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
    custName,
    prdName,
    rating,
    selectedStatus,
    filtersApplied,
    filtersModified,
  ]);

  const handleFilterChange = (value, fieldName) => {
    if (fieldName === "custName") {
      setCustName(value);
    } else if (fieldName === "prdName") {
      setPrdName(value);
    } else if (fieldName === "status") {
      setSelectedStatus(value);
    } else if (fieldName === "date") {
      setDateRange(value);
    } else if (fieldName === "rating") {
      setRating(value);
    }
    setFiltersModified(true);
  };

  const handleResetFilters = () => {
    setCustName("");
    setPrdName("");
    setSelectedStatus(null);
    setDateRange(null);
    setRating("");
    setFiltersApplied(false);
    setFiltersModified(false);
    fetchTableData();
  };

  const reviewStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
    { value: "trash", label: "Trash" },
    { value: "approved", label: "Approved" },
  ];

  const disabledDate = (current) => {
    return current && current > new Date();
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
                <div className="filter-label">Product Name</div>
                <div className="filter-label">Status</div>
                <div className="filter-label">Date</div>
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
                  value={prdName}
                  name="prdName"
                  onChange={(e) =>
                    handleFilterChange(e.target.value, "prdName")
                  }
                  placeholder="Enter Product Name"
                />
                <div className="custom-dropdown-wrapper-Filter">
                  <CustomDropdown
                    options={reviewStatusOptions}
                    selectedOption={
                      reviewStatusOptions.find(
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
                    optionsHeight={213}
                    dropdownSelectedStyle="7px"
                  />
                </div>
                <div className="Review-filter-date-wrapper">
                  <RangePicker
                    format="YYYY-MM-DD"
                    onChange={(dates) => handleFilterChange(dates, "date")}
                    value={dateRange}
                    style={{ width: "100%", height: "38px" }}
                    disabledDate={disabledDate}
                  />
                </div>
              </div>

              {/* Third Row: Labels */}
              <div className="filter-row-03">
                <div className="filter-label">Product Rating</div>
              </div>

              {/* Fourth Row: React Select Fields */}
              <div className="filter-row-02">
                {/* Star Rating .... */}
                <div className="StarRating-Div">
                  <RatingReview
                    rating={rating}
                    setRating={(newRating) =>
                      handleFilterChange(newRating, "rating")
                    }
                    disabled={false}
                    size="35px"
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

      {/* {loading && (
        <div className="backdrop">
          <MainLoader />
        </div>
      )} */}

      <div className="Orders-Table-Data">
        <div>
          <DataTable
            columns={ReviewColumns}
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

      {/* --- (PopUp) To Handle Confiramtion for Delete Operation of Single Category --- */}
      {showConfirm && (
        <div className="confirmation-modal">
          <div className="Cat-modal-content" ref={modalRef}>
            <CiWarning className="warning-icon" />
            <div className="Delete-Heading">Warning</div>
            <div className="Delete-Content">
              Are you sure you want to delete this Review? <br />
              This action cannot be undone.
            </div>
            <div className="separator-line"></div>
            <div className="modal-actions">
              <button
                className="Cat-Delete-btn btn-secondary"
                onClick={cancelDelete}
              >
                Cancel
              </button>

              <div className="SubmitBtn">
                <CustomBtn
                  label={
                    isLoading ? (
                      <div className="btn-loader-Category"></div>
                    ) : (
                      "Confirm"
                    )
                  }
                  className={`Cat-Delete-btn btn-danger ${isActive ? "active" : ""
                    }`}
                  disabled={isLoading}
                  onClick={handleDelete}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomToust
        showMessage={showMessage}
        message={toastMessage}
        handleCloseMessageModal={() => handleCloseMessageModal()}
      />
    </div>
  );
};

export default AllProductReviews;
import React from "react";
import "../ECommerce/ECommerce.css";
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
import { formatOrderDate } from "../../Components/UI-Controls/DateFormat/DateFormat";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import InputField from "../../Components/UI-Controls/InputField/InputField";
import BottomToust from "../../Components/BottomToust/BottomToust";
import { CiWarning } from "react-icons/ci";
import { Tooltip } from 'antd';

const AllBlogs = () => {
  const rowsPerPage = 10;
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [custName, setCustName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [filtersModified, setFiltersModified] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetchBlogsData();
  }, []);

  const timeZone = "America/New_York";

  const fetchBlogsData = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.get(`${Url}/api/v1/blogs/get`);
        const allBlogs = response.data.blogs || [];

        const reversedData = allBlogs.reverse();

        setData(reversedData);
        setFilteredData(reversedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
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
    switch (action) {
      case "view":
        handleView(row);
        setOpenDropdownId(null);
        break;
      case "edit":
        handleEdit(row);
        setOpenDropdownId(null);
        break;
      case "delete":
        confirmDelete(row);
        setOpenDropdownId(null);
        break;
      default:
        break;
    }
  };

  const confirmDelete = (row) => {
    setCurrentRowId(row._id);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const handleDelete = () => {
    if (currentRowId) {
      deleteItem(currentRowId);
    }
  };

  const deleteItem = async (id) => {
    setIsLoading(true);
    setIsActive(true);

    try {
      let successMessage = "Blog deleted successfully!";

      const response = await fetch(`${Url}/api/v1/blogs/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();

      // Update local state to remove the deleted item
      setData((prevItems) => prevItems.filter((item) => item._id !== id));

      setToastMessage(successMessage);
      setShowMessage(true);

      fetchBlogsData();
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

  /* --- Function to Handle Display of Confirmation Dialogue Box of Delete Action --- */
  const handleDeleteClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      cancelDelete();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDeleteClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleDeleteClickOutside);
    };
  }, []);

  const handleEdit = (row) => {
    navigate((`/Blogs/Edit-Blog/${row._id}`), { state: { blog_Data: row } });
  };

  const handleView = (row) => {
    navigate((`/Blogs/View-Blog/${row._id}`), { state: { view_Data: row } });
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

  const BlogsColumns = [
    {
      name: (
        <input
          type="checkbox"
          style={{ margin: 0 }}
          onChange={(e) => console.log("All selected:", e.target.checked)}
        />
      ),
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="20px" height="22px" />
        ) : (
          <input
            type="checkbox"
            style={{ margin: 0 }}
            onChange={(e) => console.log("Selected:", row, e.target.checked)}
          />
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "50px",
    },
    {
      name: "Date",
      selector: (row) => {
        if (loading) {
          return (
            <ShimmerLoader width="120px" height="22.5px" borderRadius="20px" />
          );
        }

        const { formattedDate, hoursAgo, showYesterday } = formatOrderDate(
          row.publishedDate
        );

        return hoursAgo
          ? hoursAgo
          : showYesterday
            ? "Yesterday"
            : formattedDate;
      },
      width: "115px",
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="120px" height="22.5px" borderRadius="20px" />
        ) : (
          <div
            style={{
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              maxHeight: "44px",
            }}
          >
            {(() => {
              const { formattedDate, hoursAgo, showYesterday } =
                formatOrderDate(row.publishedDate);
              return hoursAgo
                ? hoursAgo
                : showYesterday
                  ? "Yesterday"
                  : formattedDate;
            })()}
          </div>
        ),
    },
    {
      name: "Title",
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="200px" height="22.5px" borderRadius="20px" />
        ) : (
          <div>{row.title}</div>
        ),
      width: "280px",
    },
    {
      name: "Author",
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="200px" height="22.5px" borderRadius="20px" />
        ) : (
          <div>{row.author}</div>
        ),
      width: "120px",
    },
    {
      name: "Category",
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="200px" height="22.5px" borderRadius="20px" />
        ) : (
          <div>{row?.category?.name || "No Category"}</div>
        ),
      width: "200px",
    },
    {
      name: "Tag",
      selector: (row) =>
        !loading ? (
          row.tags && row.tags.length > 0 ? (
            <Tooltip
              title={row.tags.length > 2 ? row.tags.slice(2).join(", ") : ""}
            >
              <div>
                {row.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} style={{ display: "block" }}>
                    {tag}
                  </span>
                ))}
                {row.tags.length > 2 && <span style={{color: 'var(--active-element-color)', fontWeight: 'var(--font-weight-semi-bold)'}}>+{row.tags.length - 2} more</span>}
              </div>
            </Tooltip>
          ) : (
            "N/A"
          )
        ) : (
          <ShimmerLoader width="80px" height="22.5px" borderRadius="20px" />
        ),
      width: "175px",
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

  const handleFilters = () => {
    if (!custName && !email && !phoneNo) {
      let warningMessage = "Kindly select or enter respective filtration value...";
      setToastMessage(warningMessage);
      setShowMessage(true);
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
    fetchBlogsData();
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = filteredData.slice(
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
    <div className="AllOrderPage">
      <div className="Filters-Section">
        <Accordion allowZeroExpanded className="accordion">
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>Filters</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="filter-row-01">
                <div className="filter-label">Customer Name</div>
                <div className="filter-label">Email</div>
                <div className="filter-label">Phone #</div>
              </div>

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

      <div className="Orders-Table-Data">
        <div>
          <DataTable
            columns={BlogsColumns}
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
              Are you sure you want to delete this Blog? <br />
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

export default AllBlogs;

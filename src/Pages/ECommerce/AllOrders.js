import React from "react";
import "./ECommerce.css";
import "../Page.css";
import axios from "axios";
import { Url } from "../../Services/Api";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import { FaHandHoldingUsd, FaTimesCircle, FaClipboardList, FaShippingFast, FaUserPlus, FaShoppingCart } from "react-icons/fa";
import OrderViewCard from "../../Components/ECommerceComponents/OrderViewCard";
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
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import InputField from "../../Components/UI-Controls/InputField/InputField";
import CustomDropdown from "../../Components/UI-Controls/Dropdown/dropdown";
import { DatePicker } from "antd";
import ApexChart24 from "../../Components/UI-Controls/BarGraph/BarGraph";
import { formatOrderDate } from "../../Components/UI-Controls/DateFormat/DateFormat";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import BottomToust from "../../Components/BottomToust/BottomToust";
import { CiWarning } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";

const AllOrders = () => {
  const { RangePicker } = DatePicker;
  const modalRef = useRef(null);
  const rowsPerPage = 10;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [payMethodsOptions, setPayMethodsOptions] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [filtersModified, setFiltersModified] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [isActive, setIsActive] = useState(false);

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

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/payment-methods/get-all`);
      const methods = response.data?.paymentMethods || [];

      const formattedMethods = methods.map((method) => ({
        label: method.name,
        value: method.name,
      }));
      setPayMethodsOptions(formattedMethods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      setPayMethodsOptions([]);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    //console.log("Updated Selected Status:", selectedStatus);
  }, [selectedStatus]);

  const handleFilters = () => {
    if (
      !orderId &&
      !phoneNo &&
      !email &&
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
      orderId,
      phoneNo,
      email,
      selectedStatus,
      selectedMethod,
      dateRange,
    });

    const filteredData = data.filter((item) => {
      const statusMatch = selectedStatus
        ? (item.status?.toLowerCase() || "") === selectedStatus.toLowerCase()
        : true;

      const normalizeString = (str) => str?.toLowerCase().replace(/[-\s]/g, "") || "";

      const methodMatch = selectedMethod
        ? normalizeString(item.payment_method) === normalizeString(selectedMethod)
        : true;

      //     const methodMatch = selectedMethod
      //       ? item.payment_method.toLowerCase() === selectedMethod.toLowerCase()
      //       : true;

      const orderIdMatch = orderId
        ? item.uid?.toString().includes(orderId)
        : true;

      const phoneNoMatch = phoneNo
        ? item.billing?.phone?.toString().includes(phoneNo)
        : true;

      const emailMatch = email
        ? (item.billing?.email?.toLowerCase() || "").includes(email.toLowerCase())
        : true;

      let dateMatch = true;
      if (dateRange && dateRange.length === 2) {
        const startDate = new Date(dateRange[0].toDate());
        const endDate = new Date(dateRange[1].toDate());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const itemDate = new Date(item.updatedAt || 0);
        dateMatch = itemDate >= startDate && itemDate <= endDate;

        console.log("Date Comparison:", {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          itemDate: itemDate.toISOString(),
          dateMatch,
        });
      }

      return statusMatch && methodMatch && orderIdMatch && phoneNoMatch && emailMatch && dateMatch;
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
    orderId,
    phoneNo,
    email,
    selectedStatus,
    selectedMethod,
    filtersApplied,
    filtersModified,
  ]);

  const handleFilterChange = (value, fieldName) => {
    if (fieldName === "orderId") {
      setOrderId(value);
    } else if (fieldName === "phoneNo") {
      setPhoneNo(value);
    } else if (fieldName === "email") {
      setEmail(value);
    } else if (fieldName === "status") {
      setSelectedStatus(value);
    } else if (fieldName === "paymentMethod") {
      setSelectedMethod(value);
    } else if (fieldName === "date") {
      setDateRange(value);
    }
    setFiltersModified(true);
  };

  const handleResetFilters = () => {
    setOrderId("");
    setPhoneNo("");
    setEmail("");
    setSelectedStatus(null);
    setSelectedMethod(null);
    setDateRange(null);
    setFiltersApplied(false); // Mark filters as not applied
    setFiltersModified(false); // Reset modification flag
    fetchTableData();
  };

  async function fetchTableData() {
    setLoading(true);
    setTimeout(async () => {
      try {
        const URL = `${Url}/api/v1/orders/get`;
        const response = await fetch(URL);
        const result = await response.json();

        const reversedOrders = result.orders.reverse();
        setData(reversedOrders);
        setOriginalData(reversedOrders);
        setFilteredData(reversedOrders);
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
      case "Cancel":
        // handleDelete(row);
        setOpenDropdownId(null);
        break;
      case "delete":
        // handleDelete(row);
        confirmDelete(row);
        setOpenDropdownId(null);
        break;
      case "view":
        handleView(row);
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

  const handleEdit = (row) => {
    navigate("/E-Commerce/All-Orders/Edit-Orders", { state: row });
  };

  const handleView = (row) => {
    navigate("/E-Commerce/All-Orders/View-Orders", { state: row });
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
      let successMessage = "Order deleted successfully!";
      //console.log(`Attempting to delete item with ID: ${id}`);

      // const response = await fetch(`${Url}/api/v1/productTag/${id}`, {
      //   method: "DELETE",
      // });

      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }

      // const responseData = await response.json();
      // console.log(`Delete response: `, responseData);
      // console.log(`Selection with ID ${id} deleted successfully.`);

      // setData((prevItems) => prevItems.filter((item) => item._id !== id));

      setToastMessage(successMessage);
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

  /* --- Function to Handle Display of Confirmation Dialogue Box of Delete Action --- */
  const handleDeleteClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      cancelDelete();
      // cancelSelectedDelete();
      // cancelDuplicate();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDeleteClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleDeleteClickOutside);
    };
  }, []);

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

  const OrdersColumns = [
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
          <ShimmerLoader width="20px" height="20px" />
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
      name: "ID",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="30px" height="22.5px" borderRadius="10px" />
        ) : (
          row.uid
        ),
      width: "65px",
    },
    {
      name: "Customer",
      selector: (row) => row.billing?.first_name && row.billing?.last_name
        ? `${row.billing.first_name} ${row.billing.last_name}`
        : "N/A",
      width: "110px", // Adjusted width
      cell: (row) => (
        loading ? (
          <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
        ) : (
          <div style={{
            whiteSpace: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, // Limit to 2 lines
            WebkitBoxOrient: "vertical",
            maxHeight: "44px", // Approx height for 2 lines
          }}>
            {row.billing?.first_name && row.billing?.last_name
              ? `${row.billing.first_name} ${row.billing.last_name}`
              : "N/A"}
          </div>
        )
      ),
    },
    {
      name: "Order Date",
      selector: (row) => {
        if (loading) {
          return (
            <ShimmerLoader width="120px" height="22.5px" borderRadius="20px" />
          );
        }

        const { formattedDate, hoursAgo, showYesterday } = formatOrderDate(
          row.createdAt
        );

        return hoursAgo ? hoursAgo : showYesterday ? "Yesterday" : formattedDate;
      },
      width: "115px", // Maintain the original width
      cell: (row) => (
        loading ? (
          <ShimmerLoader width="120px" height="22.5px" borderRadius="20px" />
        ) : (
          <div style={{
            whiteSpace: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, // Limit to 1 line to keep it concise
            WebkitBoxOrient: "vertical",
            maxHeight: "44px", // Approx height for 1 line
          }}>
            {(() => {
              const { formattedDate, hoursAgo, showYesterday } = formatOrderDate(row.createdAt);
              return hoursAgo ? hoursAgo : showYesterday ? "Yesterday" : formattedDate;
            })()}
          </div>
        )
      ),
    },
    {
      name: "Payment Method",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
        ) : (
          row.payment_method
        ),
      width: "155px",
    },
    {
      name: "Total Amount",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
        ) : (
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.total)
        ),
      width: "130px",
    },
    {
      name: "Origin",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : (
          row.billing?.state || "N/A"
        ),
      width: "120px",
    },
    {
      name: "Status",
      cell: (row) => {
        if (loading) {
          return (
            <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
          );
        }

        let textColor;
        let backgroundColor;
        let stockLabel;

        switch (row.status) {
          case "processing":
            textColor = "#5285B4";
            backgroundColor = "#5285B410";
            stockLabel = "Processing";
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
          case "delivered":
            textColor = "#43CC5C";
            backgroundColor = "#43CC5C10";
            stockLabel = "Delivered";
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
      width: "120px",
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
                    key="view"
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
                    key="edit"
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
                    key="cancel"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "5px 10px",
                      border: "none",
                    }}
                    onClick={() => handleAction("cancel", row)}
                  >
                    <RiDeleteBin6Line style={{ marginRight: "12px" }} className="icon-img-updated"/>
                    Cancel
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
                    <RiDeleteBin6Line style={{ marginRight: "12px" }} className="icon-img-updated"/>
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>
        ),
      width: "105px",
    },
  ];

  const orderStatusOptions = [
    { value: "processing", label: "Processing" },
    { value: "canceled", label: "Canceled" },
    { value: "pending", label: "Pending" },
    { value: "delivered", label: "Delivered" },
  ];

  const disabledDate = (current) => {
    return current && current > new Date();
  };

  const chartSeries = [
    {
      name: "Direct",
      data: [44],
    },
    {
      name: "SEO",
      data: [76],
    },
    {
      name: "Ads",
      data: [35],
    },
    {
      name: "Reference",
      data: [69],
    },
  ];

  const chartOptions = {
    chart: {
      type: "bar",
      height: "150px",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "55%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [""],
    },
    yaxis: {},
    fill: {
      opacity: 1,
    },
    colors: ["#77baf8", "#9ed2ff", "#5285b4", "#78abda"],
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
  
  const placeholderRows = Array(7)
    .fill({ uid: "", name: "", image: "" })
    .map((row, index) => ({ ...row, uid: `placeholder-${index}` }));
  const displayedData = loading ? placeholderRows : paginatedData;

  /* --- Function for representing numbers & currency in standard way --- */
  const formatNumber = (num) => {
    if (!num) return "N/A";
    const formattedNum = parseFloat(num).toFixed(2);
    return new Intl.NumberFormat("en-US").format(formattedNum);
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  /* --- Overview Header Cards Handling --- */
  const OrderCardData = [
    {
      title: "Total Orders",
      value: loading ? (
        <ShimmerLoader width="75px" height="21.5px" borderRadius="5px" />
      ) : (
        formatNumber(data?.totalOrders || "209")
      ),
      icon: <FaShoppingCart />,
    },
    {
      title: "Delivered Orders",
      value: loading ? (
        <ShimmerLoader width="75px" height="21.5px" borderRadius="5px" />
      ) : (
        formatNumber(data?.totalItemsSold || "89")
      ),
      icon: <FaShippingFast />,
    },
    {
      title: "Cancelled Orders",
      value: loading ? (
        <ShimmerLoader width="75px" height="21.5px" borderRadius="5px" />
      ) : (
        formatNumber(data?.netSale || "100")
      ),
      icon: <FaTimesCircle />,
    },
    {
      title: "Processing Orders",
      value: loading ? (
        <ShimmerLoader width="75px" height="21.5px" borderRadius="5px" />
      ) : (
        formatNumber(data?.totalOrders || "20")
      ),
      icon: <FaClipboardList />,
    },
    {
      title: "New Customers",
      value: loading ? (
        <ShimmerLoader width="75px" height="21.5px" borderRadius="5px" />
      ) : (
        formatNumber(data?.totalItemsSold || "12")
      ),
      icon: <FaUserPlus />,
    },
    {
      title: "Average Sale",
      value: loading ? (
        <ShimmerLoader width="75px" height="21.5px" borderRadius="5px" />
      ) : (
        formatCurrency(data?.netSale || "1209")
      ),
      icon: <FaHandHoldingUsd />,
    },
  ];

  return (
    <div className="AllOrderPage">
      <div className="Analytics-Section">
        <div className="LeftSide-Analytics">
          {/* --- Products Header Cards Section --- */}
          {Array.isArray(OrderCardData) && OrderCardData.length > 0 ? (
            OrderCardData.map((item, index) => (
              <div key={index} className="Order-Row01-Card">
                <OrderViewCard
                  title={item.title}
                  value={item.value}
                  icon={item.icon}
                />
              </div>
            ))
          ) : (
            <p>Loading data...</p>
          )}
        </div>
        <div className="RightSide-Analytics">
          <div className="Card-Heading-RightSide">
            <p>Total Orders</p>
          </div>
          <ApexChart24 series={chartSeries} options={chartOptions} />
        </div>
      </div>

      <div className="Filters-Section">
        <Accordion allowZeroExpanded className="accordion">
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>Filters</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {/* First Row: Labels */}
              <div className="filter-row-01">
                <div className="filter-label">Order Id</div>
                <div className="filter-label">Phone No</div>
                <div className="filter-label">Email</div>
                <div className="filter-label">Status</div>
              </div>

              {/* Second Row: React Select Fields */}
              <div className="filter-row-02">
                <InputField
                  value={orderId}
                  name="orderId"
                  onChange={(e) =>
                    handleFilterChange(e.target.value, "orderId")
                  }
                  placeholder="Enter Order ID"
                />
                <InputField
                  value={phoneNo}
                  name="phoneNo"
                  onChange={(e) =>
                    handleFilterChange(e.target.value, "phoneNo")
                  }
                  placeholder="Enter Phone Number"
                />
                <InputField
                  value={email}
                  name="email"
                  onChange={(e) => handleFilterChange(e.target.value, "email")}
                  placeholder="Enter Email"
                />
                <div className="custom-dropdown-wrapper-Filter">
                  <CustomDropdown
                    options={orderStatusOptions}
                    selectedOption={
                      orderStatusOptions.find(
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
                    optionsHeight={110}
                    dropdownSelectedStyle="7px"
                  />
                </div>
              </div>

              {/* Third Row: Labels */}
              <div className="filter-row-03">
                <div className="filter-label">Product Name</div>
                <div className="filter-label">Customer</div>
                <div className="filter-label">Date</div>
                <div className="filter-label">Payment Method</div>
              </div>

              {/* Fourth Row: React Select Fields */}
              <div className="filter-row-02">
                <InputField />
                <InputField />
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
                    options={payMethodsOptions}
                    selectedOption={
                      payMethodsOptions.find(
                        (method) => method.value === selectedMethod
                      )?.label || "Select a Payment Method"
                    }
                    handleOptionChange={(value) =>
                      handleFilterChange(value, "paymentMethod")
                    }
                    dropdownWidth={245}
                    dropdownMarginBottom="13px"
                    backgroundColor="var(--third-layer-bg)"
                    optionsWidth={243}
                    optionsBackgroundColor="var(--third-layer-bg)"
                    optionsHeight={75}
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

      <div className="Orders-Table-Data">
        <div>
          <DataTable
            columns={OrdersColumns}
            data={displayedData}
            // data={paginatedData}
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
              Are you sure you want to delete this Order? <br />
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
                  } // Conditionally render text
                  className={`Cat-Delete-btn btn-danger ${isActive ? "active" : ""
                    }`}
                  disabled={isLoading} // Disable button while loading
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

export default AllOrders;

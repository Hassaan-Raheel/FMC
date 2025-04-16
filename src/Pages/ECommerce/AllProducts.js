import React from "react";
import axios from "axios";
import "./ECommerce.css";
import "../Page.css";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import SearchBar from "../../Components/UI-Controls/SearchBar/Search";
import searchIcon from "../../Assets/Images/Search Bar 20 x 20.png";
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
import { Url } from "../../Services/Api";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import defaultImage from "../../Assets/Images/defaultBannerImage 128 x 128.png";
import PriceRange from "../../Components/UI-Controls/RangeFilter/PriceRange";
import CustomDropdown from "../../Components/UI-Controls/Dropdown/dropdown";
import RatingReview from "../../Components/UI-Controls/StarRating/Rating";
import SearchMultiple from "../../Components/UI-Controls/MultiSelect/Multiselect";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import BottomToust from "../../Components/BottomToust/BottomToust";
import { CiWarning } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";

const AllProducts = () => {
  const rowsPerPage = 10;
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [rating, setRating] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [selectedTrandingStatus, setSelectedTrandingStatus] = useState(null);
  const [selectedProductStatus, setSelectedProductStatus] = useState(null);
  const [selectedStockStatus, setSelectedStockStatus] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filtersModified, setFiltersModified] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagselect, setTagSelect] = useState([]);
  const [selectedTagType, setSelectedTagType] = useState(null);
  const [tags, setGetTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${Url}/api/v1/productCategory/get`
      );
      const data = await response.json();

      if (!data || !data.categories) {
        console.error("No categories found in the response data");
        setCategories([]);
        return;
      }

      // Map all categories to the required format
      const allCategories = data.categories
        .filter((category) => category.name)
        .map((category) => ({
          label: category.name,
          value: category.uid,
        }));

      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const handleCategorySelect = (categoryLabel) => {
    setSelectedCategories((prevCategories) => {
      const isCategorySelected = prevCategories.some(
        (category) => category.label === categoryLabel
      );

      if (isCategorySelected) {
        setFiltersModified(true);
        return prevCategories.filter(
          (category) => category.label !== categoryLabel
        );
      } else {
        const selectedCategory = categories.find(
          (category) => category.label === categoryLabel
        );
        if (selectedCategory) {
          setFiltersModified(true);
          return [
            ...prevCategories,
            { label: selectedCategory.label, uid: selectedCategory.value },
          ];
        }
        return prevCategories;
      }
    });
  };

  const handleFilters = () => {
    if (
      !rating &&
      !priceRange &&
      !selectedTrandingStatus &&
      !selectedProductStatus &&
      !selectedStockStatus &&
      !selectedCategories.length &&
      !selectedTags.length &&
      (!dateRange || dateRange.length !== 2)
    ) {
      let warningMessage = "Kindly select or enter respective filtration value...";
      setToastMessage(warningMessage);
      setShowMessage(true);
      return;
    }

    console.log("Selected Filters:", {
      rating,
      priceRange,
      selectedTrandingStatus,
      selectedProductStatus,
      selectedStockStatus,
      selectedCategories,
      dateRange,
      selectedTags,
    });

    const filteredData = data.filter((item) => {
      const stockMatch = selectedStockStatus
        ? item.manage_stock?.stock_status.toLowerCase() ===
        selectedStockStatus.toLowerCase()
        : true;

      const statusMatch = selectedProductStatus
        ? item.status.toLowerCase() === selectedProductStatus.toLowerCase()
        : true;

      const trandingMatch = selectedTrandingStatus
        ? item[selectedTrandingStatus] === 1
        : true;

      const categoryMatch = selectedCategories.length
        ? selectedCategories.some((category) =>
          item.categories.some(
            (itemCategory) => itemCategory.uid === category.uid
          )
        )
        : true;

      const ratingMatch = rating
        ? parseFloat(item.rating_count) === parseFloat(rating)
        : true;

      const priceRangeMatch =
        priceRange && item.regular_price
          ? parseFloat(item.regular_price) <= parseFloat(priceRange)
          : true;

      const tagMatch = selectedTags.length
        ? item.tags.some((tag) => tag.name === selectedTags[0].name)
        : true;

      return (
        stockMatch &&
        trandingMatch &&
        statusMatch &&
        categoryMatch &&
        priceRangeMatch &&
        tagMatch &&
        ratingMatch
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
    rating,
    priceRange,
    selectedTrandingStatus,
    selectedProductStatus,
    selectedStockStatus,
    selectedCategory,
    selectedTags,
    filtersApplied,
    filtersModified,
  ]);

  const handleFilterChange = (value, fieldName) => {
    if (fieldName === "priceRange") {
      setPriceRange(value);
    } else if (fieldName === "rating") {
      setRating(value);
    } else if (fieldName === "stock") {
      setSelectedStockStatus(value);
    } else if (fieldName === "status") {
      setSelectedProductStatus(value);
    } else if (fieldName === "tranding") {
      setSelectedTrandingStatus(value);
    } else if (fieldName === "category") {
      setSelectedCategories(value);
    } else if (fieldName === "date") {
      setDateRange(value);
    }
    setFiltersModified(true);
  };

  const handleResetFilters = () => {
    setRating("");
    setPriceRange("");
    setSelectedTrandingStatus(null);
    setSelectedProductStatus(null);
    setSelectedStockStatus(null);
    setSelectedCategory(null);
    setDateRange(null);
    setSelectedTags([]);
    setSelectedCategories([]);
    setSelectedTagType(null);
    setFiltersApplied(false);
    setFiltersModified(false);
    fetchTableData();
  };

  const productStockOptions = [
    { value: "inStock", label: "In Stock" },
    { value: "outStock", label: "Out of Stock" },
  ];

  const productStatusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ];

  const trendingOptions = [
    { value: "deal_of_month", label: "Deal of the Month" },
    { value: "best_selling_product", label: "Best Selling Product" },
    { value: "featured", label: "Featured Product" },
  ];

  useEffect(() => {
    fetchTableData();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${Url}/api/v1/productTag/get`
        );
        const data = response.data.productTags;

        const formattedTags = data.map((tag) => ({
          _id: tag._id,
          uid: tag.uid,
          name: tag.name,
          slug: tag.slug,
          text: tag.text,
          type: tag.type,
          bg_color: tag.bg_color,
          text_color: tag.text_color,
        }));

        setGetTags(formattedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (tagselect) {
    }
  }, [tagselect]);

  /* --- Function for Handling of Tag Selection in Product Data General Tab --- */
  const handleTagSelect = (tagName) => {
    setSelectedTags((prevTags) => {
      const isTagSelected = prevTags.some((tag) => tag.name === tagName);

      if (isTagSelected) {
        setFiltersModified(true);
        return [];
      } else {
        const selectedTag = tags.find((tag) => tag.name === tagName);
        if (selectedTag) {
          setFiltersModified(true);
          return [selectedTag];
        }
        return prevTags;
      }
    });
  };

  async function fetchTableData() {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.get(`${Url}/api/v1/products/get`);
        const reversedData = response.data.products.reverse();
        const filteredProducts = reversedData.filter(
          (product) => product.parent === 0
        );
        setData(filteredProducts);
        setOriginalData(filteredProducts);
        setFilteredData(filteredProducts);
      } catch (error) {
        console.error("There was an error fetching the data:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  }

  const convertToCSV = (data) => {
    if (!data) return "";

    const flattenObject = (obj, parentKey = "", result = {}) => {
      for (let key in obj) {
        const propName = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          flattenObject(obj[key], propName, result);
        } else {
          result[propName] = obj[key];
        }
      }
      return result;
    };

    const flattenedData = data.map((row) => flattenObject(row));
    const keys = Object.keys(flattenedData[0]);
    const header = keys.join(",");
    const rows = flattenedData.map((row) =>
      keys.map((key) => (row[key] === undefined ? "" : row[key])).join(",")
    );

    return [header, ...rows].join("\n");
  };

  const handleExport = async () => {
    try {
      if (data.length === 0) {
        await fetchTableData();
      }

      const dataToExport =
        selectedRows.size > 0
          ? data.filter((row) => selectedRows.has(row._id))
          : data;

      const csv = convertToCSV(dataToExport);

      if (!csv) throw new Error("No data to export");
      let successMessage = "Data has been exported successfully!";
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Product_Record.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage(successMessage);
      setShowMessage(true);
    } catch (error) {
      let errorMessage = "Something went wrong. Kindly check it carefully.";
      console.error(error);
      setToastMessage(errorMessage);
      setShowMessage(true);
    }
  };

  const handleRowSelection = (rowId) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.has(rowId)) {
        const updatedSet = new Set(prevSelected);
        updatedSet.delete(rowId);
        return updatedSet;
      } else {
        return new Set([...prevSelected, rowId]);
      }
    });
  };

  const handleAddProduct = () => {
    navigate("/E-Commerce/Add-Product");
  };

  const handleImport = () => console.log("Import button has been clicked");

  const handleSearch = async (searchValue) => {
    if (!searchValue) {
      fetchTableData();
      return;
    }

    try {
      const response = await searchForProducts(searchValue);
      setFilteredData(response.data.products);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const searchForProducts = async (text) => {
    const api = `/api/v1/products/by-name?name`;
    try {
      const response = await axios.get(`${Url + api}=${text}`);
      return response;
    } catch (error) {
      console.error("Error fetching data", error);
      throw error;
    }
  };

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
      case "edit":
        if (row.parent === 0) {
          handleEdit(row);
        } else {
          let errorMessage = "Not edited due to single product of Variable type.";
          setToastMessage(errorMessage);
          setShowMessage(true);
        }
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
      default:
        break;
    }
  };

  const confirmDelete = (row) => {
    setCurrentRowId(row.uid);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
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
      let successMessage = "Product deleted successfully!";

      const response = await fetch(`${Url}/api/v1/products/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      setData((prevItems) => prevItems.filter((item) => item._id !== id));

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
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDeleteClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleDeleteClickOutside);
    };
  }, []);

  const ProductsColumns = [
    {
      name: (
        <input
          type="checkbox"
          style={{ margin: 0 }}
          onChange={(e) => {
            const isChecked = e.target.checked;
            if (isChecked) {
              setSelectedRows(new Set(data.map((row) => row._id)));
            } else {
              setSelectedRows(new Set());
            }
          }}
          checked={selectedRows.size === data.length && data.length > 0}
        />
      ),
      cell: (row) => (loading ? <ShimmerLoader width="20px" height="20px" /> :
        <input
          type="checkbox"
          style={{ margin: 0 }}
          checked={selectedRows.has(row._id)}
          onChange={(e) => handleRowSelection(row._id, e.target.checked)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "50px",
    },
    {
      name: "Image",
      cell: (row) => (loading ? <ShimmerLoader width="60px" height="50px" /> :
        <img
          src={
            row.image
              ? `${Url + row.image.image_url}`
              : defaultImage
          }
          alt={row.name}
          width="auto"
          height="40px"
          style={{ objectFit: "cover" }}
        />
      ),
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => (loading ? <ShimmerLoader width="80px" height="22.5px" borderRadius="20px" /> :
        <span
          onClick={() => handleView(row)}
          style={{
            cursor: "pointer",
            color: "var(--primary-color)",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            maxHeight: "54px",
          }}
        >
          {row.name ? row.name : "N/A"}
        </span>
      ),
      width: "140px",
    },
    {
      name: "SKU",
      selector: (row) => (loading ? <ShimmerLoader width="80px" height="22.5px" borderRadius="20px" /> :
        <span
          onClick={() => handleView(row)}
          style={{
            cursor: "pointer",
            color: "var(--primary-color)",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            maxHeight: "54px",
          }}
        >
          {row.sku ? row.sku : "N/A"}
        </span>
      ),
      width: "140px",
    },
    {
      name: "Stock",
      cell: (row) => (
        !loading ? (
          (() => {
            let textColor;
            let backgroundColor;
            let stockLabel;

            switch (row.manage_stock?.stock_status) {
              case "inStock":
                textColor = "#5285B4";
                backgroundColor = "#5285B4" + "10";
                stockLabel = "In Stock";
                break;
              case "outOfStock":
                textColor = "#F08F9F";
                backgroundColor = "#F08F9F" + "10";
                stockLabel = "Out of Stock";
                break;
              case "lowStock":
                textColor = "#F4B074";
                backgroundColor = "#F4B074" + "10";
                stockLabel = "Low Stock";
                break;
              default:
                textColor = "#36454F";
                backgroundColor = "transparent";
                stockLabel = "Undefined";
            }

            return (
              <div
                style={{
                  color: textColor,
                  backgroundColor: backgroundColor,
                  padding: "5px 10px 5px 10px",
                  borderRadius: "5px",
                  boxSizing: "border-box",
                  display: "inline-block",
                  fontWeight: 600,
                }}
              >
                {stockLabel}
              </div>
            );
          })()
        ) : (
          <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
        )
      ),
      width: "135px",
    },
    {
      name: "Price",
      selector: (row) => (loading ? <ShimmerLoader width="60px" height="22.5px" borderRadius="20px" /> :
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(row.sale_price)),
      width: "90px",
    },
    {
      name: "Product Tag",
      selector: (row) => (
        !loading ? (
          row.product_tag ? (
            <span
              key={row.product_tag._id}
              style={{
                display: "inline-block",
                backgroundColor: row.product_tag.bg_color
                  ? `${row.product_tag.bg_color}80`
                  : "rgba(221, 221, 221, 0.5)",
                color: row.product_tag.text_color || "#000",
                padding: "5px 10px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              {row.product_tag.text || row.product_tag.name}
            </span>
          ) : (
            "N/A"
          )
        ) : (
          <ShimmerLoader width="80px" height="22.5px" borderRadius="20px" />
        )
      ),
      width: "160px",
    },
    {
      name: "Category",
      selector: (row) => (
        loading ? (
          <ShimmerLoader width="90px" height="22.5px" borderRadius="20px" />
        ) : (
          (() => {
            const mainCategory = row.categories?.find((category) => category.is_main === 1);
            const fallbackCategory = row.categories?.[0];
            return mainCategory?.name || fallbackCategory?.name || "N/A";
          })()
        )
      ),
      width: "125px",
    },
    {
      name: "Status",
      cell: (row) => (
        loading ? (
          <ShimmerLoader width="100px" height="22.5px" borderRadius="20px" />
        ) : (
          (() => {
            let textColor;
            let bgColor;
            switch (row.status) {
              case "draft":
                textColor = "#F4B074";
                bgColor = "transparent";
                break;
              case "published":
                textColor = "#5285B4";
                bgColor = "transparent";
                break;
              default:
                textColor = "#8DF9A1";
                bgColor = "#8DF9A11A";
                break;
            }

            const capitalizeStatus = row.status
              ? row.status.charAt(0).toUpperCase() +
              row.status.slice(1).toLowerCase()
              : "Unknown";

            return (
              <div
                style={{
                  color: textColor,
                  backgroundColor: bgColor,
                  padding: "5px 10px",
                  borderRadius: "5px",
                  display: "inline-block",
                  fontWeight: 600,
                }}
              >
                {capitalizeStatus}
              </div>
            );
          })()
        )
      ),
      width: "115px",
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
                  onClick={() => handleAction("duplicate", row)}
                >
                  <HiOutlineDocumentDuplicate style={{ marginRight: "12px" }} className="icon-img-updated"/>
                  Duplicate
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
      width: "80px",
    },
  ];

  const handleEdit = (row) => {
    navigate((`/E-Commerce/Edit-Product/${row._id}`), { state: { productData: row } });
  };

  const handleView = (row) => {
    navigate((`/E-Commerce/View-Product/${row._id}`), { state: { viewData: row } });
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
    <div className="AllProductPage">

      <div className="sectionall_1">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <SearchBar onSearch={handleSearch} icon={searchIcon} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            marginRight: "15px",
          }}
        >
          <CustomBtn
            label="Add Product"
            withIcon={true}
            iconType="plus"
            className="AddBtn"
            onClick={handleAddProduct}
            type="submit"
          />
          <CustomBtn
            label="Import"
            withIcon={true}
            iconType="import"
            className="ImportBtn"
            onClick={handleImport}
            type="button"
          />
          <CustomBtn
            label="Export"
            withIcon={true}
            iconType="import"
            className="ExportBtn"
            onClick={handleExport}
            type="button"
          />
        </div>
      </div>

      <div className="sectionall_2">
        <Accordion allowZeroExpanded className="accordion">
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>Filters</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="filter-row-01">
                <div className="filter-label">Stock</div>
                <div className="filter-label">Product Status</div>
                <div className="filter-label">Trending Product</div>
                <div className="filter-label">Product Rating</div>
              </div>

              <div className="filter-row-02">

                <div className="custom-dropdown-wrapper-Filter">
                  <CustomDropdown
                    options={productStockOptions}
                    selectedOption={
                      productStockOptions.find(
                        (option) => option.value === selectedStockStatus
                      )?.label || "Select Status"
                    }
                    handleOptionChange={(value) =>
                      handleFilterChange(value, "stock")
                    }
                    dropdownWidth={245}
                    dropdownMarginBottom="13px"
                    backgroundColor="var(--third-layer-bg)"
                    optionsWidth={243}
                    optionsBackgroundColor="var(--third-layer-bg)"
                    optionsHeight={"auto"}
                    dropdownSelectedStyle="7px"
                  />
                </div>

                <div className="custom-dropdown-wrapper-Filter">
                  <CustomDropdown
                    options={productStatusOptions}
                    selectedOption={
                      productStatusOptions.find(
                        (option) => option.value === selectedProductStatus
                      )?.label || "Select Product Status"
                    }
                    handleOptionChange={(value) =>
                      handleFilterChange(value, "status")
                    }
                    dropdownWidth={245}
                    dropdownMarginBottom="13px"
                    backgroundColor="var(--third-layer-bg)"
                    optionsWidth={243}
                    optionsBackgroundColor="var(--third-layer-bg)"
                    optionsHeight={"auto"}
                    dropdownSelectedStyle="7px"
                  />
                </div>

                <div className="custom-dropdown-wrapper-Filter">
                  <CustomDropdown
                    options={trendingOptions}
                    selectedOption={
                      trendingOptions.find(
                        (option) => option.value === selectedTrandingStatus
                      )?.label || "Select Tranding Status"
                    }
                    handleOptionChange={(value) =>
                      handleFilterChange(value, "tranding")
                    }
                    dropdownWidth={245}
                    dropdownMarginBottom="13px"
                    backgroundColor="var(--third-layer-bg)"
                    optionsWidth={243}
                    optionsBackgroundColor="var(--third-layer-bg)"
                    optionsHeight={116}
                    dropdownSelectedStyle="7px"
                  />
                </div>

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

              <div className="filter-row-03">
                <div className="filter-label">Category</div>
                <div className="filter-label">Tags</div>
                <div className="filter-label">Price Range</div>
              </div>

              <div className="filter-row-02">
                <div className="custom-dropdown-wrapper-Filter">
                  <SearchMultiple
                    name="multiSelect-Cat"
                    placeholder="Search & Select Category..."
                    options={categories.map((category) => category.label)}
                    onSelect={(option) => handleCategorySelect(option)}
                    selectedItems={selectedCategories.map(
                      (category) => category.label
                    )}
                    width="245px"
                    minheight="40px"
                    suggestionHeight="70px"
                  />
                </div>
                <div className="custom-dropdown-wrapper-Filter">
                  <SearchMultiple
                    name="multiSelect-Tag"
                    placeholder="Search & Select Tag..."
                    options={tags.map((tag) => tag.name)}
                    onSelect={(option) => handleTagSelect(option)}
                    selectedItems={selectedTags.map((tag) => tag.name)}
                    width="245px"
                    minheight="40px"
                    suggestionHeight="70px"
                  />
                </div>

                <PriceRange
                  placeholder="Enter Max. Amount"
                  value={priceRange}
                  name="priceRange"
                  onChange={(e) =>
                    handleFilterChange(e.target.value, "priceRange")
                  }
                  readOnly={false}
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

      <div className="sectionall_3">
        <div>
          <DataTable
            columns={ProductsColumns}
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
              Are you sure you want to delete this Product? <br />
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

export default AllProducts;
import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Url } from "../../Services/Api";
import "./ECommerce.css";
import "../Page.css";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import SearchBar from "../../Components/UI-Controls/SearchBar/Search";
import searchIcon from "../../Assets/Images/Search Bar 20 x 20.png";
import actionIcon from "../../Assets/Images/ActionBtn 30 x 30.png";
import DataTable from "react-data-table-component";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import BottomToust from "../../Components/BottomToust/BottomToust";
import { CiWarning } from "react-icons/ci";
import { Tooltip } from 'antd';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { GrConfigure } from "react-icons/gr";

const AttributeTypeForm = ({
  attribute,
  onBack,
  handleSubmit,
  handleInputChangeNew,
  formData,
}) => {
  return (
    <div style={{ width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="terms_label">
            Label<span className="superscript">*</span>
          </label>
          <input
            type="text"
            id="label"
            name="label"
            placeholder="Term Name"
            value={formData.label}
            onChange={handleInputChangeNew}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Description Here"
            value={formData.description}
            onChange={handleInputChangeNew}
            required
          />
        </div>

        <div className="AttributesBtn">
          <div className="SubmitBtn-Attribute">
            <button onClick={onBack} className="CancelEditBtn">
              Cancel
            </button>
            <button type="submit" className="AddCatBtn">
              Submit {attribute.type}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const ProductsAttr = () => {
  const modalRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [attrData, setAttrData] = useState({
    name: "",
    slug: "",
    sortOrder: "",
    enableArchive: false,
    variableType: "select",
    variableShape: "",
  });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showParentForm, setShowParentForm] = useState(true);
  const [showAttributeForm, setShowAttributeForm] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    attributeId: "",
    label: "",
    value: "",
    description: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const rowsPerPage = 10;

  const fetchTableData = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.get(`${Url}/api/v1/attributes/get`);
        const productAttributes = response.data.ProductsAttributes || [];

        const reversedData = productAttributes.reverse();

        setData(reversedData);
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

  useEffect(() => {
    if (selectedAttribute) {
      setFormData({
        label: "",
        value: "",
        description: "",
        attributeId: selectedAttribute._id,
      });
    }
  }, [selectedAttribute]);

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

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

  const handleInputChange = (e, fieldType = null, fieldName = null) => {
    const { name, type, checked, value } = e.target;

    if (fieldType === "dropdown") {
      setAttrData((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    } else {
      let newSlug = attrData.slug;

      if (name === "name") {
        newSlug = value.toLowerCase().replace(/\s+/g, "-");
      }

      setAttrData({
        ...attrData,
        [name]: type === "checkbox" ? checked : value,
        slug: newSlug,
      });
    }
  };

  const handleDuplicate = () => {
    console.log("Duplicate selected rows:", selectedRows);
  };

  const handleConfigureAttributes = (row) => {
    setShowParentForm(false);
    setShowAttributeForm(true);
    setSelectedAttribute(row);
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleAction = (action, row) => {
    console.log(`Action: ${action} triggered for row:`, row);
    switch (action) {
      case "edit":
        setOpenDropdownId(null);
        break;
      case "delete":
        confirmDelete(row);
        setOpenDropdownId(null);
        break;
      case "duplicate":
        setOpenDropdownId(null);
        break;
      case "configure":
        handleConfigureAttributes(row);
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

  const handleAddAttribute = async () => {
    const formData = new FormData();

    formData.append("name", attrData.name);
    formData.append("slug", attrData.slug);
    formData.append("sortOrder", attrData.sortOrder);
    formData.append("enableArchive", attrData.enableArchive);
    formData.append("type", attrData.variableType);
    formData.append("variableShape", attrData.variableShape);

    try {
      let successMessage = "Attribute submitted successfully!";
      setLoading(true);

      const response = await axios.post(
        `${Url}/api/v1/attributes/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setToastMessage(successMessage);
      setShowMessage(true);

      setAttrData({
        name: "",
        slug: "",
        sortOrder: "",
        enableArchive: false,
        variableType: "select",
        variableShape: "",
      });

      fetchTableData();
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      console.error("Error submitting form:", error);
      setToastMessage(errorMessage);
      setShowMessage(true);
    } finally {
      setLoading(false);
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
        overflow: "wrap",
        textOverflow: "ellipsis",
        whiteSpace: "normal",
        overflow: "visible",
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
        overflow: "visible",
        position: "relative",
      },
    },
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
      let failureMessage = "Tag deleted successfully!";
      // console.log(`Attempting to delete item with ID: ${id}`);

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
      cell: (row) => loading ? (
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
      allowOverflow: true,
      button: true,
      width: "50px",
    },
    {
      name: "Name",
      selector: (row) => loading ? (
        <ShimmerLoader width="125px" height="22.5px" borderRadius="20px" />
      ) : (row.name),
      width: "170px",
    },
    {
      name: "Terms",
      selector: (row) => loading ? (
        <ShimmerLoader width="250px" height="22.5px" borderRadius="20px" />
      ) : (
        <Tooltip title={row.terms?.map((term) => term.label).join(", ") || "No Terms"}>
          <span>{row.terms?.map((term) => term.label).join(", ") || "No Terms"}</span>
        </Tooltip>
      ),
      width: "375px",
    },
    {
      name: "Action",
      cell: (row) => loading ? (
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
                  onClick={() => handleAction("duplicate", row)}
                >
                  <HiOutlineDocumentDuplicate style={{ marginRight: "12px" }} className="icon-img-updated" />
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
                  <RiDeleteBin6Line style={{ marginRight: "12px" }} className="icon-img-updated" />
                  Delete
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
                  Quick Edit
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "5px 10px",
                    border: "none",
                  }}
                  onClick={() => handleAction("configure", row)}
                >
                  <GrConfigure style={{ marginRight: "12px" }} className="icon-img-updated" />
                  Configure Term
                </li>
              </ul>
            </div>
          )}
        </div>
      ),
      width: "85px",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${Url}/api/v1/attributes/add-term`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        let successMessage = "Attribute-Term submitted successfully!";
        setFormData({ label: "", value: "", description: "", attributeId: "" });
        setToastMessage(successMessage);
        setShowMessage(true);
        fetchTableData();
        setShowParentForm(true);
        setShowAttributeForm(false);
        setSelectedAttribute(null);
      } else {
        let failureMessage = "Failed to add attribute term. Please try again.";
        setToastMessage(failureMessage);
        setShowMessage(true);
      }
    } catch (error) {
      let errorMessage = "An error occurred. Please check your network and try again.";
      console.error("Error submitting form:", error);
      setToastMessage(errorMessage);
      setShowMessage(true);
    }
  };

  const handleInputChangeNew = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "label" && { value: value.toLowerCase() }),
    }));
  };

  const handleBackToParent = () => {
    setShowParentForm(true);
    setShowAttributeForm(false);
    setSelectedAttribute(null);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="ProductAttrPage">
      <div className="AttrSection-01">
        <span className="Section1-Leftside">Attributes</span>
        <div className="Section1-Rightside-Updated">
          <div className="SearchBar-Alignment">
            <SearchBar
              onSearch={handleSearch}
              icon={searchIcon}
              placeholder="Search attribute by name"
            />
          </div>
          {selectedRows.length > 0 && (
            <div className="SelectionBtn-Row">
              <>
                <CustomBtn
                  label="Duplicate"
                  className="SelectedDuplicateBtn"
                  onClick={handleDuplicate}
                  type="button"
                />
                <CustomBtn
                  label="Delete"
                  className="SelectedDeleteBtn"
                  type="button"
                />
              </>
            </div>
          )}
        </div>
      </div>

      <div
        className={`AttrSection-02 ${selectedRows.length > 0 ? "translate-down" : ""
          }`}
      >
        <div className="Section2-Leftside">
          <div className="Header">
            {showParentForm
              ? "Add New Attribute"
              : selectedAttribute?.type || ""}
          </div>
          <div className="NewAttr-Add">
            {showParentForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddAttribute();
                }}
              >
                <div className="form-row">
                  <label htmlFor="name">
                    Attribute Name<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Attribute Name"
                    value={attrData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="slug">
                    Slug<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    placeholder="Slug"
                    value={attrData.slug}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="SubmitBtn">
                  <CustomBtn
                    label="Add Attribute"
                    className="AddCatBtn"
                    onClick={handleAddAttribute}
                    type="button"
                  />
                </div>
              </form>
            )}
            {showAttributeForm && (
              <AttributeTypeForm
                attribute={selectedAttribute}
                onBack={handleBackToParent}
                handleSubmit={handleSubmit}
                handleInputChangeNew={handleInputChangeNew}
                formData={formData}
              />
            )}
          </div>
        </div>
        <div className="Section2-Rightside">
          <div className="Attribute-Data">
            <div>
              <DataTable
                columns={columns}
                data={displayedData}
                customStyles={customStyles}
              // data={paginatedData}
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

      {/* --- (PopUp) To Handle Confiramtion for Delete Operation of Single Category --- */}
      {showConfirm && (
        <div className="confirmation-modal">
          <div className="Cat-modal-content" ref={modalRef}>
            <CiWarning className="warning-icon" />
            <div className="Delete-Heading">Warning</div>
            <div className="Delete-Content">
              Are you sure you want to delete this Attribute? <br />
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

export default ProductsAttr;
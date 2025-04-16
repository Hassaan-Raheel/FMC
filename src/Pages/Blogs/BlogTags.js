import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Url } from "../../Services/Api";
import "../ECommerce/ECommerce.css";
import "../Page.css";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import SearchBar from "../../Components/UI-Controls/SearchBar/Search";
import searchIcon from "../../Assets/Images/Search Bar 20 x 20.png";
import actionIcon from "../../Assets/Images/ActionBtn 30 x 30.png";
import DataTable from "react-data-table-component";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import BottomToust from "../../Components/BottomToust/BottomToust";
import { CiWarning } from "react-icons/ci";
import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";

const BlogTags = () => {
  const modalRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tagData, setTagData] = useState({
    id: null,
    name: "",
    slug: "",
    description: "",
  });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [submissionActive, setSubmissionActive] = useState(false);
  const rowsPerPage = 10;

  const fetchBlogsData = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.get(`${Url}/api/v1/blog-tags/get`);
        const blogTags = response.data.tags || [];
        const reversedData = blogTags.reverse();
        setData(reversedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  useEffect(() => {
    fetchBlogsData();
  }, []);

  const handleSearch = () => console.log("Search has been triggered");

  const handleInputChange = (event) => {
    const { name, type, value } = event.target;

    if (type === "color") {
      setTagData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "type") {
      setTagData((prevData) => ({
        ...prevData,
        type: value,
      }));
    } else {
      setTagData((prevData) => ({
        ...prevData,
        [name]: value,
        slug:
          name === "name"
            ? value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")
            : prevData.slug,
      }));
    }
  };

  const handleEdit = (row) => {
    setTagData({
      id: row._id,
      name: row.name,
      slug: row.slug,
      description: row.description,
    });
    setIsEditing(true);
  };

  const handleView = (row) => {
    // console.log("View clicked for:", row);
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

  const handleAddTag = async () => {
    setIsLoading(true);
    setSubmissionActive(true);

    const payload = {
      name: tagData.name,
      slug: tagData.slug,
      description: tagData.description,
    };

    try {
      let response;
      let successMessage = "Tag submitted successfully!";

      if (tagData.id) {
        response = await axios.put(
          `${Url}/api/v1/blog-tags/edit/${tagData.id}`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        successMessage = "Tag updated successfully!";
      } else {
        response = await axios.post(`${Url}/api/v1/blog-tags/add`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      }

      setToastMessage(successMessage);
      setShowMessage(true);

      setTagData({
        id: null,
        name: "",
        slug: "",
        description: "",
        type: "",
        bg_color: "#ffffff",
        text_color: "#ffffff",
        text: "",
        image: null,
      });
      setIsEditing(false);
      fetchBlogsData();
    } catch (error) {
      console.error("Error submitting form:", error);

      setToastMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      setShowMessage(true);
    } finally {
      setIsLoading(false);
      setSubmissionActive(false);
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

  const toggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleAction = (action, row) => {
    console.log(`Action: ${action} triggered for row:`, row);
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
        setOpenDropdownId(null);
        break;
      case "quickEdit":
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

  const handleDelete = () => {
    if (currentRowId) {
      deleteItem(currentRowId);
    }
  };

  const deleteItem = async (id) => {
    setIsLoading(true);
    setIsActive(true);

    try {
      let failureMessage = "Tag deleted successfully!";

      const response = await fetch(`${Url}/api/v1/blog-tags/delete/${id} `, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();

      setData((prevItems) => prevItems.filter((item) => item._id !== id));

      setToastMessage(failureMessage);
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

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allRowIds = data.map((row) => row._id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (rowId) => {
    if (!rowId) {
      console.warn("Invalid row ID:", rowId);
      return;
    }

    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowId)
        ? prevSelected.filter((id) => id !== rowId)
        : [...prevSelected, rowId]
    );
  };

  useEffect(() => {
  }, [selectedRows]);

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
      name: "Name",
      cell: (row) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {loading ? (
            <ShimmerLoader width="115px" height="22.5px" borderRadius="20px" />
          ) : (
            row.name
          )}
        </div>
      ),
      maxWidth: "150px",
    },
    {
      name: "Slug",
      cell: (row) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {loading ? (
            <ShimmerLoader width="115px" height="22.5px" borderRadius="20px" />
          ) : (
            row.slug
          )}
        </div>
      ),
      maxWidth: "150px",
    },
    {
      name: "Description",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="140px" height="22.5px" borderRadius="20px" />
        ) : (
          row.description
        ),
      width: "220px",
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
                    onClick={() => handleAction("quickEdit", row)}
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
      width: "115px",
    },
  ];

  const handleCancelEdit = () => {
    setTagData({
      name: "",
      slug: "",
      description: "",
      type: "",
      bg_color: "#FFFFFF",
      text_color: "#000000",
      text: "",
      name: "",
      image: null,
    });
    setIsEditing(false);
  };

  const handleDuplicate = () => {
    // console.log("Duplicate selected rows:", selectedRows);
  };

  const handleDelete2 = () => {
    //  console.log("Delete selected rows:", selectedRows);
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
    <div className="ProductTagPage">
      <div className="TagSection-01">
        <span className="Section1-Leftside">Tags</span>
        <div className="Section1-Rightside-Updated">
          <div className="SearchBar-Alignment">
            <SearchBar
              onSearch={handleSearch}
              icon={searchIcon}
              placeholder="Search Tag by Name"
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
                  onClick={handleDelete2}
                  type="button"
                />
              </>
            </div>
          )}
        </div>
      </div>

      {/* {isLoading && (
        <div className="backdrop">
          <MainLoader />
        </div>
      )} */}

      <div
        className={`TagSection-02 ${selectedRows.length > 0 ? "translate-down" : ""
          }`}
      >
        <div className="Section2-Leftside">
          <div className="Header">{isEditing ? "Edit Tag" : "Add New Tag"}</div>
          <div className="NewTag-Add">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTag();
              }}
            >
              <div className="form-row">
                <label htmlFor="name">
                  Name<span className="superscript">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Tag Name"
                  value={tagData.name}
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
                  value={tagData.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Tag Description Here"
                  value={tagData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="SubmitBtn">
                {isEditing && (
                  <CustomBtn
                    label="Cancel Edit"
                    className="CancelEditBtn"
                    onClick={handleCancelEdit}
                    type="button"
                  />
                )}
                <CustomBtn
                  label={
                    submissionActive ? <div className="btn-loader-BlogTag"></div> : (isEditing ? "Update Tag" : "Add Tag")
                  }
                  className={`AddCatBtn ${submissionActive ? "active1" : ""}`}
                  disabled={submissionActive}
                  onClick={handleAddTag}
                  type="button"
                />
              </div>
            </form>
          </div>
        </div>
        <div className="Section2-Rightside">
          <div className="Tag-Data">
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

      {/* --- (PopUp) To Handle Confiramtion for Delete Operation of Single Category --- */}
      {showConfirm && (
        <div className="confirmation-modal">
          <div className="Cat-modal-content" ref={modalRef}>
            <CiWarning className="warning-icon" />
            <div className="Delete-Heading">Warning</div>
            <div className="Delete-Content">
              Are you sure you want to delete this Tag? <br />
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

export default BlogTags;
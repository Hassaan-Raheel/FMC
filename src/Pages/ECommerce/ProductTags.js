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
import CustomDropdown from "../../Components/UI-Controls/Dropdown/dropdown";
import { IoImageOutline } from "react-icons/io5";
import ImageGalleryPopup from "../../Components/UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import BottomToust from "../../Components/BottomToust/BottomToust";
import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";
import { CiWarning } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { uploadImage } from "../../Services/functions";

const ProductsTag = () => {
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
    type: "",
    image: "",
    bg_color: "#ffffff",
    text_color: "#ffffff",
    text: "",
  });
  const [tagtypeimage, setTagTypeImage] = useState("");
  const [modalView, setModalView] = useState(false);
  const [modaldata, setModalData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedStatus, setUploadedStates] = useState(null);
  const [imageType, setImageType] = useState("");
  const [imageGalleryPopup, setImageGalleryPopup] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: "",
    title: "",
    description: "",
    link_url: "",
  });
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const rowsPerPage = 10;

  const handleGalleryModalOpen = (clickType) => {
    setModalView(true);
    setImageType(clickType);
  };

  const handleGalleryModalClose = () => {
    setModalView(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const api = `${Url}/api/v1/media/productsTags/add`;

    if (file) {
      setImageSendPayload((prevData) => ({
        ...prevData,
        file: file,
      }));
      setUploadedStates("loading");
      alert("wait");
      const imagePayloadToSend = new FormData();
      imagePayloadToSend.append("image", file);
      imagePayloadToSend.append("alt_text", imageSendPayload.alt_text);
      imagePayloadToSend.append("title", imageSendPayload.title);
      imagePayloadToSend.append("description", imageSendPayload.description);
      imagePayloadToSend.append("image_url", imageSendPayload.image_url);
      imagePayloadToSend.append("link_url", imageSendPayload.link_url);
      await uploadImage(imagePayloadToSend, api, setUploadedStates);
    }
    setIsUploaded(true);
  };

  const getApi = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/productsTags/get`);
      setModalData(response.data.media);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getApi();
  }, []);

  useEffect(() => {
    if (isUploaded) {
      getApi();
      setIsUploaded(false);
    }
  }, [isUploaded]);

  const handleImageSelect = (image) => {
    if (imageType === "image") {
      setTagData((prevData) => ({
        ...prevData,
        image: image.image_url,
      }));
      setTagTypeImage(image.image_url);
    } else {
      console.log("No section selected");
    }

    setModalView(false);
    setImageGalleryPopup(false);
  };

  useEffect(() => {
  }, [imageGalleryPopup]);

  const fetchTableData = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.get(`${Url}/api/v1/productTag/get`);
        const productTags = response.data.productTags || [];

        const reversedData = productTags.reverse();

        setData(reversedData);
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

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

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
      type: row.type,
      bg_color: row.bg_color || "",
      text_color: row.text_color || "",
      text: row.text || "",
      image: row.image ? `${Url + row.image}` : "",
    });

    const tagimagePreview = row.image ? `${Url + row.image}` : "";
    setTagTypeImage(tagimagePreview);
    setIsEditing(true);
  };

  const handleView = (row) => {
    // console.log("View clicked for:", row);
  };

  const cancelTagTypeImage = () => {
    setTagTypeImage(null);
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

    const formData = new FormData();
    formData.append("name", tagData.name);
    formData.append("slug", tagData.slug);
    formData.append("description", tagData.description);
    formData.append("type", tagData.type);

    if (tagData.type === "text") {
      formData.append("bg_color", tagData.bg_color);
      formData.append("text_color", tagData.text_color);
      formData.append("text", tagData.text);
    } else if (tagData.type === "image") {
      if (typeof tagData.image === "string" && !tagData.image.startsWith(Url)) {
        formData.append("image", tagData.image);
      } else if (tagData.image instanceof File) {
        formData.append("image", tagData.image);
      }
    }

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      let response;
      let successMessage = "Tag submitted successfully!";

      if (tagData.id) {
        response = await axios.put(`${Url}/api/v1/productTag/${tagData.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        successMessage = "Tag updated successfully!";
      } else {
        response = await axios.post(`${Url}/api/v1/productTag/add`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
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
      setTagTypeImage("");
      setIsEditing(false);
      fetchTableData();
    } catch (error) {
      console.error("Error submitting form:", error);

      setToastMessage(error.response?.data?.message || "An error occurred. Please try again.");
      setShowMessage(true);
    } finally {
      setIsLoading(false);
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

      const response = await fetch(`${Url}/api/v1/productTag/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();

      setData((prevItems) => prevItems.filter((item) => item._id !== id));

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
      allowOverflow: true,
      button: true,
      width: "50px",
    },
    {
      name: "Name",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="200px" height="22.5px" borderRadius="20px" />
        ) : (
          row.name
        ),
      width: "250px",
    },
    {
      name: "Tag Type",
      selector: (row) =>
        loading ? (
          <ShimmerLoader width="150px" height="22.5px" borderRadius="20px" />
        ) : (
          row.type
        ),
      width: "250px",
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
      width: "100px",
    },
  ];

  const tagTypeOptions = [
    { value: "image", label: "Image" },
    { value: "text", label: "Text" },
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
    // console.log("Delete selected rows:", selectedRows);
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

      {isLoading && (
        <div className="backdrop">
          <MainLoader />
        </div>
      )}

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

              <div className="form-row">
                <label htmlFor="tagType">
                  Tag Type<span className="superscript">*</span>
                </label>
                <div className="custom-dropdown-wrapper">
                  <CustomDropdown
                    options={tagTypeOptions}
                    selectedOption={
                      tagData.type.charAt(0).toUpperCase() +
                      tagData.type.slice(1)
                    }
                    handleOptionChange={(value) =>
                      handleInputChange({ target: { name: "type", value } })
                    }
                    dropdownWidth={298}
                    dropdownMarginBottom="10px"
                    backgroundColor="var(--third-layer-bg)"
                    optionsWidth={296}
                    optionsBackgroundColor="var(--third-layer-bg)"
                    dropdownSelectedStyle="7px"
                  />
                </div>
              </div>

              {/* Conditionally render additional fields if "text" is selected */}
              {tagData.type === "text" && (
                <>
                  <label
                    style={{
                      lineHeight: "18px",
                      color: "var(--text-color-1)",
                      fontFamily: "var(--font-family)",
                      fontWeight: "var(--font-weight-semi-bold)",
                      fontSize: "var(--font-size-large)",
                      marginBottom: "5px",
                      display: "block",
                    }}
                  >
                    Background Color<span className="superscript">*</span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "var(--standered-border)",
                      borderRadius: "var(--secondry-radius)",
                      height: "40px",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        lineHeight: "19.5px",
                        color: "var(--text-color-1)",
                        fontFamily: "var(--font-family)",
                        fontWeight: "var(--font-weight-regular)",
                        fontSize: "var(--font-size-avg)",
                        marginRight: "5px",
                        marginLeft: "10px",
                      }}
                    >
                      {tagData.bg_color}
                    </span>{" "}
                    <div style={{ flexGrow: 1 }} />{" "}
                    <input
                      type="color"
                      name="bg_color"
                      value={tagData.bg_color}
                      onChange={handleInputChange}
                      style={{
                        width: "34px",
                        height: "34px",
                        border: "none",
                        borderRadius: "3px",
                        margin: "5px",
                        padding: 0,
                      }}
                    />
                  </div>

                  <label
                    style={{
                      lineHeight: "18px",
                      color: "var(--text-color-1)",
                      fontFamily: "var(--font-family)",
                      fontWeight: "var(--font-weight-semi-bold)",
                      fontSize: "var(--font-size-large)",
                      marginBottom: "5px",
                      display: "block",
                      marginTop: "10px",
                    }}
                  >
                    Text Color<span className="superscript">*</span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "var(--standered-border)",
                      borderRadius: "var(--secondry-radius)",
                      height: "40px",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        lineHeight: "19.5px",
                        color: "var(--text-color-1)",
                        fontFamily: "var(--font-family)",
                        fontWeight: "var(--font-weight-regular)",
                        fontSize: "var(--font-size-avg)",
                        marginRight: "5px",
                        marginLeft: "10px",
                      }}
                    >
                      {tagData.text_color}
                    </span>{" "}
                    <div style={{ flexGrow: 1 }} />
                    <input
                      type="color"
                      name="text_color"
                      value={tagData.text_color}
                      onChange={handleInputChange}
                      style={{
                        width: "34px",
                        height: "34px",
                        border: "none",
                        outline: "none",
                        borderRadius: "3px",
                        margin: "5px",
                        padding: 0,
                      }}
                    />
                  </div>

                  <label
                    style={{
                      lineHeight: "18px",
                      color: "var(--text-color-1)",
                      fontFamily: "var(--font-family)",
                      fontWeight: "var(--font-weight-semi-bold)",
                      fontSize: "var(--font-size-large)",
                      marginBottom: "5px",
                      display: "block",
                      marginTop: "10px",
                    }}
                  >
                    Text<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    name="text"
                    placeholder="Text Here"
                    value={tagData.text}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "10px",
                      borderRadius: "var(--secondry-radius)",
                      border: "var(--standered-border)",
                      outline: "none",
                      fontFamily: "var(--font-family)",
                      fontSize: "var(--font-size-avg)",
                      color: "var(--text-color-1)",
                    }}
                  />

                  {/* Tag Preview */}
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "10px",
                      backgroundColor: tagData.bg_color,
                      color: tagData.text_color,
                      border: `2px solid ${tagData.text_color}`,
                      borderRadius: "var(--secondry-radius)",
                      display: "inline-block",
                      fontFamily: "var(--font-family)",
                      fontSize: "var(--font-size-avg)",
                      fontWeight: "var(--font-weight-regular)",
                      whiteSpace: "nowrap",
                      width: "max-content",
                      opacity: tagData.text ? 1 : 0,
                      transition: "width 0.3s ease, opacity 0.3s ease",
                      boxSizing: "border-box",
                    }}
                  >
                    {tagData.text || "Preview Text"}
                  </div>
                </>
              )}

              {tagData.type === "image" && (
                <>
                  <label
                    style={{
                      lineHeight: "18px",
                      color: "var(--text-color-1)",
                      fontFamily: "var(--font-family)",
                      fontWeight: "var(--font-weight-semi-bold)",
                      fontSize: "var(--font-size-large)",
                      marginBottom: "5px",
                      display: "block",
                    }}
                  >
                    Image<span className="superscript">*</span>
                  </label>
                  <div className="banner-upload">
                    {tagtypeimage ? (
                      <div className="image-preview-wrapper">
                        <img
                          src={
                            isEditing ? tagtypeimage : `${Url + tagtypeimage}`
                          }
                          alt="Thumbnail"
                          className="image-preview"
                        />
                        <button
                          onClick={cancelTagTypeImage}
                          className="cancel-button"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="tagtypeImage"
                        className="upload-label"
                        onClick={() => handleGalleryModalOpen("image")}
                      >
                        <div className="Tagupload-button">
                          <IoImageOutline
                            size={45}
                            color="#555"
                            className="uploaded-image"
                          />
                          <span className="uploadTag-text">
                            Click to Upload Image
                          </span>
                        </div>
                      </label>
                    )}
                    <ImageGalleryPopup
                      showImageGalleryPopUp={modalView}
                      handleModalView={handleGalleryModalClose}
                      handleFileChange={handleFileChange}
                      onImageSelect={handleImageSelect}
                      imageSendPayload={imageSendPayload}
                      setImageSendPayload={setImageSendPayload}
                      alt_text={imageSendPayload.alt_text}
                      title={imageSendPayload.title}
                      data={modaldata}
                    />
                  </div>
                </>
              )}

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
                  label={isEditing ? "Update Tag" : "Add Tag"}
                  className="AddCatBtn"
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

export default ProductsTag;
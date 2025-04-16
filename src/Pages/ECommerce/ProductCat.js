import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Url } from "../../Services/Api";
import "./ECommerce.css";
import "../Page.css";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import AccordionItem from "../../Components/UI-Controls/Accordian/Accordian";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import SearchBar from "../../Components/UI-Controls/SearchBar/Search";
import searchIcon from "../../Assets/Images/Search Bar 20 x 20.png";
import { IoImageOutline } from "react-icons/io5";
import DataTable from "react-data-table-component";
import Pagination from "../../Components/UI-Controls/Pagination/PaginationRashid";
import CustomDropdown from "../../Components/UI-Controls/Dropdown/dropdown";
import defaultImage from "../../Assets/Images/defaultBannerImage 128 x 128.png";
import TabBarView from "../../Components/UI-Controls/TabView/ProductCatTab";
import ImageGalleryPopup from "../../Components/UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup";
import actionIcon from "../../Assets/Images/ActionBtn 30 x 30.png";
import { CiWarning } from "react-icons/ci";
import { GoDuplicate } from "react-icons/go";
import { uploadImage } from "../../Services/functions";
import BottomToust from "../../Components/BottomToust/BottomToust";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";

const ProductsCat = () => {
  const modalRef = useRef(null);
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryData, setCategoryData] = useState({
    name: "",
    slug: "",
    parentCategory: "",
    catType: "",
    description: "",
    displayType: 1,
    menu_order: "",
    permalink: "",
    thumbnailImg: "",
    bannerImg: "",
    filterImg: "",
    mobilethumbnail: "",
    mobilebanner: "",
    metaTitle: "",
    metaDescription: "",
    keyPhrases: [],
    metaKeywords: "",
    canonicalUrl: "",
    robots: "",
    ogTitle: "",
    ogDescription: "",
    og_image: "",
    xTitle: "",
    xDescription: "",
    x_image: "",
    schemaMarkup: {},
  });
  const [imagePreview, setImagePreview] = useState("");
  const [thumbnailimage, setThumbnailImage] = useState("");
  const [filterimage, setFilterImage] = useState("");
  const [mobileimagePreview, setMobileImagePreview] = useState("");
  const [mobilethumbnailimage, setMobileThumbnailImage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [parentCatOpt, setParentCatOpt] = useState([]);
  const [parentOnlyOptions, setParentOnlyOptions] = useState([]); // Only parent categories
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAllConfirm, setShowAllConfirm] = useState(false);
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);
  const [selectedDuplicate, setSelectedDuplicate] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [modalView, setModalView] = useState(false);
  const [modaldata, setModalData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedXImage, setSelectedXImage] = useState(null);
  const [uploadedStatus, setUploadedStates] = useState(null);
  const [imageType, setImageType] = useState("");
  const [imageGalleryPopup, setImageGalleryPopup] = useState(false);
  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: "",
    title: "",
    description: "",
    link_url: "",
  });
  const [accordions, setAccordions] = useState([
    { keyPhrase: "", isAccordionOpen: false },
  ]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    const api = `${Url}/api/v1/media/category/add`;

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
      const response = await axios.get(`${Url}/api/v1/media/category/get`);
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
    if (imageType === "thumbnailImage") {
      setCategoryData((prevData) => ({
        ...prevData,
        thumbnailImg: image.image_url,
      }));
      setThumbnailImage(image.image_url);
    } else if (imageType === "bannerImage") {
      setCategoryData((prevData) => ({
        ...prevData,
        bannerImg: image.image_url,
      }));
      setImagePreview(image.image_url);
      console.log(imagePreview);
    } else if (imageType === "filterImage") {
      setCategoryData((prevData) => ({
        ...prevData,
        filterImg: image.image_url,
      }));
      setFilterImage(image.image_url);
      console.log(imagePreview);
    } else if (imageType === "mobilethumbnailImage") {
      setCategoryData((prevData) => ({
        ...prevData,
        mobilethumbnail: image.image_url,
      }));
      setMobileThumbnailImage(image.image_url);
    } else if (imageType === "mobilethumbnailImage") {
      setCategoryData((prevData) => ({
        ...prevData,
        mobilethumbnail: image.image_url,
      }));
      setMobileThumbnailImage(image.image_url);
    } else if (imageType === "mobilebannerImage") {
      setCategoryData((prevData) => ({
        ...prevData,
        mobilebanner: image.image_url,
      }));
      setMobileImagePreview(image.image_url);
    } else if (imageType === "socialImage") {
      setCategoryData((prevData) => ({
        ...prevData,
        og_image: image.image_url,
      }));
      setSelectedImage(image.image_url);
      console.log(selectedImage);
    } else if (imageType === "X-Image") {
      console.log("X Image has been called");
      setCategoryData((prevData) => ({
        ...prevData,
        x_image: image.image_url,
      }));
      setSelectedXImage(image.image_url);
    } else {
      console.log("No section selected");
    }

    setModalView(false);
    setImageGalleryPopup(false);
  };

  useEffect(() => {
    // console.log("Gallery Modal Status:", imageGalleryPopup);
  }, [imageGalleryPopup]);

  useEffect(() => {
    fetchTableData();
  }, []);

  async function fetchTableData() {
    setLoading(true);
    setTimeout(async () => {
      const URL = `${Url}/api/v1/productCategory/get`;

      try {
        const response = await fetch(URL);
        const users = await response.json();
        const reversedCategories = users.categories.reverse();
        const validParentCategories = reversedCategories.filter(
          (cat) => cat.name && cat.name.trim() !== ""
        );

        const parentCategories = validParentCategories.filter(
          (cat) => cat.parent === 0
        );

        const parentCatOptions = [
          { value: "", label: "Select a parent category" },
          ...validParentCategories.map((cat) => ({
            value: cat.uid,
            label: cat.name,
          })),
        ];

        const onlyParentCatOptions = [
          { value: "", label: "Select a parent category" },
          ...parentCategories.map((cat) => ({
            value: cat.uid,
            label: cat.name,
          })),
        ];

        setParentCatOpt(parentCatOptions);
        setParentOnlyOptions(onlyParentCatOptions);
        setData(reversedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  }

  const handleSearch = (value) => {
    setSearchTerm(value);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9&\-]/g, "");

      setCategoryData((prevState) => ({
        ...prevState,
        name: value,
        slug: generatedSlug,
        permalink: `/category/${generatedSlug}`,
      }));
    } else if (name === "slug") {
      const formattedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9&\-]/g, "");

      setCategoryData((prevState) => ({
        ...prevState,
        slug: formattedSlug,
        permalink: `/category/${formattedSlug}`,
      }));
    } else if (name in categoryData) {
      setCategoryData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      updateCategoryData && updateCategoryData(name, value);
    } else if (name === "keyPhrases") {
      const updatedKeyPhrases = value.split(",").map((phrase) => phrase.trim());
      setCategoryData((prevState) => ({
        ...prevState,
        keyPhrases: updatedKeyPhrases,
      }));
    }
  };

  const updateCategoryData = (newData) => {
    setCategoryData((prevState) => ({
      ...prevState,
      ...newData,
    }));
  };

  const handleKeyPhrasesChange = (keyPhrases) => {
    setCategoryData((prevState) => ({
      ...prevState,
      keyPhrases: keyPhrases,
    }));
  };

  const handleAddCate = async () => {
    try {
      if (isEditing) {
        await handleUpdateCategory(editingCategoryId);
      } else {
        await handleAddCategory(categoryData);
      }
    } catch (error) {
      handleFormError(error);
    } finally {
    }
  };

  const handleAddCategory = async (categoryData) => {
    const slugValue = categoryData.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    const permalinkValue = `/category/${slugValue}`;

    const formData = prepareFormData(categoryData, slugValue, permalinkValue);

    await submitCategory(formData);

    resetForm();
  };

  const handleUpdateCategory = async (editingCategoryId) => {
    try {
      if (!editingCategoryId) {
        alert("Cannot update the category: Missing category ID.");
        return;
      }

      const generateSlug = (name) => {
        return name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9&\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "");
      };

      const generatePermalink = (slug) => {
        const baseUrl = "/category/";
        return `${baseUrl}${slug}`;
      };

      const slugValueNew = generateSlug(categoryData.name);
      const permalinkNew = generatePermalink(slugValueNew);

      const formData = new FormData();

      const isParentCategory =
        categoryData.parentCategory === "Parent Category";

      formData.append("name", categoryData.name);
      formData.append("slug", slugValueNew);
      formData.append("permalink", permalinkNew);
      formData.append(
        "parent",
        isParentCategory ? "0" : categoryData.parentCategory || "0"
      );
      formData.append("description", categoryData.description);
      formData.append("menu_order", categoryData.menu_order);
      formData.append("metaTitle", categoryData.metaTitle);
      formData.append("metaDescription", categoryData.metaDescription);
      formData.append("canonicalUrl", categoryData.canonicalUrl);
      formData.append("ogTitle", categoryData.ogTitle);
      formData.append("ogDescription", categoryData.ogDescription);
      formData.append("xTitle", categoryData.xTitle);
      formData.append("xDescription", categoryData.xDescription);

      let metaKeywords = "";
      if (Array.isArray(categoryData.keyPhrases)) {
        metaKeywords = categoryData.keyPhrases.join(", ");
      }
      formData.append("metaKeywords", metaKeywords);

      if (categoryData.thumbnailImg || categoryData.thumbnailImg === "") {
        formData.append("image", categoryData.thumbnailImg || "");
      }

      if (categoryData.bannerImg || categoryData.bannerImg === "") {
        formData.append("bannerImage", categoryData.bannerImg || "");
      }

      if (categoryData.filterImg || categoryData.filterImg === "") {
        formData.append("filterImage", categoryData.filterImg || "");
      }

      if (categoryData.mobilethumbnail || categoryData.mobilethumbnail === "") {
        formData.append("image2", categoryData.mobilethumbnail || "");
      }

      if (categoryData.mobilebanner || categoryData.mobilebanner === "") {
        formData.append("bannerImage2", categoryData.mobilebanner || "");
      }

      if (categoryData.og_image || categoryData.og_image === "") {
        formData.append("og_image", categoryData.og_image || "");
      }

      if (categoryData.x_image || categoryData.x_image === "") {
        formData.append("x_image", categoryData.x_image || "");
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      let updateMessage = "Category updated successfully!";

      const response = await axios.put(
        `${Url}/api/v1/productCategory/${editingCategoryId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setToastMessage(updateMessage);
      setShowMessage(true);

      resetForm();
      setIsEditing(false);
    } catch (error) {
      handleFormError(error);
    }
  };

  const prepareFormData = (categoryData, slugValue, permalinkValue) => {
    const formData = new FormData();

    const isParentCategory = categoryData.parentCategory === "Parent Category";

    formData.append("name", categoryData.name);
    formData.append("slug", slugValue);
    formData.append("permalink", permalinkValue);
    formData.append(
      "parent",
      isParentCategory ? "0" : categoryData.parentCategory || "0"
    );
    formData.append("description", categoryData.description);
    formData.append("menu_order", categoryData.menu_order);
    formData.append("metaTitle", categoryData.metaTitle);
    formData.append("metaDescription", categoryData.metaDescription);
    formData.append("canonicalUrl", categoryData.canonicalUrl);
    formData.append("ogTitle", categoryData.ogTitle);
    formData.append("ogDescription", categoryData.ogDescription);
    formData.append("xTitle", categoryData.xTitle);
    formData.append("xDescription", categoryData.xDescription);

    let metaKeywords = Array.isArray(categoryData.keyPhrases)
      ? categoryData.keyPhrases.join(", ")
      : "";
    formData.append("metaKeywords", metaKeywords);

    // Append optional images
    const optionalFields = [
      { key: "thumbnailImg", formKey: "image" },
      { key: "bannerImg", formKey: "bannerImage" },
      { key: "filterImg", formKey: "filterImage" },
      { key: "mobilethumbnail", formKey: "image2" },
      { key: "mobilebanner", formKey: "bannerImage2" },
      { key: "og_image", formKey: "og_image" },
      { key: "x_image", formKey: "x_image" },
    ];

    optionalFields.forEach(({ key, formKey }) => {
      if (categoryData[key]) {
        formData.append(formKey, categoryData[key]);
      }
    });

    // console.log("FormData after preparation:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    return formData;
  };

  const submitCategory = async (formData) => {
    try {
      let successMessage = "Category submitted successfully!";
      const response = await axios.post(
        `${Url}/api/v1/productCategory/add`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setToastMessage(successMessage);
      setShowMessage(true);
    } catch (error) {
      console.error("Form submission error:", error);
      setToastMessage(error.response?.data?.message || "An error occurred. Please try again.");
      setShowMessage(true);
      throw error;
    }
  };

  const handleFormError = (error) => {
    if (error.response) {
      console.error("Error submitting form:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      alert(
        `Error: ${error.response.data.message || "An error occurred. Please try again."
        }`
      );
    } else if (error.request) {
      console.error("Error: No response received:", error.request);
      alert(
        "Error: No response from server. Please check your connection and try again."
      );
    } else {
      console.error("Error:", error.message);
      alert("Error: " + error.message);
    }
  };

  const resetForm = () => {
    setCategoryData({
      name: "",
      slug: "",
      parentCategory: "",
      description: "",
      menu_order: "",
      permalink: "",
      permalink: "",
      thumbnailImg: "",
      bannerImg: "",
      filterImg: "",
      mobilethumbnail: "",
      mobilebanner: "",
      metaTitle: "",
      metaDescription: "",
      keyPhrases: [],
      metaKeywords: "",
      canonicalUrl: "",
      robots: "",
      ogTitle: "",
      ogDescription: "",
      og_image: "",
      xTitle: "",
      xDescription: "",
      x_image: "",
      schemaMarkup: {},
    });
    setAccordions([
      {
        keyPhrase: "",
        isAccordionOpen: false,
      },
    ]);
    setIsEditing(false);
    setEditingCategoryId(null);
    setImagePreview(null);
    setThumbnailImage(null);
    setFilterImage(null);
    setMobileImagePreview(null);
    setMobileThumbnailImage(null);
    setSelectedImage(null);
    setSelectedXImage(null);
    fetchTableData();
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
      case "delete":
        confirmDelete(row);
        setOpenDropdownId(null);
        break;
      case "quickEdit":
        handleEdit(row);
        setOpenDropdownId(null);
        break;
      case "duplicate":
        confirmDuplicate(row);
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
      width: "50px",
    },
    {
      name: "Image",
      cell: (row) =>
        loading ? (
          <ShimmerLoader width="100px" height="50px" />
        ) : (
          <img
            src={row.image ? `${Url + row.image}` : defaultImage}
            alt={row.name}
            width="auto"
            height="40px"
            style={{ objectFit: "cover" }}
          />
        ),
      width: "110px",
    },
    {
      name: "Name",
      selector: (row) => (loading ? <ShimmerLoader width="150px" height="22.5px" borderRadius="20px" /> : row.name),
      width: "220px",
    },
    {
      name: "Count",
      selector: (row) =>
        loading ? <ShimmerLoader width="50px" height="22.5px" borderRadius="20px" /> : row.uid,
      width: "80px",
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
                </ul>
              </div>
            )}
          </div>
        ),
      width: "85px",
    },
  ];

  const handleEdit = (row) => {

    setIsEditing(true);
    setEditingCategoryId(row?._id || "");

    const isParentCategory = row?.parent === 0;

    const parentCategoryOption = parentCatOpt.find(
      (opt) => opt.value === row?.parent
    );

    setCategoryData({
      name: row?.name || "",
      slug: row?.slug || "",
      menu_order: row?.menu_order || "",
      parentCategory: isParentCategory
        ? "Parent Category"
        : parentCategoryOption
          ? parentCategoryOption.label
          : "Select a parent category",
      description: row?.description || "",
      permalink: row?.permalink || "",
      canonicalUrl: row?.meta?.canonical_url || "",
      metaDescription: row?.meta?.description || "",
      metaKeywords: row?.meta?.keywords || "",
      ogDescription: row?.meta?.og_description || "",
      og_image: row?.meta?.og_image || "",
      ogTitle: row?.meta?.og_title || "",
      metaTitle: row?.meta?.title || "",
      xDescription: row?.meta?.x_description || "",
      x_image: row?.meta?.x_image || "",
      xTitle: row?.meta?.x_title || "",
    });

    // Set the preview images based on the data
    const thumbnailPreview = row?.image ? `${row.image}` : "";
    const bannerPreview = row?.bannerImage ? `${row.bannerImage}` : "";
    const filterPreview = row?.filterImage ? `${row.filterImage}` : "";
    const mobilethumbnailPreview = row?.image2 ? `${row.image2}` : "";
    const mobileimagePreview = row?.bannerImage2 ? `${row.bannerImage2}` : "";
    const ogImagePreview = row?.meta?.og_image ? `${row.meta.og_image}` : "";
    const xImagePreview = row?.meta?.x_image ? `${row.meta.x_image}` : "";

    // Set the state for preview images
    setThumbnailImage(thumbnailPreview);
    setFilterImage(filterPreview);
    setImagePreview(bannerPreview);
    setMobileThumbnailImage(mobilethumbnailPreview);
    setMobileImagePreview(mobileimagePreview);
    setSelectedImage(ogImagePreview);
    setSelectedXImage(xImagePreview);

    if (isParentCategory) {
      // console.log("The selected category is a parent category.");
    }
  };

  const handleParentCat = (selectedValue) => {
    setCategoryData((prevState) => ({
      ...prevState,
      parentCategory: selectedValue,
    }));
  };

  /* --- Category Delete Functions --- */
  const confirmDelete = (row) => {
    setCurrentRowId(row._id);
    setShowConfirm(true);
  };

  const confirmSelectedDuplicate = () => {
    setShowDuplicateConfirm(true);
    setSelectedDuplicate(true);
  };

  const confirmDuplicate = (row) => {
    setCurrentRowId(row.uid);
    setShowDuplicateConfirm(true);
  };

  const handleDelete = () => {
    if (currentRowId) {
      deleteItem(currentRowId);
    }
  };

  const handleDuplicate = () => {
    if (currentRowId) {
      duplicateItem(currentRowId);
    }
  };

  const deleteItem = async (id) => {
    setIsLoading(true);
    setIsActive(true);

    try {
      let failureMessage = "Category deleted successfully!";

      const response = await fetch(`${Url}/api/v1/productCategory/${id}`, {
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

  const duplicateItem = async (id = null) => {
    setIsLoading(true);
    setIsActive(true);

    const itemsToDuplicate = id ? [id] : selectedRows;

    if (itemsToDuplicate.length === 0) {
      let errorMessage = "No items selected for duplication.";
      setToastMessage(errorMessage);
      setShowMessage(true);
      setIsLoading(false);
      setIsActive(false);
      return;
    }

    try {
      const response = await axios.post(
        `${Url}/api/v1/productCategory/duplicate`,
        {
          uids: itemsToDuplicate,
        }
      );

      setShowDuplicateConfirm(false);

      if (response.status === 200 || response.status === 201) {
        let duplicateMessage = "Selected items duplicated successfully!";
        setToastMessage(duplicateMessage);
        setShowMessage(true);
        setSelectedRows([]);
      }
    } catch (error) {
      let errorMessage = "Failed to duplicate items.";
      console.error("Error duplicating items:", error);
      setToastMessage(errorMessage);
      setShowMessage(true);
    } finally {
      setSelectedDuplicate(false);
      fetchTableData();
      setTimeout(() => {
        setIsLoading(false);
        setIsActive(false);
      }, 5000);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const cancelDuplicate = () => {
    setShowDuplicateConfirm(false);
  };

  const cancelThumbnailImage = () => {
    setThumbnailImage("");
    setCategoryData((prevData) => ({
      ...prevData,
      thumbnailImg: "",
    }));
  };

  const cancelFilterImage = () => {
    setFilterImage("");
    setCategoryData((prevData) => ({
      ...prevData,
      filterImg: "",
    }));
  };

  const cancelBannerImage = () => {
    setImagePreview("");
    setCategoryData((prevData) => ({
      ...prevData,
      bannerImg: "",
    }));
  };

  const cancelMobileBannerImage = () => {
    setMobileImagePreview("");
    setCategoryData((prevData) => ({
      ...prevData,
      mobilebanner: "",
    }));
  };

  const cancelMobileThumbnailImage = () => {
    setMobileThumbnailImage("");
    setCategoryData((prevData) => ({
      ...prevData,
      mobilethumbnail: "",
    }));
  };

  const cancelSocialImage = () => {
    setSelectedImage("");
    setCategoryData((prevData) => ({
      ...prevData,
      og_image: "",
    }));
  };

  const cancelXImage = () => {
    setSelectedXImage("");
    setCategoryData((prevData) => ({
      ...prevData,
      x_image: "",
    }));
  };

  const handleCancelEdit = () => {
    setCategoryData({
      name: "",
      slug: "",
      parentCategory: "",
      description: "",
      displayType: 1,
      menu_order: "",
      permalink: "",
      thumbnailImg: "",
      bannerImg: "",
      filterImg: "",
      mobilethumbnail: "",
      mobilebanner: "",
      metaTitle: "",
      metaDescription: "",
      keyPhrases: [],
      metaKeywords: "",
      canonicalUrl: "",
      robots: "",
      ogTitle: "",
      ogDescription: "",
      og_image: "",
      xTitle: "",
      xDescription: "",
      x_image: "",
      schemaMarkup: {},
    });
    setSelectedImage(null);
    setSelectedXImage(null);
    setImagePreview("");
    setThumbnailImage("");
    setFilterImage("");
    setMobileImagePreview("");
    setMobileThumbnailImage("");
    setAccordions([
      {
        keyPhrase: "",
        isAccordionOpen: false,
      },
    ]);
    setIsEditing(false);
  };

  /* --- Add Product Right Side Accordions --- */
  const accordionItems = [
    {
      title: "Add New Category",
      content: (
        <>
          <div>
            <div className="form-row">
              <label htmlFor="name">
                Name<span className="superscript">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Category Name"
                value={categoryData.name}
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
                value={categoryData.slug}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="menu_order">
                Menu Order<span className="superscript">*</span>
              </label>
              <input
                type="number"
                id="menu_order"
                name="menu_order"
                placeholder="Menu Order"
                value={categoryData.menu_order}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="parentCategory">
                Parent Category<span className="superscript">*</span>
              </label>
              <div className="custom-dropdown-wrapper">
                <CustomDropdown
                  options={parentOnlyOptions}
                  selectedOption={categoryData.parentCategory || ""}
                  handleOptionChange={handleParentCat}
                  dropdownWidth="100%"
                  dropdownMarginBottom="10px"
                  backgroundColor="var(--third-layer-bg)"
                  optionsWidth="100%"
                  optionsBackgroundColor="var(--third-layer-bg)"
                  dropdownSelectedStyle="7px"
                />
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Product Description Here"
                value={categoryData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Category Images",
      content: (
        <>
          <div className="form-row">
            <label htmlFor="thumbnailImage">Thumbnail Image</label>
            <div className="banner-upload">
              {thumbnailimage ? (
                <div className="image-preview-wrapper">
                  <img
                    src={
                      isEditing
                        ? `${Url + thumbnailimage}`
                        : `${Url + thumbnailimage}`
                    }
                    alt="Thumbnail"
                    className="image-preview"
                  />
                  <button
                    onClick={cancelThumbnailImage}
                    className="cancel-button"
                  >
                    X
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="thumbnailImage"
                  className="upload-label"
                  onClick={() => handleGalleryModalOpen("thumbnailImage")}
                >
                  <div className="Catupload-button">
                    <IoImageOutline
                      size={45}
                      color="#555"
                      className="uploaded-image"
                    />
                  </div>
                  <span className="upload-text">Click to Upload Image</span>
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
          </div>

          <div className="form-row">
            <label htmlFor="bannerImage">Banner Image</label>
            <div className="banner-upload">
              {imagePreview ? (
                <div className="image-preview-wrapper">
                  <img
                    src={
                      isEditing
                        ? `${Url + imagePreview}`
                        : `${Url + imagePreview}`
                    }
                    alt="Banner"
                    className="image-preview"
                  />
                  <button onClick={cancelBannerImage} className="cancel-button">
                    X
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="bannerImage"
                  className="upload-label"
                  onClick={() => handleGalleryModalOpen("bannerImage")}
                >
                  <div className="Catupload-button">
                    <IoImageOutline
                      size={45}
                      color="#555"
                      className="uploaded-image"
                    />
                  </div>
                  <span className="upload-text">Click to Upload Image</span>
                </label>
              )}
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="mobilethumbnailImage">Mobile Thumbnail Image</label>
            <div className="banner-upload">
              {mobilethumbnailimage ? (
                <div className="image-preview-wrapper">
                  <img
                    src={
                      isEditing
                        ? `${Url + mobilethumbnailimage}`
                        : `${Url + mobilethumbnailimage}`
                    }
                    alt="Mobile-Thumbnail"
                    className="image-preview"
                  />
                  <button
                    onClick={cancelMobileThumbnailImage}
                    className="cancel-button"
                  >
                    X
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="mobilethumbnailImage"
                  className="upload-label"
                  onClick={() => handleGalleryModalOpen("mobilethumbnailImage")}
                >
                  <div className="Catupload-button">
                    <IoImageOutline
                      size={45}
                      color="#555"
                      className="uploaded-image"
                    />
                  </div>
                  <span className="upload-text">Click to Upload Image</span>
                </label>
              )}
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="mobilebannerImage">Mobile Banner Image</label>
            <div className="banner-upload">
              {mobileimagePreview ? (
                <div className="image-preview-wrapper">
                  <img
                    src={
                      isEditing
                        ? `${Url + mobileimagePreview}`
                        : `${Url + mobileimagePreview}`
                    }
                    alt="Mobile-Banner"
                    className="image-preview"
                  />
                  <button
                    onClick={cancelMobileBannerImage}
                    className="cancel-button"
                  >
                    X
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="mobilebannerImage"
                  className="upload-label"
                  onClick={() => handleGalleryModalOpen("mobilebannerImage")}
                >
                  <div className="Catupload-button">
                    <IoImageOutline
                      size={45}
                      color="#555"
                      className="uploaded-image"
                    />
                  </div>
                  <span className="upload-text">Click to Upload Image</span>
                </label>
              )}
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="filterImage">Filter Image</label>
            <div className="banner-upload">
              {filterimage ? (
                <div className="image-preview-wrapper">
                  <img
                    src={
                      isEditing
                        ? `${Url + filterimage}`
                        : `${Url + filterimage}`
                    }
                    alt="Filter"
                    className="image-preview"
                  />
                  <button
                    onClick={cancelFilterImage}
                    className="cancel-button"
                  >
                    X
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="filterImage"
                  className="upload-label"
                  onClick={() => handleGalleryModalOpen("filterImage")}
                >
                  <div className="Catupload-button">
                    <IoImageOutline
                      size={45}
                      color="#555"
                      className="uploaded-image"
                    />
                  </div>
                  <span className="upload-text">Click to Upload Image</span>
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
          </div>
        </>
      ),
    },
    {
      title: "SEO",
      content: (
        <div className="form-row">
          <TabBarView
            handleInputChange={handleInputChange}
            updateCategoryData={updateCategoryData}
            onKeyPhrasesChange={handleKeyPhrasesChange}
            metaData={categoryData}
            // categoryData={categoryData}
            handleGalleryModalOpen={handleGalleryModalOpen}
            handleImageSelect={handleImageSelect}
            cancelSocialImage={cancelSocialImage}
            cancelXImage={cancelXImage}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            selectedXImage={selectedXImage}
            setSelectedXImage={setSelectedXImage}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            accordions={accordions}
            setAccordions={setAccordions}
          />
        </div>
      ),
    },
  ];

  /* --- Function to Handle Display of Confirmation Dialogue Box of Delete Action --- */
  const handleDeleteClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      cancelDelete();
      cancelSelectedDelete();
      cancelDuplicate();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDeleteClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleDeleteClickOutside);
    };
  }, []);

  const confirmSelectedDelete = () => {
    setShowAllConfirm(true);
  };

  const cancelSelectedDelete = () => {
    setShowAllConfirm(false);
  };

  const handleSelectedDelete = async () => {
    if (selectedRows.length === 0) {
      let errorMessage = "No rows selected.";
      setToastMessage(errorMessage);
      setShowMessage(true);
      return;
    }

    setIsLoading(true);
    setIsActive(true);

    const payload = { uids: selectedRows };

    try {
      const response = await axios.post(
        `${Url}/api/v1/productCategory/delete-bulk`,
        payload
      );

      if (response.status === 200) {
        let deleteMessage = "Selected rows deleted successfully!";
        setToastMessage(deleteMessage);
        setShowMessage(true);
        setSelectedRows([]);
        fetchTableData();
      }
    } catch (error) {
      let errorMessage = "Failed to delete selected rows.";
      console.error("Error deleting selected rows:", error);
      setToastMessage(errorMessage);
      setShowMessage(true);
    } finally {
      setShowAllConfirm(false);
      setTimeout(() => {
        setIsLoading(false);
        setIsActive(false);
      }, 5000);
    }
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* --- Calculate Total Pages for Category Table --- */
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  /* --- Function to Handle Slice Data for Current Page of Category Table --- */
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  /* --- Function to Handle Page Change of Category Table --- */
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  /* --- Function to Handle Navigation on Previous Page of Category Table --- */
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  /* --- Function to Handle Navigation on Next Page of Category Table --- */
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const placeholderRows = Array(7).fill({ uid: "", name: "", image: "" });

  const displayedData = loading ? placeholderRows : paginatedData;

  return (
    <div className="ProductCatPage">
      <div className="CatSection-01">
        <span className="Section1-Leftside">Categories</span>
        <div className="Section1-Rightside-Updated">
          <div className="SearchBar-Alignment">
            <SearchBar
              onSearch={handleSearch}
              icon={searchIcon}
              placeholder="Search Category by Name"
            />
          </div>
          {selectedRows.length > 0 && (
            <div className="SelectionBtn-Row">
              <>
                <CustomBtn
                  label="Duplicate"
                  className="SelectedDuplicateBtn"
                  onClick={confirmSelectedDuplicate}
                  type="button"
                />
                <CustomBtn
                  label="Delete"
                  className="SelectedDeleteBtn"
                  onClick={confirmSelectedDelete}
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

        <div className="CatSection2-Leftside">
          <div className="CatSection2-Leftside-AccordionSection">
            {/* {loading && (
              <div className="backdrop">
                <MainLoader />
              </div>
            )} */}

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  title={item.title}
                  content={item.content}
                  defaultOpen={index === 0}
                  Gap="3px"
                  maxHeight="2000px"
                  containerWidth="100%"
                />
              ))}

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
                  label={isEditing ? "Update" : "Add Category"}
                  className="AddCatBtn"
                  onClick={handleAddCate}
                  type="button"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="Section2-Rightside">
          <div className="Category-Data">
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
              Are you sure you want to delete this category? <br />
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

      {/* --- (PopUp) To Handle Confiramtion for Delete Operation of Selected Categories --- */}
      {showAllConfirm && (
        <div className="confirmation-modal">
          <div className="Cat-modal-content" ref={modalRef}>
            <CiWarning className="warning-icon" />
            <div className="Delete-Heading">Warning</div>
            <div className="Delete-Content">
              Are you sure you want to delete all selected categories? <br />
              This action cannot be undone.
            </div>
            <div className="separator-line"></div>
            <div className="modal-actions">
              <button
                className="Cat-Delete-btn btn-secondary"
                onClick={cancelSelectedDelete}
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
                  onClick={handleSelectedDelete}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- (PopUp) To Handle Confiramtion for Duplicate Operation of Single Category --- */}
      {showDuplicateConfirm && (
        <div className="confirmation-modal">
          <div className="Cat-modal-content" ref={modalRef}>
            <GoDuplicate className="duplicate-icon" />
            <div className="Delete-Heading">Duplicate ?</div>
            <div className="Delete-Content">
              Are you sure you want to duplicate this category? <br />A copy
              will be created with the same details with different name, which
              you can edit later.
            </div>
            <div className="separator-line"></div>
            <div className="modal-actions">
              <button
                className="Cat-Delete-btn btn-secondary"
                onClick={cancelDuplicate}
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
                  onClick={() =>
                    selectedDuplicate ? duplicateItem() : handleDuplicate()
                  }
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

export default ProductsCat;
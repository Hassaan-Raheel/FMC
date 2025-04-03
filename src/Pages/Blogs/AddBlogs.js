import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "../ECommerce/ECommerce.css";
import "./Blogs.css";
import "../Page.css";
import AccordionItem from "../../Components/UI-Controls/Accordian/Accordian";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import Logo from "../../../src/Assets/Images/Logo 29.44 X 5.12.png";
import Selector from "../../../src/Assets/Images/Selector 20 X 20.png";
import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";
import SearchMultiple from "../../Components/UI-Controls/MultiSelect/BlogTagSelect";
import JoditEditor from "jodit-react";
import "../../../src/JoditEditorStyle.css";
import { Url } from "../../Services/Api";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import { useLocation, useNavigate } from "react-router-dom";
import { PiNotePencil } from "react-icons/pi";
import imageStatus from "../../../src/Assets/Images/StatusImg 20 x 20.png";
import imageVisibility from "../../../src/Assets/Images/Visibility 20 x 20.png";
import imagePublish from "../../../src/Assets/Images/Publish 20 x 20.png";
import { IoImageOutline } from "react-icons/io5";
import ImageGalleryPopup from "../../Components/UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup";
import { uploadImage } from "../../Services/functions";
import BottomToust from "../../Components/BottomToust/BottomToust";

const AddBlogs = () => {
  const [blogsCategories, setBlogsCategories] = useState([]);
  const [accordionsOpen, setAccordionsOpen] = useState({});
  const [selectedView, setSelectedView] = useState("Web");
  const [isMobileAnimating, setIsMobileAnimating] = useState(false);
  const [isWebAnimating, setIsWebAnimating] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [blogsTag, setBlogsTag] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    author: "",
    content: "",
    selectedCategory: "",
    blogsTag: [],
    status: "draft",
  });
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Visual");
  const [isLoading, setIsLoading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEdit, setIsEdit] = useState([]);
  const [isView, setIsView] = useState([]);
  const [isEditID, setIsEditID] = useState(null);
  const [blogImage, setBlogImage] = useState(null);
  const [productStatus, setProductStatus] = useState("");
  const [productVisibility, setProductVisibility] = useState("");
  const [productPublishedStatus, setPublishedStatus] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [submissionActive, setSubmissionActive] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);

  /* Handling of Blog Image */
  const [modalView, setModalView] = useState(false);
  const [modaldata, setModalData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedStatus, setUploadedStates] = useState(null);
  const [imageType, setImageType] = useState("");
  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: "",
    title: "",
    description: "",
    link_url: "",
  });
  const editor = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { blog_Data, view_Data } = location.state || {};

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

  const handleGalleryModalOpen = (clickType) => {
    setModalView(true);
    setImageType(clickType);
  };

  const handleGalleryModalClose = () => {
    setModalView(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const api = `${Url}/api/v1/media/blogs/add`;

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

  const handleImageSelect = (image, attributeIndex, optionIndex) => {
    if (imageType === "blog-image") {
      setBlogImage(image);
    } else {
    }

    setModalView(false);
  };

  const getApi = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/blogs/get`);
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

  const cancelBlogImage = () => {
    setBlogImage(null);
  };

  const resetForm = () => {
    setSelectedTags([]);
    setBlogImage(null);
    setIsEditID(null);
    setIsViewMode(false);
    setIsEditMode(false);
    setProductStatus("");
    setProductVisibility("");
    setPublishedStatus("");
    setFormData({
      title: "",
      slug: "",
      author: "",
      content: "",
      selectedCategory: "",
      blogsTag: [],
      status: "draft",
    });
  };

  const handleDropdownStateChange = (isOpen, height) => {
    setIsDropdownOpen(isOpen);
    setDropdownHeight(height);
  };

  const fetchBlogsCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${Url}/api/v1/blog-categories/get`);
      const data = await response.json();

      if (!data || !data.categories) {
        console.error("No categories found in the response data");
        return;
      }

      const categories = data.categories.map((category) => ({
        _id: category._id,
        name: category.name,
      }));

      setBlogsCategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Url}/api/v1/blog-tags/get`);
        const data = response.data.tags;

        const formattedTags = data.map((tag) => ({
          name: tag.name,
        }));

        setBlogsTag(formattedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
    fetchBlogsCategories();
  }, []);

  const handleTagSelect = (tagName) => {
    setSelectedTags((prevTags) => {
      const isAlreadySelected = prevTags.some((tag) => tag.name === tagName);

      let updatedTags;
      if (isAlreadySelected) {
        updatedTags = prevTags.filter((tag) => tag.name !== tagName);
      } else {
        updatedTags = [...prevTags, { name: tagName }]; 
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        blogsTag: updatedTags.map((tag) => tag.name),
      }));

      return updatedTags;
    });
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prevData) => {
      const isSelected = prevData.selectedCategory === categoryId;

      return {
        ...prevData,
        selectedCategory: isSelected ? "" : categoryId,
        selectedCategoryDetails: isSelected
          ? null
          : blogsCategories.find((cat) => cat._id === categoryId),
      };
    });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Published Yet";
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const isEditMode = currentPath.includes("Edit");
    const isViewMode = currentPath.includes("View");
    const data = isEditMode ? blog_Data : isViewMode ? view_Data : null;

    if (data) {
      const status = capitalizeFirstLetter(data.status || "Select Product");
      const visibility = data.status === "draft" ? "Private" : "Public";
      const publishedDate = data.status === "draft" ? "Not Published Yet" : formatDate(data.updatedAt);

      setProductStatus(status);
      setProductVisibility(visibility);
      setPublishedStatus(publishedDate);

      if (isEditMode) {
        handleEditOperation(data);
        setIsEditMode(true);
        setIsViewMode(false);
      } else {
        handleViewOperation(data);
        setIsViewMode(true);
        setIsEditMode(false);
      }
    } else {
      resetForm();
      setIsViewMode(false);
      setIsEditMode(false);
    }
  }, [blog_Data, view_Data, location.pathname]);

  const handleEditOperation = useCallback((data) => {
    try {
      setIsEdit(data);
      setIsEditID(data._id);

      const formattedTags = data.tags?.map((tag) => ({ name: tag })) || [];

      setFormData((prev) => ({
        ...prev,
        title: data.title || "",
        slug: data.slug || "",
        author: data.author || "",
        content: data.content || "",
        selectedCategory: data.category?._id || "",
        blogsTag: data.tags || [],
        status: data.status || "draft",
      }));

      setSelectedTags(formattedTags);
      setBlogImage(data.image);
    } catch (error) {
      console.error("Error in edit operation:", error);
    }
  }, []);

  const handleViewOperation = useCallback((data) => {
    try {
      setIsView(data);

      const formattedTags = data.tags?.map((tag) => ({ name: tag })) || [];

      setFormData((prev) => ({
        ...prev,
        title: data.title || "",
        slug: data.slug || "",
        author: data.author || "",
        content: data.content || "",
        selectedCategory: data.category?._id || "",
        blogsTag: data.tags || [],
        status: data.status || "draft",
      }));

      setSelectedTags(formattedTags);
      setBlogImage(data.image);
    } catch (error) {
      console.error("Error in edit operation:", error);
    }
  }, []);

  const handleEditNavigation = () => {
    navigate(`/Blogs/Edit-Blog/${view_Data._id}`, {
      state: { blog_Data: view_Data },
    });
  };

  const toggleAccordion = (index) => {
    setAccordionsOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-&]/g, "");
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked, id } = event.target;

    setFormData((prevState) => {
      const updatedState = {
        ...prevState,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      };

      if (name === "title") {
        updatedState.slug = generateSlug(value);
      }

      return updatedState;
    });

    if (id === "blogImage") {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBlogImage(reader.result);
        };
        reader.readAsDataURL(file);
        uploadImageToBackend([file], id);
      }
    }
  };

  const uploadImageToBackend = async (files, imageType) => {
    const formData = new FormData();

    if (imageType === "blogImage") {
      formData.append("image", files[0]);
    }

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error(`Error uploading ${imageType}:`, error);
    }
  };

  const handleBlogSubmit = async (status) => {
    setLoadingButton(status);
    setIsLoading(true);
    setSubmissionActive(true);

    const blogPayload = {
      title: formData.title,
      slug: formData.slug,
      author: formData.author,
      content: formData.content,
      category: formData.selectedCategory,
      tags: formData.blogsTag,
      image: blogImage,
      status,
    };

    try {
      let response;
      let message = isEditMode ? "Blog updated successfully!" : "Blog submitted successfully!";

      if (isEditMode) {
        response = await axios.put(`${Url}/api/v1/blogs/edit/${isEditID}`, blogPayload);
      } else {
        response = await axios.post(`${Url}/api/v1/blogs/add`, blogPayload);
      }

      setToastMessage(message);
      setShowMessage(true);
      resetForm();

      setTimeout(() => {
        navigate("/Blogs/All-Blogs");
      }, 2000);

    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "submitting"} blog:`, error);
      setToastMessage("Failed to save or update Blog. Please try again.");
      setShowMessage(true);
    } finally {
      setIsLoading(false);
      setSubmissionActive(false);
      setLoadingButton(null);
    }
  };
  
  const handleChange = (view) => {
    if (view === "Mobile") {
      setIsMobileAnimating(true);
      setTimeout(() => setIsMobileAnimating(false), 300);
    } else if (view === "Web") {
      setIsWebAnimating(true);
      setTimeout(() => setIsWebAnimating(false), 300);
    }
    setSelectedView(view);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditMode(false);
    setIsViewMode(false);
    navigate("/Blogs/All-Blogs");
  };

  const accordionItems = [
    {
      title: "Status",
      content: (
        <div className="Blogs-PublishContainer">
          <div className="Blogs-StartContainer">
            <div>
              {!isViewMode && (
                <CustomBtn
                  label={
                    loadingButton === "published" ? (
                      <div className="btn-loader-Publish"></div>
                    ) : isEditMode ? (
                      "Save Draft"
                    ) : (
                      "Published"
                    )
                  }
                  withIcon={false}
                  disabled={loadingButton === "published"}
                  className={` ${isEditMode ? "DraftBtn" : "Blogs-PublishBtn"} ${loadingButton === "draft" ? "active" : ""}`}
                  onClick={() => handleBlogSubmit(isEditMode ? "draft" : "published")}
                  type="button"
                />
              )}
            </div>
          </div>
          <div className="Blogs-MidContainer">
            <div className="MidRowsData">
              <div className="RowContent">
                <img
                  src={imageStatus}
                  alt="Description"
                  className="ImageStyle"
                />
                <span className="TextStyle1">Status:</span>
                <span className="TextStyle2">{(isEditMode || isViewMode) ? productStatus : "Pending"}</span>
              </div>
              <div>
                <PiNotePencil className="NoteIcon" />
              </div>
            </div>
            <div className="MidRowsData">
              <div className="RowContent">
                <img
                  src={imageVisibility}
                  alt="Description"
                  className="ImageStyle"
                />
                <span className="TextStyle1">Visibility:</span>
                <span className="TextStyle2">{(isEditMode || isViewMode) ? productVisibility : "Private"}</span>
              </div>
              <div>
                <PiNotePencil className="NoteIcon" />
              </div>
            </div>
            <div className="MidRowsData">
              <div className="RowContent">
                <img
                  src={imagePublish}
                  alt="Description"
                  className="ImageStyle"
                />
                <span className="TextStyle1">Publish Date:</span>
                <span className="TextStyle2">{(isEditMode || isViewMode) ? productPublishedStatus : "12/31/2024"}</span>
              </div>
              <div>
                <PiNotePencil className="NoteIcon" />
              </div>
            </div>
          </div>
          <div className="Blogs-EndContainer">
            <div>
              {isViewMode ? (
                <div>
                  <CustomBtn
                    label="Edit Blog"
                    withIcon={false}
                    disabled={false}
                    className="ProductEditBtn"
                    onClick={() => handleEditNavigation()}
                    type="button"
                  />
                </div>
              ) : (
                <div>
                  <CustomBtn
                    label={
                      loadingButton === "draft" ? (
                        <div className="btn-loader-Draft"></div>
                      ) : isEditMode ? (
                        "Published"
                      ) : (
                        "Save Draft"
                      )
                    }
                    withIcon={false}
                    disabled={loadingButton === "draft"}
                    className={` ${isEditMode ? "ProductUpdateBtn" : "DraftBtn"} ${loadingButton === "published" ? "active1" : ""}`}
                    onClick={() => handleBlogSubmit(isEditMode ? "published" : "draft")}
                    type="button"
                  />
                </div>
              )}
            </div>

            <div>
              {!isEditMode && !isViewMode ? (
                <CustomBtn
                  label="Archive"
                  withIcon={false}
                  disabled={false}
                  className="PreviewBtn"
                  type="button"
                />
              ) : (
                <CustomBtn
                  label={isViewMode ? "Cancel View" : "Cancel Edit"}
                  withIcon={false}
                  disabled={false}
                  className={isViewMode ? "CancelBtn-1" : "CancelBtn"}
                  onClick={handleCancel}
                  type="button"
                />
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Blog Image",
      content: (
        <div className="banner-upload">
          {blogImage ? (
            <div className="image-preview-wrapper">
              <img
                src={`${Url + blogImage.image_url}`}
                alt="Thumbnail"
                className="dimensional-image-preview"
              />
              {!isViewMode && (
                <button onClick={cancelBlogImage} className="cancel-button">
                  X
                </button>
              )}
            </div>
          ) : (
            <label
              htmlFor="blogImage"
              className="uploadAdd-label"
              onClick={() => handleGalleryModalOpen("blog-image")}
            >
              <div className="Addupload-button">
                <IoImageOutline
                  size={45}
                  color="#555"
                  className="uploaded-image"
                />
                <span className="uploadAdd-text">Click to Upload Image</span>
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
      ),
    },
    {
      title: "Select Categories",
      content: (
        <div className="category-list">
          {blogsCategories &&
            blogsCategories.map((category) => (
              <div
                key={category._id}
                className="main-category"
                style={{ marginBottom: "10px" }}
              >
                <div className="category-item-heading">
                  <label className={`checkbox-wrapper ${isViewMode && formData.deal_of_month === 1 ? "viewmode-checked" : ""}`}>
                    <input
                      type="checkbox"
                      disabled={isViewMode}
                      checked={formData.selectedCategory === category._id}
                      onChange={() => handleCategorySelect(category._id)}
                    />
                    <span className="custom-checkbox"></span>
                    <span>{category.name}</span>
                  </label>
                </div>
              </div>
            ))}
        </div>
      ),
    },
    {
      title: "Select Tags",
      content: (
        <div
          style={{
            fontFamily: "var(--font-family)",
            fontSize: "var(--font-size-small)",
            height: isDropdownOpen
              ? `${dropdownHeight + 50}px`
              : "auto", // Default height
            transition: "height 0.3s ease",
            overflow: "auto",
          }}
        >
          <div className="GeneralFields-Data">
            <div className="GeneralFields-Data-Tag">
              <SearchMultiple
                name="multiSelect"
                placeholder="Search & Select Tags..."
                options={blogsTag.map((tag) => tag.name)}
                onSelect={(option) => handleTagSelect(option)}
                selectedItems={selectedTags.map((tag) => tag.name)}
                width="100%"
                suggestionListWidth="100%"
                onDropdownStateChange={handleDropdownStateChange}
                isViewMode={isViewMode}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const configEditor = {
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "paragraph",
      "fontsize",
      "lineHeight",
      "|",
      "ul",
      "ol",
      "|",
      "link",
      "image",
      "|",
      "align",
      "undo",
      "redo",
    ],
    style: {
      fontFamily: "var(--font-family)",
      fontSize: "var(--font-size-small)",
      lineHeight: "1.6",
      color: "var(--text-color-1)",
      height: "200px",
    },
    toolbarAdaptive: false,
    toolbarSticky: false,
  };

  const handleEditorChange = (newContent) => {
    setFormData((prevState) => ({
      ...prevState,
      content: newContent,
    }));
  };

  return (
    <div className="AddProductPage">

      {loading && (
        <div className="backdrop">
          <div className="loader-container">
            <MainLoader />
          </div>
        </div>
      )}

      <div className="PageLeftSide">
        <div className="BlogsDescription">
          <div className="Blog-Container1-Row-1">
            <div style={{ width: "63.5%" }}>
              <label htmlFor="ProductName" className="DescriptionLabels">
                Title
              </label>
              <textarea
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="Blog-Title-Input"
                placeholder="Cypress Bedroom Set in Gray"
                disabled={isViewMode}
              />
            </div>
            <div style={{ width: "34%" }}>
              <label htmlFor="ProductName" className="DescriptionLabels">
                Author
              </label>
              <textarea
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="Blog-Title-Input"
                placeholder="John Doe"
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="Blog-Container1-Row-2">
            <label htmlFor="editor" className="BlogContent-Heading">
              Blog Description
            </label>
            <div className="Blogs-Editor-Container">
              <div className="Blogs-Editor-Tabs">
                <div
                  className={`Tab ${selectedTab === "Visual" ? "active" : ""}`}
                  onClick={() => setSelectedTab("Visual")}
                >
                  Visual
                </div>
                <div
                  className={`Tab ${selectedTab === "Text" ? "active" : ""}`}
                  onClick={() => setSelectedTab("Text")}
                >
                  Text
                </div>
              </div>
              <div className="Editor-Content">
                {selectedTab === "Visual" ? (
                  <JoditEditor
                    ref={editor}
                    value={formData.content}
                    tabIndex={1}
                    onBlur={handleEditorChange}
                    config={{
                      ...configEditor,
                      readonly: isViewMode,
                    }}
                  />
                ) : (
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    readOnly={isViewMode}
                    onChange={handleInputChange}
                    className="Blog-Editor-Text-Area"
                    placeholder="Blog Content"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="SEO">
          <div className="SEO-Header">
            <label htmlFor="editor">SEO</label>
          </div>
          <div className="SEO-Body">
            <div className="SEO-Row-1">
              <div className="Row-1-LeftSide">Focus Key Phrase</div>
              <div className="Row-1-RightSide">
                <textarea
                  id="FocusPhrase"
                  type="text"
                  className="SEOinput-01"
                  placeholder="Enter Key Phrase here..."
                />
              </div>
            </div>

            {[
              "Search Appearance",
              "Add Related Keyphrases",
              "Internal Linking Suggestion",
              "Corner Stone Product",
              "Insights",
            ].map((title, index) => (
              <div key={index} className={`SEO-Row-${index + 2}`}>
                <div
                  onClick={() => toggleAccordion(index + 2)}
                  className="AccordionHeader"
                >
                  <span>{title}</span>
                  <div
                    className={`AccordionIcon ${accordionsOpen[index + 2] ? "rotate" : ""
                      }`}
                  >
                    {accordionsOpen[index + 2] ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </div>
                <div
                  className={`AccordionContent ${accordionsOpen[index + 2] ? "open" : ""
                    }`}
                >

                  {title === "Search Appearance" ? (
                    <>

                      <div className="ViewSelection">
                        <div className="CheckBtn">
                          <label
                            className={`MobileCheckLabel ${isMobileAnimating && selectedView === "Mobile"
                              ? "MobileViewAnimate"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              name="viewOption"
                              value="Mobile"
                              checked={selectedView === "Mobile"}
                              onChange={() => handleChange("Mobile")}
                              className="MobileCheckBtn"
                            />
                            Mobile View
                          </label>

                          <label
                            className={`WebCheckLabel ${isWebAnimating && selectedView === "Web"
                              ? "WebViewAnimate"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              name="viewOption"
                              value="Web"
                              checked={selectedView === "Web"}
                              onChange={() => handleChange("Web")}
                              className="WebCheckBtn"
                            />
                            Web View
                          </label>
                        </div>

                        <div className="ViewContent">
                          {selectedView === "Mobile" ? (
                            <div className="MobileViewContent">
                              <div className="Mobile-FirstRow">
                                <div className="MobileLogo">
                                  <img src={Logo} alt="Logo" />
                                </div>
                                <div className="MobileHeader">
                                  <span className="Header-Top">
                                    Furniture Mecca
                                  </span>
                                  <span className="Header-Bottom">
                                    myfurnituremecca.com
                                  </span>
                                </div>
                                <div className="MobileSelector">
                                  <img src={Selector} alt="Selector" />
                                </div>
                              </div>
                              <div className="Mobile-SecondRow">
                                <span className="Header-Secondrow">
                                  -Furniture Mecca
                                </span>
                                <span className="Para-Secondrow">
                                  Please provide a meta description by editing
                                  the snippet below. if you don't, Google will
                                  try to find a relevant part of your post to
                                  show in the search result.
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="WebViewContent">
                              <div className="Web-FirstRow">
                                <div className="WebLogo">
                                  <img src={Logo} alt="Logo" />
                                </div>
                                <div className="WebHeader">
                                  <span className="Header-Top">
                                    Furniture Mecca
                                  </span>
                                  <span className="Header-Bottom">
                                    myfurnituremecca.com
                                  </span>
                                </div>
                                <div className="WebSelector">
                                  <img src={Selector} alt="Selector" />
                                </div>
                              </div>
                              <div className="Web-SecondRow">
                                <span className="Header2-Secondrow">
                                  -Furniture Mecca
                                </span>
                                <span className="Para2-Secondrow">
                                  Please provide a meta description by editing
                                  the snippet below. if you don't, Google will
                                  try to find a relevant part of your post to
                                  show in the search result.
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="SEO-SearchAppearance SEO-Bordered">
                        <div className="Row-2-LeftSide">SEO Title</div>
                        <div className="Row-2-RightSide">
                          <textarea
                            id="SEOtitle"
                            type="text"
                            className="SEOinput-02"
                            placeholder=""
                          />
                        </div>
                      </div>

                      <div className="SEO-SearchAppearance SEO-Bordered">
                        <div className="Row-2-LeftSide">Slug</div>
                        <div className="Row-2-RightSide">
                          <textarea
                            id="Slug"
                            type="text"
                            className="SEOinput-03"
                            placeholder=""
                          />
                        </div>
                      </div>

                      <div className="SEO-SearchAppearance">
                        <div className="Row-2-LeftSide">Meta Description</div>
                        <div className="Row-2-RightSide">
                          <textarea
                            id="MetaDescription-1"
                            type="text"
                            className="SEOinput-04"
                            placeholder=""
                          />
                        </div>
                      </div>
                    </>
                  ) : title === "Add Related Keyphrases" ? (
                    <div className="SEO-AddRelatedKeyphrase">
                      <div className="Row-1-LeftSide">Meta Description</div>
                      <div className="Row-1-RightSide">
                        <textarea
                          id="MetaDescription-2"
                          type="text"
                          className="SEOinput-05"
                          placeholder=""
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="RestofAcord">Content for {title} Accordion</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="PageRightSide">
        {accordionItems.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            content={item.content}
            defaultOpen={index === 0}
            maxHeight="2000px"
          />
        ))}
      </div>

      <BottomToust
        showMessage={showMessage}
        message={toastMessage}
        handleCloseMessageModal={() => handleCloseMessageModal()}
      />
    </div>
  );
};

export default AddBlogs;
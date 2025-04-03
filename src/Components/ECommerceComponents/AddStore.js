import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import "../../Pages/ECommerce/ECommerce.css";
import "../../Pages/Page.css";
import "./ECommerceComponents.css";
import "../../Pages/Page/GeneralPage.css";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import actionIcon from "../../Assets/Images/ActionBtn 30 x 30.png";
import CustomDropdown from "../../Components/UI-Controls/Dropdown/dropdown";
import uploadIcon from "../../Assets/Images/uploadImg 48 x 48.png";
import ImageGalleryPopup from "../../Components/UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup";
import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";

import { Url } from "../../Services/Api";
import { uploadImage } from "../../Services/functions";

const AddStore = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [abouttypeimage, setAboutTypeImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [storeData, setStoreData] = useState({
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
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [rowsPerPage] = useState(10);
  const [modalView, setModalView] = useState(false);
  const [modaldata, setModalData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
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
    // console.log("handleChange file", file);
    setIsUploaded(true);
  };

  const getApi = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/productsTags/get`);
      setModalData(response.data.media);
    //  console.log("product media get respponse: ", response.data.media);
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
      setStoreData((prevData) => ({
        ...prevData,
        image: image.image_url, // Set only the image_url in storeData
      }));
      setTagTypeImage(image.image_url); // Update preview with image_url
     // console.log(tagtypeimage);
    } else {
     // console.log("No section selected");
    }

    setModalView(false);
    setImageGalleryPopup(false);
  };

  useEffect(() => {
  //  console.log("Gallery Modal Status:", imageGalleryPopup);
  }, [imageGalleryPopup]);

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${Url}/api/v1/productTag/get`
      );
      const productTags = response.data.productTags || [];

      // Reverse the order of the fetched data
      const reversedData = productTags.reverse();

      setData(reversedData);
    //  console.log(reversedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleInputChange = (event) => {
    const { name, type, value } = event.target;

    if (type === "color") {
      setStoreData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "type") {
      setStoreData((prevData) => ({
        ...prevData,
        type: value,
      }));
    } else {
      setStoreData((prevData) => ({
        ...prevData,
        [name]: value,
        // Automatically generate slug from name input
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
  //  console.log("Edit clicked for:", row);

    // Update the storeData state with the selected row data, including the id
    setStoreData({
      id: row._id, // Set the id when editing a tag
      name: row.name,
      slug: row.slug,
      description: row.description,
      type: row.type,
      bg_color: row.bg_color || "", // Default to empty string if no value
      text_color: row.text_color || "", // Default to empty string if no value
      text: row.text || "", // Default to empty string if no value
      image: row.image ? `${Url+row.image}` : "",
    });

    // Set the image preview for editing
    const tagimagePreview = row.image ? `${Url+row.image}` : "";
    setTagTypeImage(tagimagePreview);
    setIsEditing(true);
  };

  const handleAddTag = async () => {
    // Log the pre-payload
  //  console.log("Pre-Payload (storeData):", storeData);

    const formData = new FormData();

    formData.append("name", storeData.name);
    formData.append("slug", storeData.slug);
    formData.append("description", storeData.description);
    formData.append("type", storeData.type);

    if (storeData.type === "text") {
      formData.append("bg_color", storeData.bg_color);
      formData.append("text_color", storeData.text_color);
      formData.append("text", storeData.text);
    } else if (storeData.type === "image") {
      if (typeof storeData.image === "string") {
        // If image is a URL string, add it directly as image_url
        formData.append("image", storeData.image);
      } else if (storeData.image instanceof File) {
        // If image is a File object, add it as an image file
        formData.append("image", storeData.image);
      }
    }

    // Log the post-payload (formData)
  //  console.log("Post-Payload (formData):");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      setLoading(true);
      let response;

      if (storeData.id) {
        response = await axios.put(
          `${Url}/api/v1/productTag/${storeData.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axios.post(
          `${Url}/api/v1/productTag/add`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

    //  console.log("Form submission successful:", response.data);

      // Reset form
      setStoreData({
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
      alert(
        `Error: ${
          error.response?.data?.message ||
          "An error occurred. Please try again."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setStoreData({
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

  const cancelAboutTypeImage = () => {
    setAboutTypeImage(null);
  };

  return (
    <div className="ProductTagPage">
      {/* {loading && (
        <div className="backdrop">
          <MainLoader />
        </div>
      )} */}

      <div className="AddStore">
        <div className="AddStoreForm">
          <div className="Header">
            {isEditing ? "Edit Store" : "Add New Store"}
          </div>
          <div className="NewStore-Add">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTag();
              }}
            >
              <div className="ParentForm">
                <div className="form-fields">
                  <label htmlFor="storeID">
                    Store ID<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="storeID"
                    name="storeID"
                    placeholder="Enter Store ID..."
                    value={storeData.storeID}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-fields">
                  <label htmlFor="storeName">
                    Store Name<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="storeName"
                    name="storeName"
                    placeholder="Enter Store Name..."
                    value={storeData.storeName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-fields">
                  <label htmlFor="managerName">
                    Manager Name<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="managerName"
                    name="managerName"
                    placeholder="Enter Manager Name..."
                    value={storeData.managerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-fields">
                  <label htmlFor="name">
                    Contact #<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    placeholder="Enter Contact Number..."
                    value={storeData.contact}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="ParentForm">
                <div className="form-fields-Row2">
                  <label htmlFor="address1">Address 1</label>
                  <textarea
                    id="address1"
                    name="address1"
                    placeholder="Enter 1st Address..."
                    value={storeData.address1}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-fields-Row2">
                  <label htmlFor="address2" style={{ marginLeft: "10px" }}>
                    Address 2
                  </label>
                  <textarea
                    id="address2"
                    name="address2"
                    placeholder="Enter 2nd Address..."
                    value={storeData.address2}
                    style={{ marginLeft: "10px" }}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="ParentForm">
                <div className="form-fields-Row2">
                  <label htmlFor="email">
                    Email<span className="superscript">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter Email ID..."
                    value={storeData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-fields">
                  <label htmlFor="longitude" style={{ marginLeft: "10px" }}>
                    Longitude<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    placeholder="Enter Longitude..."
                    value={storeData.longitude}
                    onChange={handleInputChange}
                    style={{ marginLeft: "10px" }}
                    required
                  />
                </div>

                <div className="form-fields">
                  <label htmlFor="latitude">
                    Latitude<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    placeholder="Enter Latitude..."
                    value={storeData.latitude}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="ParentForm">
                <div className="form-fields">
                  <label htmlFor="postalCode">
                    Postal Code<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    placeholder="Enter Postal Code..."
                    value={storeData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-fields">
                  <label htmlFor="city">
                    City<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter City Name..."
                    value={storeData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-fields">
                  <label htmlFor="state">
                    State<span className="superscript">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    placeholder="Enter State Name..."
                    value={storeData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-fields"></div>
              </div>
              <div className="ParentForm-2nd">
              <div style={{width: "65%"}}>

              </div>
              
              <div className="Row-Rightside">
                <div className="MainContainer">
                  <span className="AboutusLabel">Add Store Images</span>
                </div>
                <div className="BodyContainer">
                  <label style={labelStyle}>
                    Upload Image<span className="superscript">*</span>
                  </label>
                  <div className="banner-upload">
                    {abouttypeimage ? (
                      <div className="image-preview-wrapper">
                        <img
                          src={abouttypeimage}
                          alt="Banner"
                          className="image-preview"
                        />
                        <button
                          onClick={cancelAboutTypeImage}
                          className="cancel-button"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="abouttypeImage" className="upload-label">
                        <div className="Aboutupload-button">
                          <img
                            src={uploadIcon}
                            alt=""
                            className="uploaded-image"
                            id="uploaded-image-1"
                          />
                        </div>
                      </label>
                    )}
                    <input
                      type="file"
                      id="abouttypeImage"
                      name="image"
                      className="upload-input"
                      accept="image/*"
                      onChange={handleInputChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>
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
                  label={isEditing ? "Update Tag" : "Add Tag"}
                  className="AddCatBtn"
                  onClick={handleAddTag}
                  type="button" // Ensure it's still a button to prevent default submission
                />
                {/* <CodepenBtn type={1} label="Hover 1" /> */}
                {/* <SupportSection /> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  lineHeight: '18px',
  color: 'var(--text-color)',
  fontFamily: 'var(--font-family)',
  fontWeight: 'var(--font-weight-semi-bold)',
  fontSize: 'var(--font-size-large)',
  marginBottom: '5px',
  marginLeft: '5px',
  display: 'block',
};

export default AddStore;

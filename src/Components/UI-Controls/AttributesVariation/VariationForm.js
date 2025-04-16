import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../Pages/ECommerce/ECommerce.css";
import Dropdowncustom from "../Dropdown/dropdownaddgeneral1";
import ImageGalleryPopup from "../PopUp/ImageGalleryPapup/ImageGalleryPopup";
import { IoImageOutline } from "react-icons/io5";
import { Url } from "../../../Services/Api";
import { uploadImage } from "../../../Services/functions";
import { useVariationContext } from "../../../Context/ComponentContext/VariationContext";
import QuestionMarkCircle from "../QuesitionMark/QuestionMark";

const VariationForm = ({
  SaleOptions,
  ind,
  handleVariationChange,
  variableTaxTypeOptions,
  isEdit,
  isViewMode,
}) => {
  const [modalView, setModalView] = useState(false);
  const [data, setData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [singleImage, setSingleImage] = useState(null);
  const [galleryimg, setGalleryImg] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([]);
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
  const { variationData, setVariationData, setImageAtIndex } =
    useVariationContext();

  const handleGalleryModalOpen = (clickType) => {
    setModalView(true);
    setImageType(clickType);
  };

  const handleGalleryModalClose = () => {
    setModalView(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const api = `${Url}/api/v1/media/products/add`;

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

  useEffect(() => {
    getApi();
  }, []);

  useEffect(() => {
    if (isUploaded) {
      getApi();
      setIsUploaded(false);
    }
  }, [isUploaded]);

  useEffect(() => {
    if (isEdit) {
      setSingleImage(variationData[ind]?.image?.image_url || null);

      const additionalImageUrls =
        variationData[ind]?.images?.map((img) => img.image_url) || [];
      setAdditionalImages(additionalImageUrls);
    }
  }, [isEdit, variationData, ind]);

  const handleImageSelect = (image) => {
    if (imageType === "Single Image") {
      setSingleImage(image.image_url);
      setImageAtIndex(ind, image, "Single Image");
    } else if (imageType === "Additional Image") {
      setAdditionalImages((prevImages) => {
        const updatedImages = [...prevImages, image.image_url];
        setImageAtIndex(ind, image, "Additional Image");
        return updatedImages;
      });
    } else {
    }

    setModalView(false);
    setImageGalleryPopup(false);
  };

  useEffect(() => {
  }, [imageGalleryPopup]);

  const getApi = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/products/get`);
      setData(response.data.media);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  }, [galleryimg]);

  const removeSingleImage = () => {
    setSingleImage(null);
    setVariationData((prevData) => {
      const updatedData = [...prevData];
      updatedData[ind].image = null;
      return updatedData;
    });
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );

    setVariationData((prevData) => {
      const updatedData = [...prevData];
      updatedData[ind].images = updatedData[ind].images.filter(
        (_, i) => i !== index
      );
      return updatedData;
    });
  };

  const isVariationStockManagementChecked =
    variationData[ind]?.manage_stock?.is_stock_manage || false;

  return (
    <div className="Content-GeneralFields-VariationForm">
      {/* Add Single Image */}
      <div className="GeneralFields-VariationData">
        <label htmlFor="singleImg" className="VariationData-UpdatedLabel">
          Add Single Image
        </label>
        <div className="banner-upload">
          {singleImage ? (
            <div className="image-preview-wrapper">
              <img
                src={`${Url+singleImage}`}
                alt="Single Preview"
                className="image-preview"
              />
              <button onClick={removeSingleImage} className="cancel-button">
                X
              </button>
            </div>
          ) : (
            <label
              htmlFor="singleImg"
              className="uploadAdd-label"
              onClick={() => handleGalleryModalOpen("Single Image")}
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
            data={data}
          />
        </div>
      </div>

      {/* Add Additional Image */}
      <div className="GeneralFields-VariationData">
        <label htmlFor="additionalImg" className="VariationData-UpdatedLabel">
          Add Additional Image
        </label>
        <div className="banner-upload-variation">
          <div className="image-container-variation">
            {additionalImages.length > 0 &&
              additionalImages.map((image, index) => (
                <div key={index} className="image-preview-wrapper-variation">
                  <img
                    src={`${Url+image}`}
                    alt={`Additional Preview ${index}`}
                    className="image-preview-variation"
                  />
                  <button
                    onClick={() => removeAdditionalImage(index)}
                    className="cancel-button-variation"
                  >
                    X
                  </button>
                </div>
              ))}
          </div>

          <div className="upload-row">
            <label
              htmlFor="additionalImg"
              className="uploadAdd-label"
              onClick={() => handleGalleryModalOpen("Additional Image")}
            >
              <div className="Addupload-button-variation">
                <IoImageOutline
                  size={45}
                  color="#555"
                  className="uploaded-image"
                />
                <span className="uploadAdd-text">
                  {additionalImages.length > 0
                    ? "Upload More Images"
                    : "Click to Upload Image"}
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="GeneralFields-Data-Var">
        <label htmlFor="shortDescription" className="Data-Label-New">
          Description
        </label>
        <input
          type="text"
          id="short_description"
          name="short_description"
          readOnly={isViewMode}
          value={variationData[ind]?.short_description || ""}
          className="VariationData-Field"
          placeholder="Short Description"
          onChange={(event) =>
            handleVariationChange(ind, "short_description", event.target.value)
          }
        />
      </div>

      {/* SKU */}
      <div className="GeneralFields-Data-Var">
        <label htmlFor="sku" className="Data-Label-New">
          SKU
        </label>
        <input
          type="text"
          id="sku"
          name="sku"
          readOnly={isViewMode}
          value={variationData[ind]?.sku || ""}
          className="VariationData-Field"
          placeholder="SKU"
          onChange={(event) =>
            handleVariationChange(ind, "sku", event.target.value)
          }
        />
      </div>

      {/* Regular Price */}
      <div className="GeneralFields-Data-Var">
        <label htmlFor="regular_price" className="Data-Label-New">
          Regular Price ($)
        </label>
        <div className="InputWrapper-Variation">
          <span className="Prefix">$</span>
          <input
            type="text"
            id="regular_price"
            name="regular_price"
            readOnly={isViewMode}
            className="Data-Field-Variation"
            value={variationData[ind]?.regular_price || ""}
            onChange={(event) =>
              handleVariationChange(ind, "regular_price", event.target.value)
            }
            inputMode="number"
            pattern="^\d*\.?\d*$"
            title="Please enter a valid numeric value."
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, "");
            }}
          />
        </div>
      </div>

      {/* Sale Price */}
      <div className="GeneralFields-Data-Var">
        <label htmlFor="salePrice" className="Data-Label-New">
          Sale Price
        </label>
        <Dropdowncustom
          options={SaleOptions}
          selected={variationData[ind]?.discount?.discount_type || "None"}
          onChange={(selectedValue) =>
            handleVariationChange(ind, "sale_selection", selectedValue)
          }
          dropdownClass="custom-dropdown-sale"
          isViewMode={isViewMode}
          size={15}
        />
        <div className="InputWrapper-Sale">
          <span className="Prefix">$</span>
          <input
            type="text"
            id="salePrice"
            name="discount_value"
            readOnly={isViewMode}
            className="Updated-Data-Field2"
            // placeholder="$"
            value={variationData[ind]?.discount?.discount_value || ""}
            onChange={(event) =>
              handleVariationChange(ind, "discount_value", event.target.value)
            }
            inputMode="number"
            pattern="^\d*\.?\d*$"
            title="Please enter a valid numeric value."
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, "");
            }}
          />
        </div>
      </div>

      {/* Tax Status */}
      <div className="GeneralFields-Data-Var">
        <label htmlFor="tax_status" className="Data-Label-New">
          Tax Status
        </label>
        <Dropdowncustom
          options={variableTaxTypeOptions}
          selected={variationData[ind]?.tax_status || ""}
          onChange={(value) => handleVariationChange(ind, "tax_status", value)}
          dropdownClass="custom-dropdown-tax"
          size={15}
          headerheight="32px"
          dropdownstyle={{ width: 200 }}
          isViewMode={isViewMode}
        />
      </div>

      {/* Brand */}
      <div className="GeneralFields-Data-Var">
        <label htmlFor="brand" className="Data-Label-New">
          Brand
        </label>
        <input
          type="text"
          id="brand"
          name="brand"
          readOnly={isViewMode}
          value={variationData[ind]?.brand || ""}
          className="Data-Field"
          placeholder="Brand"
          onChange={(event) =>
            handleVariationChange(ind, "brand", event.target.value)
          }
        />
        <div style={{ marginBottom: "2px", marginLeft: "20px" }}>
          <QuestionMarkCircle
            size={19}
            color="var(--questionMark-color)"
            tooltip="Brand"
          />
        </div>
      </div>

      {/* GTIN */}
      <div className="GeneralFields-Data-Var">
        <label htmlFor="gtin" className="Data-Label-New">
          GTIN
        </label>
        <input
          type="text"
          id="gtin"
          name="gtin"
          readOnly={isViewMode}
          value={variationData[ind]?.gtin || ""}
          className="Data-Field"
          placeholder="GTIN"
          onChange={(event) =>
            handleVariationChange(ind, "gtin", event.target.value)
          }
        />
        <div style={{ marginBottom: "2px", marginLeft: "20px" }}>
          <QuestionMarkCircle
            size={19}
            color="var(--questionMark-color)"
            tooltip="GTIN"
          />
        </div>
      </div>

      {/* EAN */}
      <div className="GeneralFields-Data-Var">
        <label htmlFor="ean" className="Data-Label-New">
          EAN
        </label>
        <input
          type="text"
          id="ean"
          name="ean"
          readOnly={isViewMode}
          value={variationData[ind]?.ean || ""}
          className="Data-Field"
          placeholder="EAN"
          onChange={(event) =>
            handleVariationChange(ind, "ean", event.target.value)
          }
        />
        <div style={{ marginBottom: "2px", marginLeft: "20px" }}>
          <QuestionMarkCircle
            size={19}
            color="var(--questionMark-color)"
            tooltip="EAN"
          />
        </div>
      </div>

      {/* MPN */}
      <div className="GeneralFields-Data-Var">
        <label htmlFor="mpn" className="Data-Label-New">
          MPN
        </label>
        <input
          type="text"
          id="mpn"
          name="mpn"
          readOnly={isViewMode}
          value={variationData[ind]?.mpn || ""}
          className="Data-Field"
          placeholder="MPN"
          onChange={(event) =>
            handleVariationChange(ind, "mpn", event.target.value)
          }
        />
        <div style={{ marginBottom: "2px", marginLeft: "20px" }}>
          <QuestionMarkCircle
            size={19}
            color="var(--questionMark-color)"
            tooltip="MPN"
          />
        </div>
      </div>

      {/* Default Variation Check */}
      <div className="GeneralFields-Data-Var-Default">
        <label htmlFor={`defaultcheck-${ind}`} className="VariationData-Label">
          Default Variation
        </label>
        <input
          type="checkbox"
          disabled={isViewMode}
          id={`defaultcheck-${ind}`}
          name="defaultcheck"
          className="Data-Checkbox"
          checked={variationData[ind]?.defaultcheck || false}
          onChange={(e) =>
            handleVariationChange(ind, "defaultcheck", e.target.checked)
          }
        />
      </div>

      {/* Stock Management */}
      <div className="GeneralFields-VariationData-2">
        <label htmlFor="manageStock" className="VariationData-Label">
          Stock Management
        </label>
        <div className="Dropdown-Image-Container-Inventory">
          <div className="Inventory-center-variable-Stock">
            <input
              type="checkbox"
              id="manageStock"
              name="manageStock"
              disabled={isViewMode}
              className="Data-Checkbox"
              checked={variationData[ind]?.manage_stock?.is_stock_manage}
              onChange={(event) =>
                handleVariationChange(ind, "manageStock", event)
              }
            />
            <span>Manage Your Stocks</span>
          </div>
        </div>
      </div>

      {variationData[ind]?.manage_stock?.is_stock_manage && (
        <>
          <div className="GeneralFields-VarCheckedData">
            <label
              htmlFor="locations"
              className="VariableInventoryFields-Data-Label"
            >
              Locations
            </label>
            <input
              type="text"
              value="All Locations"
              readOnly
              className="readonly-inputVariation-location"
            />
          </div>
          <div className="GeneralFields-CheckedData">
            <label
              htmlFor="quantity"
              className="VariableInventoryFields-Data-Label"
            >
              Quantity
            </label>
            <div className="VariableInventoryFields-Dropdown-Container">
              <div className="Inventory-center">
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  readOnly={isViewMode}
                  className="Data-Field-VarCheckedInventory"
                  placeholder="1"
                  value={variationData[ind]?.manage_stock?.quantity || ""}
                  onChange={(value) =>
                    handleVariationChange(ind, "quantity", value.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="GeneralFields-VariationData-3">
            <label className="VariableInventoryFields-Data-Label">
              Stock Status
            </label>
            <div className="Stock-Status-Label">
              <div className="Inventory-Radiocenter-1">
                <input
                  type="radio"
                  id="inStock"
                  name={`stock_status_${ind}`}
                  disabled={isViewMode}
                  className="Data-Radio"
                  value="inStock"
                  checked={
                    variationData[ind]?.manage_stock?.stock_status === "inStock"
                  }
                  onChange={(value) =>
                    handleVariationChange(
                      ind,
                      "stock_status",
                      value.target.value
                    )
                  }
                />
                <span className="radiolabel-alignment">In Stock</span>
              </div>
              <div className="Inventory-Radiocenter-1">
                <input
                  type="radio"
                  id="outStock"
                  disabled={isViewMode}
                  name={`stock_status_${ind}`}
                  className="Data-Radio"
                  value="outStock"
                  checked={
                    variationData[ind]?.manage_stock?.stock_status ===
                    "outStock"
                  }
                  onChange={(value) =>
                    handleVariationChange(
                      ind,
                      "stock_status",
                      value.target.value
                    )
                  }
                />
                <span className="radiolabel-alignment">Out of Stock</span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="GeneralFields-InventoryData-11">
        <label className="VariationData-Label">Allow Back Order</label>
        <div className="Variation-Back-Order-Main">
          <div className="Inventory-Radiocenter">
            <input
              type="radio"
              id="dontAllow"
              name={`allow_back_order_${ind}`}
              disabled={isViewMode}
              className="Data-Radio"
              value="doNotAllow"
              onChange={(e) =>
                handleVariationChange(ind, "allow_back_order", 0)
              }
              checked={variationData[ind]?.allow_back_order === 0}
            />
            <span>Do Not Allow</span>
          </div>
          <div className="Inventory-Radiocenter">
            <input
              type="radio"
              id="notifyCustomer"
              name={`allow_back_order_${ind}`}
              disabled={isViewMode}
              className="Data-Radio"
              value="notifyCustomer"
              onChange={(e) =>
                handleVariationChange(ind, "allow_back_order", 1)
              }
              checked={variationData[ind]?.allow_back_order === 1}
            />
            <span>Allow & Notify Customer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariationForm;
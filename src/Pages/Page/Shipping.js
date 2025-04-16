import React, { useRef, useState, useEffect } from "react";
import "./GeneralPage.css";
import "../Page.css";
import JoditEditor from "jodit-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "../../../src/JoditEditorStyle.css";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import { Url } from "../../Services/Api";
import BottomToust from "../../Components/BottomToust/BottomToust";
import { MdLocalDining } from "react-icons/md";
import SectionLoader from "../../Components/UI-Controls/MainLoader/SectionLoader";

const ShippingDelivery = () => {
  const editor = useRef(null); // Reference for JoditEditor
  const [sDeliveryData, setSDeliveryData] = useState("");
  const [selectedTab, setSelectedTab] = useState("Visual");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getApiUrl = `${Url}/api/v1/pages/shipping-delivery/get`;
  const postApiUrl = `${Url}/api/v1/pages/shipping-delivery/add`;

  const [loading, setLoading] = useState(false);

  /* --- Jodit Editor Configuration --- */
  const configEditor = {
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "paragraph", // Adds paragraph options
      "fontsize", // Adds font size options
      "lineHeight", // Adds line height options
      "|",
      "ul", // Unordered list
      "ol", // Ordered list
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
      height: "400px",
    },
    toolbarAdaptive: false,
    toolbarSticky: false,
  };

  /* --- Fetch the Shipping Delivery data on component mount --- */

  useEffect(() => {
    const fetchShippingDeliveryData = async () => {
      try {
        const response = await axios.get(getApiUrl);
        if (response.status === 200) {
          setSDeliveryData(response.data?.shippingDelivery.content || "");
          toast.success("Shipping Delivery Loaded Successfully!");
        } else {
          toast.error("Failed to load Shipping Delivery!");
        }
      } catch (error) {
        console.error("Error fetching Shipping Delivery:", error);
        toast.error("An error occurred while fetching Shipping Delivery!");
      }
    };

    fetchShippingDeliveryData();
  }, []);



  const handleSDeliveryDataChange = (newContent) => {
    setSDeliveryData(newContent);
  };


  const [toustOpen, setOpenToust] = useState(false);
  const [message, setMessage] = useState("");

  const handleTouseOpen = (message) => {
    setOpenToust(true);
    setMessage(message);

    const timeout = setTimeout(() => {
      setOpenToust(false);
    }, 1500);
  }

  const handleCloseToust = () => {
    setOpenToust(false);
  }

  const handleSubmit = async () => {
    const content =
      selectedTab === "Visual"
        ? sDeliveryData
        : document.getElementById("shippingDescription").value;

    const payload = {
      title: "Shipping Delivery",
      content: content,
      isActive: true,
    };

    try {
      setLoading(true)
      setIsSubmitting(true);
      const response = await axios.post(postApiUrl, payload);

      if (response.status === 200) {
        console.log("Shipping Delivery updated successfully:", response.data);
        handleTouseOpen("Shipping Delivery Updated Successfully!");
        setSDeliveryData(response.data.content); // Update editor or text area with returned content
      } else {
        console.error(
          "Failed to Update Shipping Delivery:",
          response.statusText
        );
        
      }
    } catch (error) {
      console.error("Error occurred:", error);
      handleTouseOpen("An error occurred while updating Shipping Delivery!");
      setLoading(false);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="ShippingDeliveryMainPage">
      {loading && <SectionLoader />}
      <div className="ShippingDelivery-Section">
        <div className="Policy-Editor">
          <div className="Editor-Row">
            <div className="General-Editor-Container">
              <div className="General-Editor-Tabs">
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
              <div className="General-Editor-Content">
                {selectedTab === "Visual" ? (
                  <JoditEditor
                    ref={editor}
                    value={sDeliveryData}
                    tabIndex={1}
                    onBlur={handleSDeliveryDataChange}
                    config={configEditor}
                  />
                ) : (
                  <textarea
                    id="shippingDescription"
                    name="shippingDescription"
                    value={sDeliveryData}
                    onChange={(e) => setSDeliveryData(e.target.value)}
                    className="General-Editor-Text-Area"
                    placeholder="Shipping Delivery Description"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="Policy-SubmitBtn">
            <CustomBtn
              label={isSubmitting ? "Shipping Updating..." : "Update Shipping"}
              className="AddPolicyBtn"
              onClick={handleSubmit}
              type="button"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
      <BottomToust 
        message={message}
        showMessage={toustOpen}
        handleCloseMessageModal={handleCloseToust}
      />
    </div>
  );
};

export default ShippingDelivery;

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
import SectionLoader from "../../Components/UI-Controls/MainLoader/SectionLoader";

const ReturnPolicy = () => {
  const editor = useRef(null);
  const [rPolicyData, setRPolicyData] = useState("");
  const [selectedTab, setSelectedTab] = useState("Visual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [openToust, setOpenToust] = useState(false);

  const apiUrl = {
    get: `${Url}/api/v1/pages/return-policy/get`,
    add: `${Url}/api/v1/pages/return-policy/add`,
  };

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

  useEffect(() => {
    fetchReturnPolicy();
  }, []);

  const fetchReturnPolicy = async () => {
    try {
      const response = await axios.get(apiUrl.get);
      if (response.status === 200) {
        setRPolicyData(response.data?.returnPolicy.content || "");
      } else {
        toast.error("Failed to fetch Return Policy!");
      }
    } catch (error) {
      console.error("Error fetching Return Policy:", error);
      toast.error("An error occurred while fetching Return Policy!");
    }
  };

  const handleRPolicyDataChange = (newContent) => {
    setRPolicyData(newContent);
  };

  const handleOpenToust = (message) => {
    setOpenToust(true);
    setMessage(message);

    const timeout = setTimeout(() => {
      setOpenToust(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }

  const handleCloseToust = () => {
    setOpenToust(false);
  }

  const handleReturnSubmit = async () => {
    const content =
      selectedTab === "Visual"
        ? rPolicyData
        : document.getElementById("returnDescription").value;

    const payload = {
      title: "Return Policy",
      content: content,
      isActive: true,
    };

    try {
      setLoading(true);
      setIsSubmitting(true);
      const response = await axios.post(apiUrl.add, payload);

      if (response.status === 200) {
        console.log("Return Policy updated successfully:", response.data);
        handleOpenToust("Return Policy Updated Successfully!");
        fetchReturnPolicy();
      } else {
        console.error("Failed to update Return Policy:", response.statusText);
        handleOpenToust("Failed to Update Return Policy!");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setLoading(false);
      toast.error("An error occurred while updating Return Policy!");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ReturnPolicyMainPage">
      {loading && <SectionLoader />}
      <div className="ReturnPolicy-Section">
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
                    value={rPolicyData}
                    tabIndex={1}
                    onBlur={handleRPolicyDataChange}
                    config={configEditor}
                  />
                ) : (
                  <textarea
                    id="returnDescription"
                    name="returnDescription"
                    value={rPolicyData}
                    onChange={(e) => setRPolicyData(e.target.value)}
                    className="General-Editor-Text-Area"
                    placeholder="Return Policy Description"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="Policy-SubmitBtn">
            <CustomBtn
              label={isSubmitting ? "Returns Updating..." : "Update Returns"}
              className="AddPolicyBtn"
              onClick={handleReturnSubmit}
              type="button"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <BottomToust
              message={message}
              showMessage={openToust}
              handleCloseToust={handleCloseToust}
            />
    </div>
  );
};

export default ReturnPolicy;

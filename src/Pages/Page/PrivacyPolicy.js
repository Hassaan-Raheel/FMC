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
import SectionLoader from "../../Components/UI-Controls/MainLoader/SectionLoader";
import BottomToust from "../../Components/BottomToust/BottomToust";

const PrivacyPolicy = () => {
  const editor = useRef(null);
  const [pPolicyData, setPPolicyData] = useState("");
  const [selectedTab, setSelectedTab] = useState("Visual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [openToust, setOpenToust] = useState(false);

  const getApiUrl = `${Url}/api/v1/pages/privacy-policy/get`;
  const postApiUrl = `${Url}/api/v1/pages/privacy-policy/add`;

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

  /* --- Fetch the policy data on component mount --- */

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await axios.get(getApiUrl);
        if (response.status === 200) {
          setPPolicyData(response.data?.privacyPolicy.content || "");
          console.log("Policy Data:", response.data?.privacyPolicy.content);
          // toast.success("Privacy Policy Loaded Successfully!");
        } else {
          // toast.error("Failed to load Privacy Policy!");
        }
      } catch (error) {
        console.error("Error fetching Privacy Policy:", error);
        // toast.error("An error occurred while fetching Privacy Policy!");
      }
    };

    fetchPolicyData();
  }, []);

  const handlePPolicyDataChange = (newContent) => {
    setPPolicyData(newContent);
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


  const handleSubmit = async () => {
    const content =
      selectedTab === "Visual"
        ? pPolicyData
        : document.getElementById("policyDescription").value;

    const payload = {
      title: "Privacy Policy",
      content: content,
      isActive: true,
    };

    try {
      setLoading(true);
      setIsSubmitting(true);
      const response = await axios.post(postApiUrl, payload);

      if (response.status === 200) {
        handleOpenToust("Privacy Policy Updated Successfully!");
        setPPolicyData(response.data.content); // Update editor or text area with returned content
      } else {
        console.error("Failed to Update Privacy Policy:", response.statusText);
        handleOpenToust("Failed to Update Privacy Policy!");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setLoading(false);
      handleOpenToust("An error occurred while updating Privacy Policy!");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="PrivacyPolicyMainPage">
      {loading && <SectionLoader />}
      <div className="PrivacyPolicy-Section">
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
                    value={pPolicyData}
                    tabIndex={1}
                    onBlur={handlePPolicyDataChange}
                    config={configEditor}
                  />
                ) : (
                  <textarea
                    id="policyDescription"
                    name="policyDescription"
                    value={pPolicyData}
                    onChange={(e) => setPPolicyData(e.target.value)}
                    className="General-Editor-Text-Area"
                    placeholder="Privacy Policy Description"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="Policy-SubmitBtn">
            <CustomBtn
              label={isSubmitting ? "Policy Updating..." : "Update Policy"}
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
        showMessage={openToust}
        handleCloseToust={handleCloseToust}
      />
    </div>
  );
};

export default PrivacyPolicy;

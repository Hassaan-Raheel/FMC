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

const AboutPage = () => {
  const editor = useRef(null);
  const [aboutUsData, setAboutUsData] = useState("");
  const [selectedTab, setSelectedTab] = useState("Visual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isToustOpen, setIsToustOpen] = useState(false);

  const apiUrl = {
    get: `${Url}/api/v1/pages/about-us/get`,
    add: `${Url}/api/v1/pages/about-us/add`,
  };

  const handleToustShow = (message) => {
    setMessage(message);
    setIsToustOpen(true);

    const timeOut = setTimeout(() => {
      setIsToustOpen(false);
    }, 1500);

    return () => {clearTimeout(timeOut)}
  }

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
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const response = await axios.get(apiUrl.get);
      if (response.status === 200) {
        setAboutUsData(response.data?.aboutUs.content || "");
      } else {
        toast.error("Failed to fetch About Us!");
      }
    } catch (error) {
      console.error("Error fetching About Us:", error);
      toast.error("An error occurred while fetching About Us!");
    }
  };

  const handleAboutUsDataChange = (newContent) => {
    setAboutUsData(newContent);
  };

  const handleAboutSubmit = async () => {
    const content =
      selectedTab === "Visual"
        ? aboutUsData
        : document.getElementById("aboutUsDescription").value;

    const payload = {
      title: "About Us",
      content: content,
      isActive: true,
    };

    try {
      setIsSubmitting(true);
      setLoading(true)
      const response = await axios.post(apiUrl.add, payload);

      if (response.status === 200) {
        handleToustShow("About Us Updated Successfully!");
        
        fetchAboutUs();
      } else {
        console.error("Failed to update About Us:", response.statusText);
        handleToustShow("Failed to Update About Us!");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setLoading(false);
      handleToustShow("An error occurred while updating About Us!");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleToustClose = () => {
    setIsToustOpen(false);
  }

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
                    value={aboutUsData}
                    tabIndex={1}
                    onBlur={handleAboutUsDataChange}
                    config={configEditor}
                  />
                ) : (
                  <textarea
                    id="aboutUsDescription"
                    name="aboutUsDescription"
                    value={aboutUsData}
                    onChange={(e) => setAboutUsData(e.target.value)}
                    className="General-Editor-Text-Area"
                    placeholder="About Us Description"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="Policy-SubmitBtn">
            <CustomBtn
              label={isSubmitting ? "About Us Updating..." : "Update About Us"}
              className="AddAboutUsBtn"
              onClick={handleAboutSubmit}
              type="button"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <BottomToust 
        message={message}
        showMessage={isToustOpen}
        handleClose={handleToustClose}
      />
    </div>
  );
};

export default AboutPage;

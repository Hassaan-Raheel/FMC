import React, { useRef, useState, useEffect } from 'react';
import './GeneralPage.css';
import '../Page.css';
import JoditEditor from "jodit-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../../../src/JoditEditorStyle.css';
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import { Url } from "../../Services/Api";
import BottomToust from '../../Components/BottomToust/BottomToust';
import SectionLoader from '../../Components/UI-Controls/MainLoader/SectionLoader';

const TermsConditions = () => {
  const editor = useRef(null);
  const [tConditionData, setTConditionData] = useState('');
  const [selectedTab, setSelectedTab] = useState("Visual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [openToust, setOpenToust] = useState(false);

  const apiUrl = {
    get: `${Url}/api/v1/pages/terms-conditions/get`,
    add: `${Url}/api/v1/pages/terms-conditions/add`,
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
    fetchTermsAndConditions();
  }, []);

  const fetchTermsAndConditions = async () => {
    try {
      const response = await axios.get(apiUrl.get);
      if (response.status === 200) {
        setTConditionData(response.data?.termsConditions.content || '');
      } else {
        toast.error('Failed to fetch Terms & Conditions!');
      }
    } catch (error) {
      console.error('Error fetching Terms & Conditions:', error);
      toast.error('An error occurred while fetching Terms & Conditions!');
    }
  };

  const handleTConditionDataChange = (newContent) => {
    setTConditionData(newContent);
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

  const handleTermsSubmit = async () => {
    const content =
      selectedTab === "Visual" ? tConditionData : document.getElementById('conditionDescription').value;

    const payload = {
      title: "Terms & Condition", 
      content: content,
      isActive: true,
    };

    try {
      setLoading(true);
      setIsSubmitting(true);
      const response = await axios.post(apiUrl.add, payload);

      if (response.status === 200) {
        console.log('Terms & Conditions updated successfully:', response.data);
        handleOpenToust('Terms & Conditions Updated Successfully!');
        fetchTermsAndConditions(); // Refresh the editor content
      } else {
        console.error('Failed to update Terms & Conditions:', response.statusText);
        handleOpenToust('Failed to Update Terms & Conditions!');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setLoading(false)
      handleOpenToust('An error occurred while updating Terms & Conditions!');
    } finally {
      setIsSubmitting(false);
      setLoading(false)
    }
  };

  return (
    <div className="TermsConditionMainPage">
      {loading && <SectionLoader />}
      <div className="TermsCondition-Section">
        <div className="Policy-Editor">
          <div className="Editor-Row">
            <div className="General-Editor-Container">
              <div className="General-Editor-Tabs">
                <div
                  className={`Tab ${selectedTab === 'Visual' ? 'active' : ''}`}
                  onClick={() => setSelectedTab("Visual")}
                >
                  Visual
                </div>
                <div
                  className={`Tab ${selectedTab === 'Text' ? 'active' : ''}`}
                  onClick={() => setSelectedTab("Text")}
                >
                  Text
                </div>
              </div>
              <div className="General-Editor-Content">
                {selectedTab === 'Visual' ? (
                  <JoditEditor
                    ref={editor}
                    value={tConditionData}
                    tabIndex={1}
                    onBlur={handleTConditionDataChange}
                    config={configEditor}
                  />
                ) : (
                  <textarea
                    id="conditionDescription"
                    name="conditionDescription"
                    value={tConditionData}
                    onChange={(e) => setTConditionData(e.target.value)}
                    className="General-Editor-Text-Area"
                    placeholder="Terms & Condition Description"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="Policy-SubmitBtn">
            <CustomBtn
              label={isSubmitting ? 'Terms Updating...' : 'Update Terms'}
              className="AddPolicyBtn"
              onClick={handleTermsSubmit}
              type="button"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <BottomToust 
        message={message}
        showMessage={openToust}
        handleCloseMessageModal={handleCloseToust}
      />
    </div>
  );
};

export default TermsConditions;
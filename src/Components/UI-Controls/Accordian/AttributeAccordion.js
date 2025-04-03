import React, { useState, useEffect } from "react";
import "./Accordian.css";
import openIcon from '../../../Assets/Images/dropup 20 x 20.png';
import closeIcon from '../../../Assets/Images/dropdown 20 x 20.png';
import { RiDeleteBinLine } from "react-icons/ri";

const AttributeAccordion = ({ contentHeight, headerBgColor = 'var(--second-layer-bg)', contentBgColor = 'var(--second-layer-bg)', title, content, handleDelete, toggleLabel, showDeleteIcon = true, showToggleIcon = true, flexDirection = "column", isViewMode = false, }) => {
  const [isOpen, setIsOpen] = useState(false);

   useEffect(() => {
    if (isViewMode) {
      setIsOpen(true);
    }
  }, [isViewMode]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="attribute-accordion-container">
      <div className="attribute-accordion-header" onClick={toggleAccordion} style={{ backgroundColor: headerBgColor }} >
        <span>{title}</span>
        <div className="attribute-accordion-actions">
          
          {showDeleteIcon && (
          <span className="delete-icon" onClick={() => handleDelete(title)}>
          <RiDeleteBinLine className="delete-btn" />
          </span>
          )}

          {showToggleIcon && (
          <span
            className={`attribute-accordion-icon ${isOpen ? 'rotate' : ''} ${toggleLabel ? 'edit-text' : ''}`} 
            onClick={toggleAccordion}
          >

            {toggleLabel ? toggleLabel : (
              <img src={isOpen ? openIcon : closeIcon} alt="toggle-icon" />
            )}
          </span>
          )}

        </div>
      </div>
      <div className={`attribute-accordion-content-wrapper ${isOpen ? 'show' : ''}`}  >
        <div className="attribute-accordion-content" style={{ flexDirection, backgroundColor: contentBgColor, height: contentHeight }}>{content}</div>
      </div>
    </div>
  );
};

export default AttributeAccordion;
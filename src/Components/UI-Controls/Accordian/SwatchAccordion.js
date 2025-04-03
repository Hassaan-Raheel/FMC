import React, { useState, useEffect } from "react";
import "./SwatchAccordion.css";
import openIcon from '../../../Assets/Images/dropup 20 x 20.png';
import closeIcon from '../../../Assets/Images/dropdown 20 x 20.png';
import { RiDeleteBinLine } from "react-icons/ri";
import { useSwatchContext } from "../../../Context/ComponentContext/SwatchContext";

const SwatchAccordion = ({ title, content, handleDelete, toggleLabel, showDeleteIcon = true, showToggleIcon = true,activeIndex, isViewMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {setActiveIndex} = useSwatchContext();

  useEffect(() => {
    if (isViewMode) {
      setIsOpen(true);
    }
  }, [isViewMode]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    setActiveIndex(activeIndex)
  };

  return (
    <div className="swatch-accordion-container">
      <div className="swatch-accordion-header" onClick={toggleAccordion}>
        <span>{title}</span>
        <div className="swatch-accordion-actions">
          {showDeleteIcon && (
          <span className="delete-icon" onClick={() => handleDelete(title)}>
          <RiDeleteBinLine className="delete-btn" />
          </span>
          )}

          {showToggleIcon && (
          <span
            className={`swatch-accordion-icon ${isOpen ? 'rotate' : ''} ${toggleLabel ? 'edit-text' : ''}`} 
            onClick={toggleAccordion}
          >

            {toggleLabel ? toggleLabel : (
              <img src={isOpen ? openIcon : closeIcon} alt="toggle-icon" />
            )}
          </span>
          )}
        </div>
      </div>
      <div className={`swatch-accordion-content-wrapper ${isOpen ? 'show' : ''}`}>
        <div className="swatch-accordion-content">{content}</div>
      </div>
    </div>
  );
};

export default SwatchAccordion;
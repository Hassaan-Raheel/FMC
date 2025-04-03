import React from "react";
import "./Accordian.css";
import openIcon from '../../../Assets/Images/dropup 20 x 20.png';
import closeIcon from '../../../Assets/Images/dropdown 20 x 20.png';

const VariationAccordion = ({
  headerBgColor = 'var(--second-layer-bg)',
  contentBgColor = 'var(--second-layer-bg)',
  title,
  content,
  isOpen,
  toggleAccordion,
}) => {
  return (
    <div className="attribute-accordion-container">
      <div
        className="attribute-accordion-header"
        onClick={toggleAccordion}
        style={{ backgroundColor: headerBgColor }}
      >
        <span>{title}</span>
        <span
          className={`attribute-accordion-icon ${isOpen ? 'rotate' : ''}`}
        >
          <img src={isOpen ? openIcon : closeIcon} alt="toggle-icon" />
        </span>
      </div>
      {isOpen && (
        <div
          className="attribute-accordion-content-wrapper show"
          style={{ backgroundColor: contentBgColor }}
        >
          <div className="attribute-accordion-content">{content}</div>
        </div>
      )}
    </div>
  );
};

export default VariationAccordion;
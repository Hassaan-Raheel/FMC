import React, { useState, useEffect } from "react";
import "./Accordian.css";
import openIcon from '../../../Assets/Images/dropup 20 x 20.png';
import closeIcon from '../../../Assets/Images/dropdown 20 x 20.png';

const AccordionItem = ({ title, content, defaultOpen, headerHeight, containerWidth, BorderRadius, Display, BoxShadow, Border, Background, BorderContent, Gap, maxHeight }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (defaultOpen) {
      setIsOpen(true);
    }
  }, [defaultOpen]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-container" style={{ maxWidth: containerWidth, borderRadius: BorderRadius, boxShadow: BoxShadow,  }}>
      <div className="accordion-header" onClick={toggleAccordion} style={{ height: headerHeight, border: Border }}>
        <div>{title}</div>
        <span className={`accordion-icon ${isOpen ? 'rotate' : ''}`} style={{display: Display}}>
          <img src={isOpen ? openIcon : closeIcon} alt="toggle-icon" />
        </span>
      </div>
      <div className={`accordion-content-wrapper ${isOpen ? 'show' : ''}`} style={{ maxHeight: isOpen ? maxHeight || "1000" : 0 }} >
        <div className="accordion-content" style={{background: Background, border: BorderContent, gap: Gap, }}>{content}</div>
      </div>
    </div>
  );
};

export default AccordionItem;
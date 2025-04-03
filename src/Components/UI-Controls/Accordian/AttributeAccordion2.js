import React, { useState } from "react";
import "./Accordian.css";

const AttributeAccordion2 = ({
  title,
  content,
  handleDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dynamicHeight, setDynamicHeight] = useState(185);

  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <div className="attribute-accordion">
      <div className="accordion-header" onClick={toggleAccordion}>
        <span>{title}</span>
        <button onClick={() => handleDelete(title)}>Delete</button>
      </div>
      {isOpen && (
        <div
          className="accordion-content"
          style={{ height: `${dynamicHeight}px` }}
        >
          {React.cloneElement(content, {
            onHeightChange: (newHeight) => {
              setDynamicHeight(Math.max(185, newHeight + 100));
            },
          })}
        </div>
      )}
    </div>
  );
};

export default AttributeAccordion2;
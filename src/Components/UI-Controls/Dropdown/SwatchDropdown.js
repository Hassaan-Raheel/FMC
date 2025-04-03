import React, { useState, useEffect, useRef } from 'react';
import './dropdown.css';
import './swatchdropdown.css';
import openIcon from '../../../Assets/Images/dropup 20 x 20.png';
import closeIcon from '../../../Assets/Images/dropdown 20 x 20.png';
import { useSwatchContext } from "../../../Context/ComponentContext/SwatchContext";

const DropdownSwatch = ({ optionsmap, selectedOption, handleOptionChange, size = 17, isViewMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { activeIndexOpt, setActiveIndexOpt } = useSwatchContext();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownClick = () => {
    if (!isViewMode) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="swatch-dropdown" ref={dropdownRef}>
      
      <div
        className="swatch-selected"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption || "Product Type"}
        <span
          className="dropdown-arrow"
          style={{ transform: isOpen ? 'rotate(360deg)' : 'rotate(0deg)' }}
        >
          <img
            src={isOpen ? openIcon : closeIcon}
            alt="toggle"
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        </span>
      </div>

      {isOpen && !isViewMode && (
        <div className={`dropdown-options-swatch ${isOpen ? 'show' : ''}`}>
          {optionsmap.map((option, index) => (
            <div
              key={index}
              className={`dropdown-option ${activeIndexOpt === index ? "active" : ""}`}
              onClick={() => {
                handleOptionChange(option.value);
                setActiveIndexOpt(index);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSwatch;
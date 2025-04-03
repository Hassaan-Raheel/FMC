import React, { useState, useEffect, useRef } from 'react';
import './dropdown.css';
import openIcon from '../../../Assets/Images/dropup 20 x 20.png';
import closeIcon from '../../../Assets/Images/dropdown 20 x 20.png';

const Dropdownresize = ({ options, selectedOption, handleOptionChange, size = 17, isViewMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleDropdownToggle = () => {
    if (!isViewMode) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option) => {
    if (!isViewMode) {
      handleOptionChange(option.value);
      setIsOpen(false);
    }
  };

  return (
    <div className="custom-dropdown-add" ref={dropdownRef}>
      <div className="dropdown-selected-add" onClick={handleDropdownToggle}>
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
        <div className={`dropdown-options-add ${isOpen ? 'show' : ''}`}>
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdown-option"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdownresize
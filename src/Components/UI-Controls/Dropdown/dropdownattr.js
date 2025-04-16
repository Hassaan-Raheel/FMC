import React, { useState, useEffect, useRef } from 'react';
import './dropdown.css';
import openIcon from '../../../Assets/Images/dropup 20 x 20.png';
import closeIcon from '../../../Assets/Images/dropdown 20 x 20.png';

const Dropdownresize = ({ options, selectedOption, handleOptionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-dropdown-1" ref={dropdownRef}>
      <div className="dropdown-selected" onClick={() => setIsOpen(!isOpen)}>
        {selectedOption || "Select Option"}
        <span
          className="dropdown-arrow"
          style={{
            transform: isOpen ? 'rotate(360deg)' : 'rotate(0deg)',
          }}
        >
          <img src={isOpen ? openIcon : closeIcon} alt="toggle" />
        </span>
      </div>
      {isOpen && (
        <div className={`dropdown-options-1 ${isOpen ? 'show' : ''}`}>
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdown-option"
              onClick={() => {
                handleOptionChange(option.value);
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

export default Dropdownresize;
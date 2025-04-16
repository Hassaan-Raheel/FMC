import React, { useState, useEffect, useRef } from 'react';
import './dropdown.css';
import openIcon from '../../../Assets/Images/dropup 20 x 20.png';
import closeIcon from '../../../Assets/Images/dropdown 20 x 20.png';

const CustomDropdown = ({
  options,
  selectedOption,
  handleOptionChange,
  dropdownSelectedStyle,
  dropdownborder,
  dropdownMarginBottom,
  arrowSize,
  optionsWidth,
  optionstextAlign,
  optionsBackgroundColor,
  optionsHeight,
  dropdownHeight,
  dropdownWidth,
  backgroundColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dropdownStyles = {
    height: dropdownHeight || '40px',
    width: dropdownWidth || '320px',
    backgroundColor: backgroundColor || 'var(--containers-color)',
    border: dropdownborder || '1px solid #F0F0F0',
    marginBottom: dropdownMarginBottom || '0',
  };

  const optionsStyles = {
    width: optionsWidth || '318px',
    backgroundColor: optionsBackgroundColor || 'var(--containers-color)',
    height: optionsHeight || 'auto',
    textAlign: optionstextAlign || 'justify',
  };

  const selectedStyles = {
    padding: dropdownSelectedStyle || '11px 7px 7px 7px',
  };

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
    <div className="custom-dropdown" style={dropdownStyles} ref={dropdownRef}>
      <div
        className="dropdown-selected"
        style={selectedStyles}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption || 'Select Option'}
        <span
          className="dropdown-arrow"
          style={{
            transform: isOpen ? 'rotate(360deg)' : 'rotate(0deg)',
            width: arrowSize,
            height: arrowSize,
          }}
        >
          <img
            src={isOpen ? openIcon : closeIcon}
            alt="toggle"
            style={{ width: '100%', height: '100%' }}
          />
        </span>
      </div>
      {isOpen && (
        <div className={`dropdown-options-update ${isOpen ? 'show' : ''}`} style={optionsStyles}>
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdown-option-update"
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

export default CustomDropdown;
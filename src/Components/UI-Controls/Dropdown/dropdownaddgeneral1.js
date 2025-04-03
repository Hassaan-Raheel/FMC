import React, { useState, useEffect, useRef } from "react";
import "./Dropdowncustom.css";
import openIcon from '../../../Assets/Images/dropup 20 x 20.png';
import closeIcon from '../../../Assets/Images/dropdown 20 x 20.png';

const Dropdowncustom = ({
  options,
  selected,
  onChange,
  dropdownClass,
  size = 20,
  headerBgColor = "var(--third-layer-bg)",
  listBgColor = "var(--third-layer-bg)",
  listmaxHeight ="80px",
  headerheight = "30px",
  headerborder = "var(--standered-border)",
  dropdownstyle = {},
  isViewMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleItemClick = (value) => {
    if (!isViewMode) {
      onChange(value);
      setIsOpen(false);
    }
  };

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

  return (
    <div
      className={`dropdown-wrapper ${dropdownClass}`}
      style={dropdownstyle}
      ref={dropdownRef}
    >
      <div
        className={`dropdown-header ${isOpen ? "open" : ""}`}
        onClick={handleDropdownToggle}
        style={{
          backgroundColor: headerBgColor,
          height: headerheight,
          border: headerborder,
        }}
      >
        {selected
          ? options.find((option) => option.value === selected)?.label || "None"
          : "None"}
        <img
          src={isOpen ? openIcon : closeIcon}
          alt={isOpen ? "Close dropdown" : "Open dropdown"}
          className="dropdown-icon"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      </div>

      {isOpen && !isViewMode && (
        <ul
          className="dropdown-list"
          style={{ backgroundColor: listBgColor, maxHeight: listmaxHeight  }}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className={`dropdown-item ${
                selected === option.value ? "selected" : ""
              }`}
              onClick={() => handleItemClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      
    </div>
  );
};

export default Dropdowncustom;
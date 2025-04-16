import React from "react";
import PropTypes from "prop-types";
import "./Btn.css";
import importIcon from "../../../Assets/Images/Download 18 x 18.png";
import exportIcons from "../../../Assets/Images/Upload 18 x 18.png";
import filterIcon from "../../../Assets/Images/FilterBtn 22 x 22.png";
import { IoIosAdd } from "react-icons/io";

const CustomBtn = ({
  label,
  onClick,
  type = "button",
  className,
  disabled = false,
  style,
  withIcon = false,
  iconType = "plus",
}) => {
  const renderIcon = () => {
    if (withIcon) {
      switch (iconType) {
        case "plus":
          return <IoIosAdd className="plus-btn" />
        case "import":
          return (
            <img src={importIcon} alt="import icon" className="import-btn" />
          );
        case "exports":
          return (
            <img src={exportIcons} alt="export icon" className="export-btn" />
          );
        case "filter":
          return (
            <img src={filterIcon} alt="filter icon" className="filter-btn" />
          )
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`custom-btn ${className}`}
      disabled={disabled}
      style={style}
    >
      {renderIcon()}
      {label}
    </button>
  );
};

CustomBtn.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  withIcon: PropTypes.bool,
  iconType: PropTypes.string,
};

export default CustomBtn;
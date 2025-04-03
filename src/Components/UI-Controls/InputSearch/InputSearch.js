import React, { useState, useEffect, useRef } from "react";
import "../../../Pages/ECommerce/ECommerce.css";
import "./InputSearch.css";

const SearchInput = ({ label, name, placeholder, options, onSelect, isViewMode = false }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFilteredOptions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    if (!isViewMode) {
      const value = e.target.value;
      setInputValue(value);
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  };

  const handleSelectOption = (option) => {
    if (!isViewMode) {
      setInputValue("");
      setFilteredOptions([]);
      onSelect(option);
    }
  };

  return (
    <div className="GeneralFields-LinkedData" ref={wrapperRef}>
      <label htmlFor={name} className="Data-Label-LinkedAttribute">{label}</label>
      <div className="Search-SingleSelect-Field">
        <input
          type="text"
          id={name}
          name={name}
          className="Data-Field-Linked"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          disabled={isViewMode}
        />
        {filteredOptions.length > 0 && !isViewMode && (
          <ul className="suggestion-list">
            {filteredOptions.map((item, index) => (
              <li key={index} onClick={() => handleSelectOption(item)}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
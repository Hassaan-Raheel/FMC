import React, { useState, useEffect, useRef } from 'react';
import "../../../Pages/ECommerce/ECommerce.css";
import "./Multiselect.css";

const SearchMultiple = ({ label, isViewMode, name, placeholder, options, onSelect, selectedItems, width, suggestionListWidth, onDropdownStateChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const dropdownHeight = dropdownRef.current
      ? dropdownRef.current.offsetHeight
      : 0;
    onDropdownStateChange(filteredOptions.length > 0, dropdownHeight);
  }, [filteredOptions, onDropdownStateChange]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const filtered = options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase()) && !selectedItems.includes(option)
    );
    setFilteredOptions(filtered);
  };

  const handleSelectOption = (option) => {
    setInputValue('');
    setFilteredOptions([]);
    onSelect(option);
  };

  const handleRemoveSelected = (option) => {
    onSelect(option, true);
  };

  return (
    <div className='GeneralFields-LinkedData' style={{ width: width }}>
      <div className="Search-Select-Field">
        <div className="selected-items-wrapper">
          {selectedItems.map((item, index) => (
            <div className="selected-item-tag" key={index}>
              {item}
              {!isViewMode && (
                <span className="remove-tag" onClick={() => handleRemoveSelected(item)}>×</span>
              )}
            </div>
          ))}

          {!isViewMode && (
            <input
              type="text"
              id={name}
              name={name}
              className='AttributeData-Field'
              placeholder={selectedItems.length === 0 ? placeholder : ''}
              value={inputValue}
              onChange={handleInputChange}
            />
          )}
        </div>

        {filteredOptions.length > 0 && (
          <ul
            ref={dropdownRef}
            className='suggestion-list'
            style={{
              maxWidth: suggestionListWidth || '100%'
            }}
          >
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

export default SearchMultiple;
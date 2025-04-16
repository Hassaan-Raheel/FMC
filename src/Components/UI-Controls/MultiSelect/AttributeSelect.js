import React, { useState } from 'react';
import "../../../Pages/ECommerce/ECommerce.css";
import "./Multiselect.css";

const AttributeSearch = ({ label, name, placeholder, options, onSelect, onDropdownToggle, minheight, selectedItems, width, suggestionListWidth, suggestionHeight, isViewMode = false, }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (e) => {
    if (!isViewMode) {
      const value = e.target.value;
      setInputValue(value);

      const filtered = options.filter(option => {

        return option && typeof option === 'string' && option.toLowerCase().includes(value.toLowerCase()) && !selectedItems.includes(option);
      });

      setFilteredOptions(filtered);

      const dropdownState = filtered.length > 0;
      setIsDropdownOpen(dropdownState);
      onDropdownToggle(dropdownState);
    }
  };

  const handleSelectOption = (option) => {
    if (!isViewMode) {
      setInputValue('');
      setFilteredOptions([]);
      onSelect(option);

      setIsDropdownOpen(false);
      onDropdownToggle(false);
    }
  };

  const handleRemoveSelected = (option) => {
    if (!isViewMode) {
      onSelect(option, true);
    }
  };

  const handleBlur = () => {
    setIsDropdownOpen(false);
    onDropdownToggle(false);
  };

  return (
    <div className='GeneralFields-LinkedData' style={{ width: width, }}>
      <div className="Search-Select-Field">
        <div className="selected-items-wrapper" style={{ minHeight: minheight }}>
          {selectedItems.map((item, index) => (
            <div className="selected-item-tag" key={index}>
              {item}
              <span className="remove-tag" onClick={() => handleRemoveSelected(item)}>×</span>
            </div>
          ))}

          <input
            type="text"
            id={name}
            name={name}
            className='AttributeData-Field'
            placeholder={selectedItems.length === 0 ? placeholder : ''}
            value={inputValue}
            onChange={handleInputChange}
            disabled={isViewMode}
          />
        </div>

        {isDropdownOpen && !isViewMode && (
          <ul 
            className='suggestion-list'
            style={{
              maxWidth: suggestionListWidth || '100%',
              height: suggestionHeight || 'auto'
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

export default AttributeSearch;
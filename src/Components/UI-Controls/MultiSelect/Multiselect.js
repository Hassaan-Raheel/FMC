import React, { useState } from 'react';
import "../../../Pages/ECommerce/ECommerce.css";
import "./Multiselect.css";

const SearchMultiple = ({ label, name, placeholder, options, onSelect, minheight, selectedItems, width, suggestionListWidth, suggestionHeight, isViewMode = false, }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleInputChange = (e) => {
    if (!isViewMode) {
      const value = e.target.value;
      setInputValue(value);

      const filtered = options.filter(option => {
        return option && typeof option === 'string' && option.toLowerCase().includes(value.toLowerCase()) && !selectedItems.includes(option);
      });

      setFilteredOptions(filtered);
    }
  };

  const handleSelectOption = (option) => {
    if (!isViewMode) {
      setInputValue('');
      setFilteredOptions([]);
      onSelect(option);
    }
  };

  const handleRemoveSelected = (option) => {
    if (!isViewMode) {
      onSelect(option, true);
    }
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

        {filteredOptions.length > 0 && !isViewMode && (
          <ul 
            className='suggestion-list'
            style={{
              maxWidth: suggestionListWidth || '100%',
              height: suggestionHeight || '100px'
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

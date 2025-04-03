import React, { useState } from 'react';
import arrowDown from '../../../Assets/Images/dropdown 20 x 20.png'

const categoriesList = [
    'None',
  'Living Room',
  'Bedroom',
  'Mattresses',
  'Dining Room',
  'Outlets',
  'Rugs & Sofas'
];

const MultiSelectCategoryDropDown = () => {
  const [selectedCategories, setSelectedCategories] = useState(['']);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (index) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSelect = (index, category) => {
    const newCategories = [...selectedCategories];
    newCategories[index] = category;
    setSelectedCategories(newCategories);
    setDropdownOpen((prev) => ({ ...prev, [index]: false }));
  };

  const addDropdown = () => {
    setSelectedCategories((prev) => [...prev, '']);
  };

  const deleteDropdown = (index) => {
    setSelectedCategories((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='category-dropdown'>
      {selectedCategories.map((category, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <div style={{ position: 'relative' }}>
            <div className='category-drop-down-head' onClick={() => toggleDropdown(index)}>
            <p> {category || 'Select Category'} </p>
              <img src={arrowDown} alt='arrow-down' />
            </div>
            {dropdownOpen[index] && (
              <div 
                className={`categor-drop-down-items ${dropdownOpen[index] === index ? 'show-drop-down-items' : ''}`}
                >
                {categoriesList.map((cat) => (
                  <p key={cat} onClick={() => handleSelect(index, cat)} style={{ padding: '5px', cursor: 'pointer' }}>
                    {cat}
                  </p>
                ))}
              </div>
            )}
          </div>
          {index > 0 && (
            <button onClick={() => deleteDropdown(index)} style={{ marginLeft: '10px' }}>
              🗑️
            </button>
          )}
        </div>
      ))}
      <button onClick={addDropdown} style={{ marginTop: '10px' }}>
        Add Category
      </button>
    </div>
  );
};

export default MultiSelectCategoryDropDown;
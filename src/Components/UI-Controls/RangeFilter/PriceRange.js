import React from 'react';
import './PriceRange.css';

const PriceRangeFilter = ({
  placeholder,
  value,
  name,
  onChange,
  readOnly,
}) => {
  return (
    <div className="price-range-filter">
      <span className="price-range-text">Under | $</span>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        readOnly={readOnly}
        className="price-range-input"
      />
    </div>
  );
};

export default PriceRangeFilter;

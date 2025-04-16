import React, { useState } from "react";
import "./Search.css";
import { BsSearch } from "react-icons/bs";

const SearchBar = ({ onSearch, icon, placeholder }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder || "Search product by name"}
        className="search-inputField"
        value={searchValue}
        onChange={handleInputChange}
      />
      <button className="search-button" disabled>
        <BsSearch className="search-iconImage" />
      </button>
    </div>
  );
};

export default SearchBar;
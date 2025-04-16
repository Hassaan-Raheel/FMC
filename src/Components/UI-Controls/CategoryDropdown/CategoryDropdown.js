import React, { useState } from 'react'
import './CategoryDropdown.css'
import arrowDown from '../../../Assets/Images/dropdown 20 x 20.png'
import deleteIcon from '../../../Assets/Images/delete-red-icon.png'
import { FiTrash2 } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

const CategoryDropdown = (
    {
        dropdownOpen,
        handleSelect,
        deleteDropdown,
        selectedCategories,
        toggleDropdown,
        selectCategoryData,
        selectedCategoriesFromApi,
    }
) => {

    return (
        <>
            {selectedCategories && selectedCategories.map((category, index) => (
                <div className='category-dropdown-and-delete-icon'>
                    <div className='category-dropdown'>
                        <div className='category-drop-down-head' onClick={() => toggleDropdown(index)}>
                            <p>{category?.name || 'Select Category'}</p>
                            {/* <img src={arrowDown} alt='arrow-down' /> */}
                            <IoIosArrowDown size={15} color='#595959' />
                        </div>
                        <div className={`categor-drop-down-items ${dropdownOpen[index] === true ? 'show-drop-down-items' : ''}`}>
                            {selectCategoryData?.filter(cat => !selectedCategories.some(selected => selected.name === cat.name))
                                .map((cat) => (
                                    <p key={cat.name} onClick={() => handleSelect(index, cat)}>
                                        {cat.name}
                                    </p>
                                ))}
                        </div>
                    </div>
                    {index > 0 && (
                        <button className='delete-button' onClick={() => deleteDropdown(index, category.uid)}>
                            <FiTrash2 size={30} color='var(--delete-color)' />
                        </button>
                    )}
                </div>
            ))}
        </>
    )
}

export default CategoryDropdown

import React, { useEffect, useState } from 'react'
import './ShopByCategory.css'
import CMSHead from '../../UI-Controls/CMSHead/CMSHead';
import CategoryDropdown from '../../UI-Controls/CategoryDropdown/CategoryDropdown';
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import axios from 'axios';
import { Url } from '../../../Services/Api';
import MainLoader from '../../UI-Controls/MainLoader/MainLoader';
import { LuPlus } from 'react-icons/lu';
import AddButton from '../../UI-Controls/AddButton/AddButton';
import SectionLoader from '../../UI-Controls/MainLoader/SectionLoader';

const ShopByCategory = ({handleOpen}) => {
  // All States and variables
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [categoryPayload, setCategoryPayload] = useState({
    "sectional_schema": {
      "shop_by_category": []
    }
  })

  const [selectCategoryData, setSelectedCategoryData] = useState([])

  useEffect(() => {
    const fetchCategoryData = async () => {
      const api = `/api/v1/productCategory/get?parent=0`;
      try {
        const response = await axios.get(`${Url + api}`)
        setSelectedCategoryData(response.data.categories);
      } catch (error) {
        console.error("error fetching categories", error);
      }
    }
    fetchCategoryData()
  }, [])

  // Modal open and close functions
  const handleShowInfoModal = () => {
    setInfoModal(true)
  }
  const handleCloseInfoModal = () => {
    setInfoModal(false);
  }

  // Multi Select
  const toggleDropdown = (index) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const [categoryUid, setCategoryUid] = useState([]);

  useEffect(() => {
    const getSelectedCategories = async () => {
      const api = `/api/v1/content1/get`
      try {
        const response = await axios.get(`${Url + api}`);
        setSelectedCategories(response.data.landingPageContent.sectional_schema.shop_by_category)
      } catch (error) {
        console.log('Error geting selected categories', error);
      }
    }
    getSelectedCategories()
  }, [])

  const handleSelect = (index, category) => {
    const newCategory = [...selectedCategories];
    newCategory[index] = category;
    setSelectedCategories(newCategory);

    setCategoryUid((prevCategoryUid) => {
      const updatedUids = new Set(prevCategoryUid);
      updatedUids.add(category.uid);
      return Array.from(updatedUids);
    });

    setDropdownOpen(false);
  };

  useEffect(() => {
    const initialUids = selectedCategories.map((cat) => cat.uid).filter(Boolean);

    setCategoryUid((prevCategoryUid) => {
      const updatedUids = new Set([...prevCategoryUid, ...initialUids]);
      return Array.from(updatedUids);
    });
  }, [selectedCategories]);

  const addDropdown = () => {
    setSelectedCategories((prev) => [...prev, ''])
  }

  const deleteDropdown = (index, categoryId) => {
    setSelectedCategories((prev) => {
      const updatedCategories = prev.filter((_, i) => i !== index);
      return updatedCategories;
    });

    setCategoryUid((prevCategory) => {
      const updatedUids = prevCategory.filter((uid) => uid !== categoryId);
      return updatedUids;
    });
  }

  const [loading, setLoading] = useState(false);
  const updateCategoryUid = async () => {

    const updatedPayload = {
      sectional_schema: {
        shop_by_category: categoryUid
      },
    };

    setCategoryPayload(updatedPayload);

    const api = `/api/v1/content1/edit`
    try {
      setLoading(true);
      await axios.put(`${Url + api}`, updatedPayload)
        .then(response => console.log("set category succesfull", response))
        .catch(error => console.log("error category updating", error))

        handleOpen('set category successful')
    } catch (error) {
      console.error("error updating categories", error);
      handleOpen('error updating categories')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className='CategoryMainSection'>
        <CMSHead
          heading={'Shop By Category'}
          buttonText={'Save'}
          isButtonVissible={true}
          sendImagesHomeSlider={updateCategoryUid}
          handleShowInfoModal={handleShowInfoModal}
        />
        <div className='CategoryBody'>
          {loading && <SectionLoader />}
          <p className='category-heading'>Select Category</p>
          <div className='category-fropdown-and-button'>
            <CategoryDropdown
              selectCategoryData={selectCategoryData}
              selectedCategories={selectedCategories}
              toggleDropdown={toggleDropdown}
              dropdownOpen={dropdownOpen}
              handleSelect={handleSelect}
              deleteDropdown={deleteDropdown}
            />
            <div className='add-category-btn-div'>
              <AddButton
                handleClick={addDropdown}
                iconShow={true}
                icon={<LuPlus color='#4487C5' size={20} />}
                text={'Add'}
                rowDirection={'row'}
              />
            </div>
          </div>
        </div>
        <InfoPopUp
          showInfoModal={infoModal}
          handleCloseInfoModal={handleCloseInfoModal}
        />
      </div>
  )
}

export default ShopByCategory

/*

import React, { useState, useEffect, useRef } from 'react';
import './CategoryDropdown.css';
import arrowDown from '../../../Assets/Images/dropdown 20 x 20.png';
import deleteIcon from '../../../Assets/Images/delete-red-icon.png';

const CategoryDropdown = ({
  dropdownOpen,
  handleSelect,
  deleteDropdown,
  selectedCategories,
  toggleDropdown,
  selectCategoryData,
}) => {
  const dropdownRefs = useRef([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      dropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          toggleDropdown(index, false); // Close the dropdown if clicked outside
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleDropdown]);

  return (
    <>
      {selectedCategories &&
        selectedCategories.map((category, index) => (
          <div
            className="category-dropdown-and-delete-icon"
            key={index}
            ref={(el) => (dropdownRefs.current[index] = el)} // Assign refs dynamically
          >
            <div className="category-dropdown">
              <div
                className="category-drop-down-head"
                onClick={() => toggleDropdown(index)}
              >
                <p>{category?.name || 'Select Category'}</p>
                <img src={arrowDown} alt="arrow-down" />
              </div>
              <div
                className={`categor-drop-down-items ${
                  dropdownOpen[index] ? 'show-drop-down-items' : ''
                }`}
              >
                {selectCategoryData
                  ?.filter(
                    (cat) =>
                      !selectedCategories.some(
                        (selected) => selected.name === cat.name
                      )
                  )
                  .map((cat) => (
                    <p
                      key={cat.name}
                      onClick={() => handleSelect(index, cat)}
                    >
                      {cat.name}
                    </p>
                  ))}
              </div>
            </div>
            {index > 0 && (
              <button
                className="delete-button"
                onClick={() => deleteDropdown(index, category.uid)}
              >
                <img src={deleteIcon} alt="delete icon" />
              </button>
            )}
          </div>
        ))}
    </>
  );
};

export default CategoryDropdown;

*/
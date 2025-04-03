import React, { useState, useEffect } from 'react'
import './BestSellerSection.css'
import CMSHead from '../../UI-Controls/CMSHead/CMSHead'
import arrowDown from '../../../Assets/Images/dropdown 20 x 20.png';
import uploadImageIcon from '../../../Assets/Images/uploadImg 48 x 48.png'
import ImageGalleryPopup from '../../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Url } from '../../../Services/Api';
import { uploadImage } from '../../../Services/functions';
import deleteIcon from '../../../Assets/Images/delete-red-icon.png'
import { IoClose } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";

import SectionLoader from '../../UI-Controls/MainLoader/SectionLoader';
import GalleryUpload from '../../UI-Controls/GalleryUpload/GalleryUpload';

const BestSellerSection = ({ handleOpen }) => {

  const currentLocation = window.location.pathname
  // For Modal States and variables and Functions
  const [modalView, setModalView] = useState(false);
  const [mediaData, setMediaData] = useState([]);

  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: '',
    title: '',
    description: '',
    usedIn: [],
    link_url: '',
  });

  // get images in gallery modal
  const getApi = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/pages/global/bestseller/get`);
      setMediaData(response.data.media);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getApi();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const api = `${Url}/api/v1/media/pages/global/bestseller/add`

    if (file) {
      setImageSendPayload((prevData) => ({
        ...prevData,
        file: file,
      }));
      setUploadedStates('loading');
      const imagePayloadToSend = new FormData();
      imagePayloadToSend.append('image', file);
      imagePayloadToSend.append('alt_text', imageSendPayload.alt_text);
      imagePayloadToSend.append('title', imageSendPayload.title);
      imagePayloadToSend.append('description', imageSendPayload.description);
      imagePayloadToSend.append('image_url', imageSendPayload.image_url);
      imagePayloadToSend.append('link_url', imageSendPayload.link_url);

      try {
        await uploadImage(imagePayloadToSend, api, setUploadedStates);
        setUploadedStates('success');
        getApi()
      } catch (error) {
        console.error("Image upload failed:", error);
        setUploadedStates('error');
      }

    }
  }

  // For component states and variables
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [clickType, setClickType] = useState('');
  const [selectCategoryData, setSelectedCategoryData] = useState([])

  const [showCategory, setShowCategory] = useState(null);
  const [combinedData, setCombinedData] = useState([]);
  const [infoModal, setInfoModal] = useState(false);
  const [uploadedStatus, setUploadedStates] = useState('');
  const [loading, setLoading] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)


  // GEt Updated Sub Categories Data To show on Ui
  useEffect(() => {
    const fetchData = async () => {
      const api = `/api/v1/sub-category/get`
      try {
        const response = await axios.get(`${Url + api}/${subCategoryData.slug}`);

        const apiResponse = response.data;

        if (apiResponse.bestSelling) {
          setIsEmpty(true);
        }
        setCombinedData(apiResponse)
      } catch (error) {
        console.error("error", error)
      }
    }
    fetchData()
  }, [])

  // Modal open and close functions
  const handleShowInfoModal = () => {
    setInfoModal(true)
  }

  const handleCloseInfoModal = () => {
    setInfoModal(false);
  }

  const handleModalOpen = (type) => {
    setModalView(true)
    setClickType(type)
  }

  const handleModalClose = () => {
    setModalView(false)
  }

  const location = useLocation()
  const subCategoryData = location.state

  // Sub Categories Main Dropdown
  const handleCategoryDropDown = (index) => {
    setShowCategory((prevIndex) => prevIndex === index ? null : index)
  }

  const handleImageSelect = (image) => {
    if (clickType === 'cover-image') {
      setCombinedData((prevState) => ({
        ...prevState,
        bestSelling: {
          ...prevState.bestSelling,
          cover_img: image,
        },
      }));
    } else {
      setCombinedData((prevState) => ({
        ...prevState,
        bestSelling: {
          ...prevState.bestSelling,
          categories: prevState?.bestSelling?.categories.map((category, i) =>
            i === showCategory
              ? { ...category, image: { image_url: image.image_url } }
              : category
          ),
        },
      }));
    }
    setModalView(false);
  };

  const handleInputChange = (e, index) => {
    const newSlugName = e.target.value;

    setCombinedData((prevState) => ({
      ...prevState,
      slugName: subCategoryData?.slug,
      bestSelling: {
        ...prevState.bestSelling,
        categories: prevState?.bestSelling?.categories.map((category, i) =>
          i === index ? { ...category, Heading: newSlugName } : category
        ),
      },
    }));
  };

  // Get sub category data
  useEffect(() => {
    const fetchCategoryData = async () => {
      const api = `/api/v1/productCategory/get?parent=${subCategoryData.id}`;
      try {
        const response = await axios.get(`${Url + api}`)
        setSelectedCategoryData(response.data.categories);
      } catch (error) {
        console.error("error fetching categories", error);
      }
    }
    fetchCategoryData()
  }, [])

  const handleShowCategoryDropdown = () => {
    setIsCategoryOpen((prevState) => prevState === true ? false : true);
  }

  const handleCategoryData = (item, index) => {
    setIsCategoryOpen(false);

    setCombinedData((prevState) => {
      if (!prevState.bestSelling || !Array.isArray(prevState.bestSelling.categories)) {
        console.error("Invalid categories structure");
        return prevState; // Prevent state corruption
      }

      return {
        ...prevState,
        bestSelling: {
          ...prevState.bestSelling,
          categories: prevState.bestSelling.categories.map((category, i) =>
            category && i === index
              ? {
                ...category,
                slug: item.slug
              }
              : category
          ),
        },
      };

    });
  };

  const addCategory = () => {
    const newCategory = {
      Heading: "",
      image: {
        image_url: "",
      },
      slug: ""
    };

    setCombinedData((prevState) => ({
      ...prevState,
      bestSelling: {
        ...prevState.bestSelling,
        categories: [
          ...(prevState?.bestSelling?.categories || []), // Ensure it's an array
          newCategory
        ],
      },
    }));
  };

  const deleteCategory = (item) => {
    setCombinedData((prevState) => ({
      ...prevState,
      bestSelling: {
        ...prevState.bestSelling,
        categories: prevState.bestSelling.categories.filter((category) => category.slug !== item.slug)
      }
    }))
  }

  const deleteCategoryImage = (item) => {

    setCombinedData((prevState) => ({
      ...prevState,
      bestSelling: {
        ...prevState.bestSelling,
        categories: prevState.bestSelling.categories.map((category) =>
          category.slug === item.slug
            ? {
              ...category,
              image: {
                ...category.image,
                image_url: '', // Clear the image_url
              },
            }
            : category
        ),
      },
    }));
  }

  const deleteCategoryMainBanner = (Url) => {
    setCombinedData((prevState) => ({
      ...prevState,
      bestSelling: {
        ...prevState.bestSelling,
        cover_img: {
          image_url: ''
        }
      }
    }))
  }

  // Update new data into Sub Categories
  const handleSaveBestSeller = async () => {
    const api = `/api/v1/sub-category/edit`
    const updatedPayload = {
      slugName: combinedData.slugName,
      bestSelling: {
        cover_img: combinedData.bestSelling.cover_img,
        categories: combinedData.bestSelling.categories
      }
    };

    try {
      setLoading(true)
      const response = await axios.put(`${Url + api}`, updatedPayload)

      if (response.status === 200) {
        handleOpen('Best Seller Update Successfully');
      } else if (response.status === 400 || response.status === 404) {
        handleOpen('Best Seller Update Failed');
      }
    } catch (error) {
      setLoading(false)
      console.log("error sending best seller", error);
    } finally {
      setLoading(false)
    }
  }


  return (
    <div>
      <CMSHead
        heading={"Best Seller"}
        buttonText={"Save"}
        isButtonVissible={true}
        sendImagesHomeSlider={handleSaveBestSeller}
        handleShowInfoModal={handleShowInfoModal}
      />

      <div className='best-seller-category'>
        {loading && <SectionLoader />}
        <div className='best-seller-inner-section'>
          {combinedData?.bestSelling?.categories.map((item, index) => (
            <div className='best-seller-dropdown-main'>
              <div className='best-seller-dropdown-head-and-delete-button'>
                <div className='best-seller-drop-down-head' onClick={() => handleCategoryDropDown(index)}>
                  <p>{combinedData?.bestSelling?.categories?.[index]?.Heading ?? 'Add Category'}</p>
                  <img src={arrowDown} alt='arrow-down' />
                </div>
                {combinedData.bestSelling.categories.length > 1 && (
                  <button className='drop-down-delete-btn' onClick={() => deleteCategory(item)}>
                    {/* <img src={deleteIcon} alt='delete btn' /> */}
                    <FiTrash2 size={20} color='var(--delete-color)' />
                  </button>
                )}
              </div>
              <div className={`best-seller-dropdown-body ${showCategory === index ? 'show-category' : ''}`}>
                <div className='best-seller-dropdown-containt'>
                  {combinedData?.bestSelling?.categories?.[index]?.image?.image_url === '' ? (
                    
                    <GalleryUpload 
                      fontSize='8px'
                      openModal={() => handleModalOpen('category-image')}
                    />
                  ) : (
                    <div className='best-seller-product-main-image-container'>
                      <button className='best-seller-img-delete-btn' onClick={() => deleteCategoryImage(item)}>
                        <IoClose size={15} color='#595959' />
                      </button>
                      <img src={`${Url + combinedData?.bestSelling?.categories?.[index]?.image?.image_url}`} alt='text' className='best-seller-selected-image' />
                    </div>
                  )}

                  <div className='best-seller-dropdown-inputs-div'>
                    <input
                      type='text'
                      placeholder='Text'
                      className='best-seller-category-title-input'
                      value={combinedData?.bestSelling?.categories?.[index]?.Heading}
                      onChange={(e) => handleInputChange(e, index)} // Update title state 
                    />
                    <div className='category-dropdown' >
                      <div className='category-drop-down-head' onClick={handleShowCategoryDropdown}>
                        <p className='select-category-heading'>{combinedData?.bestSelling?.categories?.[index]?.slug !== '' ? combinedData?.bestSelling?.categories?.[index]?.slug : 'Select Category'}</p>
                        <img src={arrowDown} alt='arrow down' />
                      </div>
                      <div className={`categor-drop-down-items ${isCategoryOpen ? 'show-drop-down-items' : ''}`}>
                        {selectCategoryData.map((item, innerIndex) => (
                          <p key={innerIndex} onClick={() => handleCategoryData(item, index)}>
                            {item.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className='best-seller-category-btn'>
            <button onClick={addCategory}>
              + add
            </button>
          </div>
        </div>

        {currentLocation !== '/Pages/Home' ? (
          <div className='best-seller-cover-image-main-container'>
            {!combinedData?.bestSelling?.cover_img || combinedData?.bestSelling?.cover_img?.image_url === '' ? (
              // <div className='best-seller-cover-image-upload-icon-div' onClick={() => handleModalOpen('cover-image')}>
              //   <img src={uploadImageIcon} alt='upload' />
              // </div>
              <GalleryUpload 
                openModal={() => handleModalOpen('cover-image')}
              />
            ) : (
              <div className='best-seller-product-main-banner-container'>
                <button className='best-seller-banner-delete-btn' onClick={() => deleteCategoryMainBanner(combinedData?.bestSelling?.cover_img?.image_url)}>
                  <IoClose size={15} color='#595959' />
                </button>
                <img src={`${Url + combinedData?.bestSelling?.cover_img?.image_url}`} alt='alt' className='best-seller-cover-image' />
              </div>

            )}

          </div>
        ) : <></>}

      </div>

      <ImageGalleryPopup
        showImageGalleryPopUp={modalView}
        handleModalView={handleModalClose}
        onImageSelect={handleImageSelect}
        imageSendPayload={imageSendPayload}
        setImageSendPayload={setImageSendPayload}
        alt_text={imageSendPayload.alt_text}
        title={imageSendPayload.title}
        handleFileChange={handleFileChange}
        data={mediaData}
      />
      <InfoPopUp
        showInfoModal={infoModal}
        handleCloseInfoModal={handleCloseInfoModal}
      />
    </div>
  )
}

export default BestSellerSection

import React, { useEffect, useState } from 'react'
import './FurnitureForBudget.css'
import CMSHead from '../../UI-Controls/CMSHead/CMSHead'
import uploadImageIcon from '../../../Assets/Images/uploadImg 48 x 48.png';
// import CategoryDropdown from '../../UI-Controls/CategoryDropdown/CategoryDropdown';
import ImageGalleryPopup from '../../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import arrowDown from '../../../Assets/Images/dropdown 20 x 20.png'
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { Url } from '../../../Services/Api';
import { uploadImage } from '../../../Services/functions';
import FurnitureForBudgetShimmer from '../Shimmers/FurnitureForBudgetShimmer/FurnitureForBudgetShimmer';
import SectionLoader from '../../UI-Controls/MainLoader/SectionLoader';
import GalleryUpload from '../../UI-Controls/GalleryUpload/GalleryUpload';

const FurnitureForBudget = ({handleOpen}) => {

  const [modalView, setModalView] = useState(false);
  const [selectedImage, setSelectedImage] = useState([])
  const [furniturePrice, setFurniturePrice] = useState();
  const [infoModal, setInfoModal] = useState(false);
  const [uploadedStatus, setUploadedStates] = useState('');
  const [mediaDeta, setMediaData] = useState([])
  const [budgetCategory, setbudgetCategory] = useState(null)
  const [selectCategoryData, setSelectCategoryData] = useState([])
  // const [budgetPayload, setbudgetPayload] = useState({})

  const [budgetPayload, setBudgetPayload] = useState({
    "sectional_schema": {
      "furniture_for_every_budget": [
        {
          "img": '',
          "sale": '',
          "shopNow": "Shop now",
          "uid": 0,
          "max_price": 0,
          "category": ''
        },
        {
          "img": '',
          "sale": '',
          "shopNow": "Shop now",
          "uid": 0,
          "max_price": 0,
          "category": ''
        },
        {
          "img": '',
          "sale": '',
          "shopNow": "Shop now",
          "uid": 0,
          "max_price": 0,
          "category": ''
        }
      ]
    }
  })
  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: '',
    title: '',
    description: '',
    link_url: '',
  });

  // Modal open and close functions
  const handleShowInfoModal = () => {
    setInfoModal(true)
  }
  const handleCloseInfoModal = () => {
    setInfoModal(false);
  }

  // Gallery popup open
  const [imgIndex, setImgIndex] = useState(null)
  const handleModalOpen = (index) => {
    setModalView(true)
    setImgIndex(index)
  }
  const handleModalClose = () => {
    setModalView(false)
  }

  // upload file in gallery modal media
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const api = `${Url}/api/v1/media/global/add`

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
        getFurnitureForEveryBudgetImages()
      } catch (error) {
        console.error("Image upload failed:", error);
        setUploadedStates('error');
      }

    }
  }

  // get images in gallery modal
  const getFurnitureForEveryBudgetImages = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/global/get`);
      setMediaData(response.data.media)
    } catch (error) {
      console.error('Error', error);
    }
  }
  useEffect(() => {
    getFurnitureForEveryBudgetImages()
  }, [])

  // get images CMS 
  const handleImageSelect = (image) => {
    setSelectedImage(image)

    setBudgetPayload((prevState) => ({
      ...prevState,
      sectional_schema: {
        ...prevState.sectional_schema,
        // img: image.image_url
        furniture_for_every_budget: prevState.sectional_schema.furniture_for_every_budget.map((selectedImage, i) =>
          i === imgIndex ? { ...selectedImage, img: image.image_url } : selectedImage
        )
      }
    }))
    setModalView(false);
  };

  // open category dropdown according to index
  const handleBudgetCategory = (index) => {
    setbudgetCategory((prevInd) => prevInd === index ? null : index);
  }

  // get categories from api
  useEffect(() => {
    const fetchCategoryForBudget = async () => {
      const api = `/api/v1/productCategory/get?parent=0`;
      try {
        const response = await axios.get(`${Url + api}`);
        console.log("check selected category", response.data)
        setSelectCategoryData(response.data.categories);
      } catch (error) {
        console.error("Error geting categories", error);
      }
    }
    fetchCategoryForBudget()
  }, [])



  // set selected category on budget payload
  const handleCategoryData = (item, ind) => {

    setBudgetPayload((prevState) => ({
      ...prevState,
      sectional_schema: {
        ...prevState.sectional_schema,
        furniture_for_every_budget: prevState.sectional_schema.furniture_for_every_budget.map((entry, index) =>
          index === ind
            ? {
              ...entry,
              category: item.slug,
              uid: item.uid
            } : entry
        ),

      },
    }));


    setbudgetCategory(null);
  };



  // set price and name on payload
  const handlePriceChange = (e, index, field) => {
    const newValue = e.target.value;
    const updatedValue = field === 'max_price' ? parseFloat(newValue) : newValue;


    setBudgetPayload(prevState => {
      const updatedFurnitureBudget = [...prevState.sectional_schema.furniture_for_every_budget];

      updatedFurnitureBudget[index] = {
        ...updatedFurnitureBudget[index],
        [field]: updatedValue
      };

      return {
        ...prevState,
        sectional_schema: {
          ...prevState.sectional_schema,
          furniture_for_every_budget: updatedFurnitureBudget
        }
      };

    });
  };

  // get payload of furniture for every budget


  useEffect(() => {
    console.log("budget payload", budgetPayload)
  }, [budgetPayload])

  // update new product on furniture for every budget
  const [loading, setLoading] = useState(false)
  const updateFurnitureForEveryBudget = async () => {
    // console.log("before budget response", combinedState)
    const api = `/api/v1/content1/edit`
    try {
      setLoading(true)
      await axios.put(`${Url + api}`, {
        sectional_schema: {
          furniture_for_every_budget: budgetPayload.sectional_schema.furniture_for_every_budget
        }
      })
        .then(response => {
          handleOpen("Furniture For Budget Data Update")
        })
        .catch(error => {
          console.log("error updating products", error)
          handleOpen("Eror Updating Furniture ")
        })
        
    } catch (error) {
      console.error("updating products failed", error);
      handleOpen("UnExpected Server Error")
    }
    setLoading(false)
  }

  const [focus, setFocus] = useState(null)
  const handleChangeValueType = (index) => {
    setFocus(index)
  }
  const handleFocusOut = () => {
    setFocus(null)
  }

  const handleDelete = (index) => {
    setBudgetPayload((prevState) => {
      const updatedBudget = prevState.sectional_schema.furniture_for_every_budget.map((entry, idx) => {
        if (idx === index) {
          return { ...entry, img: '' }; // Remove the image for the specific index
        }
        return entry;
      });
      return {
        ...prevState,
        sectional_schema: {
          ...prevState.sectional_schema,
          furniture_for_every_budget: updatedBudget,
        },
      };
    });
  }

  const [combinedState, setCommbinedState] = useState(budgetPayload)

  useEffect(() => {
    const getFurnitureForEveryBudgetProducts = async () => {
      const api = `/api/v1/content1/get`
      try {
        const response = await axios.get(`${Url + api}`)
        setBudgetPayload(response.data.landingPageContent)
        const apiData = response.data.landingPageContent

        // console.log("api data on var" , apiData)

        if (apiData?.sectional_schema?.furniture_for_every_budget?.length > 0) {
          // Merge the data from API with the default payload
          const mergedData = {
            ...budgetPayload,
            sectional_schema: {
              ...budgetPayload.sectional_schema,
              furniture_for_every_budget: apiData.sectional_schema.furniture_for_every_budget
            }
          };
          setCommbinedState(mergedData)
        } else {
          setCommbinedState(budgetPayload);
        }

        // setBudgetPayload(response.data.landingPageContent)
        // setbudgetPayload(response.data.landingPageContent);
        // console.log("get response", response.data.landingPageContent)
      } catch (error) {
        console.log("error geting products", error);
      }
    }
    getFurnitureForEveryBudgetProducts()
  }, [])


  
  useEffect(() => {console.log("selected Category Data", selectCategoryData)}, [selectCategoryData])

  return (
    <div>
      
      <CMSHead
        heading={"Furniturre For Every Budget"}
        buttonText={"Save"}
        isButtonVissible={true}
        handleShowInfoModal={handleShowInfoModal}
        sendImagesHomeSlider={updateFurnitureForEveryBudget}
      />
      {budgetPayload !== null ? (
        <div className='furniture-for-budget-main-container'>
          {loading && <SectionLoader />}
          <div className='furniture-for-budget-cards-container'>
            {[0, 1, 2].map((_, index) => (
              <div className='furniture-for-budget-card'>
                <div className='furniture-for-budget-image-upload-main-div'>
                  {budgetPayload?.sectional_schema?.furniture_for_every_budget?.[index]?.img ? (
                    <div className='furniture-for-budget-product-main-image-container'>
                      <button className='furniture-for-budget-img-delete-btn' onClick={() => handleDelete(index)} >
                        <IoClose size={15} color='#595959' />
                      </button>
                      <img className='furniture-for-budget-main-image' src={`${Url + budgetPayload?.sectional_schema?.furniture_for_every_budget?.[index]?.img}`} alt='main' />
                    </div>
                  ) : (
                    <GalleryUpload 
                      openModal={() => handleModalOpen(index)}
                    />
                  )}

                </div>
                <div className='furniture-for-budget-card-footer'>
                  <div className='category-dropdown'>
                    <div className='category-drop-down-head' onClick={() => handleBudgetCategory(index)}>
                      <p className='select-category-heading'>{budgetPayload.length !== 0 ? budgetPayload?.sectional_schema?.furniture_for_every_budget?.[index]?.category : 'Select Category'}</p>
                      <img src={arrowDown} alt='arrow down' />
                    </div>
                    <div className={`categor-drop-down-items ${budgetCategory === index ? 'show-drop-down-items' : ''}`}>
                      {selectCategoryData.map((item, innerIndex) => (
                        <p key={innerIndex} onClick={() => handleCategoryData(item, index)}>
                          {item.name}
                        </p>
                      ))}
                    </div>
                  </div>
                  <input
                    type='text'
                    placeholder='Price($)'
                    className='furniture-for-budget-price'
                    onFocus={() => handleChangeValueType(index)}
                    onBlur={() => handleFocusOut(index)}
                    // value={apiData.length !== 0 ? apiData.sectional_schema.furniture_for_every_budget[index].max_price : budgetPayload.sectional_schema.furniture_for_every_budget[index].max_price}
                    value={budgetPayload.sectional_schema?.furniture_for_every_budget?.[index]?.max_price || 0}
                    onChange={(e) => handlePriceChange(e, index, 'max_price')}
                  />
                  <input
                    type='text'
                    placeholder='Name'
                    className='furniture-for-budget-price'
                    // value={apiData.length !== 0 ? apiData.sectional_schema.furniture_for_every_budget[index].sale : budgetPayload.sectional_schema.furniture_for_every_budget[index].sale}
                    value={budgetPayload?.sectional_schema?.furniture_for_every_budget?.[index]?.sale}
                    onChange={(e) => handlePriceChange(e, index, 'sale')}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <FurnitureForBudgetShimmer />
      )}

      <ImageGalleryPopup
        showImageGalleryPopUp={modalView}
        handleModalView={handleModalClose}
        onImageSelect={handleImageSelect}
        imageSendPayload={imageSendPayload}
        data={mediaDeta}
        setImageSendPayload={setImageSendPayload}
        alt_text={imageSendPayload.alt_text}
        title={imageSendPayload.title}
        handleFileChange={handleFileChange}
      />
      <InfoPopUp
        showInfoModal={infoModal}
        handleCloseInfoModal={handleCloseInfoModal}
      />
    </div>
  )
}

export default FurnitureForBudget




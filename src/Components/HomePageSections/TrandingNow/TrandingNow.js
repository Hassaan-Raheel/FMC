import React, { useEffect, useState } from 'react'
import './TrandingNow.css';
import CMSHead from '../../UI-Controls/CMSHead/CMSHead';
import imageUploadIcon from '../../../Assets/Images/uploadImg 48 x 48.png';
import ImageGalleryPopup from '../../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import { Url } from '../../../Services/Api';
import { uploadImage } from '../../../Services/functions';
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import TrendingShimmer from '../Shimmers/TrandingNowShimmer/TrandingShimmer';
import AddButton from '../../UI-Controls/AddButton/AddButton';
import { LuPlus } from 'react-icons/lu';
import SectionLoader from '../../UI-Controls/MainLoader/SectionLoader';
import GalleryUpload from '../../UI-Controls/GalleryUpload/GalleryUpload';

const TrandingNow = ({ handleOpen }) => {
  const [modalView, setModalView] = useState(false);
  const [uploadedStatus, setUploadedStates] = useState('');
  const [trandingNowMainImageIndex, setTrandingNowMainImageIndex] = useState(0);
  const [mediaDeta, setMediaData] = useState([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  // const [subImagesData, setSubImagesData] = useState(Array(6).fill(null));
  const [clickedType, setClickedType] = useState('')
  const [infoModal, setInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [trendingPayload, setTrendingPayload] = useState({
    data: {
      product_1: {},
      product_2: {},
      product_3: {},
      product_4: {},
      product_5: {},
      product_6: {},
      sliders: [],
    }
  })

  // modal open and close functions
  const handleShowInfoModal = () => {
    setInfoModal(true)
  }
  const handleCloseInfoModal = () => {
    setInfoModal(false);
  }

  const handleSliderImageDelete = (id) => {
    const filteredImages = trendingPayload.data.sliders.filter((item) => item._id !== id)
    
    setTrendingPayload((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        sliders: filteredImages
      }
    }))
  }

  const handleSubImageDelete = (id) => {

    setTrendingPayload((prevData) => {
      const updatedData = { ...prevData.data };

      Object.keys(updatedData).forEach((key) => {
        if (updatedData[key]?._id === id) {
          updatedData[key] = {};
        }
      });
      return {
        ...prevData,
        data: updatedData
      }
    })

  };

  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: '',
    title: '',
    description: '',
    link_url: '',
  });

  // upload image to tranding now media 
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const api = `${Url}/api/v1/media/pages/home/trending/add`

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
        getTrandingNowMediaImages()
      } catch (error) {
        console.error("Image upload failed:", error);
        setUploadedStates('error');
      }

    }
  }

  const handleImageSelect = (selectedImage) => {

    if (clickedType === 'slider') {
      setTrendingPayload((prevData) => ({
        ...prevData,
        data: {
          ...prevData.data,
          sliders: [...(prevData.data.sliders || []), selectedImage]
        }
      }))
    } else {
      setTrendingPayload((prevData) => ({
        ...prevData,
        data: {
          ...prevData.data,
          [clickedType]: selectedImage
        }
      }))
    }

    setModalView(false);
  }

  const getTrandingNowMediaImages = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/pages/home/trending/get`);
      setMediaData(response.data.data)

    } catch (error) {
      console.error('Error', error);
    }
  }
  useEffect(() => {
    getTrandingNowMediaImages()
  }, [])

  // get cms data to check if its empty or not

  const getTrendingNowCMSData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${Url}/api/v1/pages/home/trending-now/get`);
      
      if (response.data && response.data.data.length === 0) {
      } else if (response.data && response.data.data) {
        setTrendingPayload((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            ...response.data.data,
          }
        }));

      }
    } catch (error) {
      console.error("error checking cms data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTrendingNowCMSData();
  }, []);

  const sendTrendingNowData = async () => {
    // const trandingNowApi = `${Url}/api/v1/pages/home/trending-now/add`;
    const trandingNowApi = `${Url}/api/v1/pages/home/trending-now/add-update`
    try {
      setIsLoading(true)
      const response = await axios.post(trandingNowApi, trendingPayload.data);
      if (response.status === 200) {
        handleOpen("update trending now data successfully");
        
      }
    } catch (error) {
      console.error("error", error);
      handleOpen("UnExpected Server Error", error);
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  // handle modal open and close
  const handleModalOpen = (index = null) => {
    setSelectedImageIndex(index);
    setModalView(true);
  }

  const handleModalClose = () => {
    setModalView(false)
  }

  return (
    <div className='tranding-now-main-container'>
      
      <CMSHead
        heading={"Trending Now"}
        buttonText={"Save"}
        isButtonVissible={true}
        sendImagesHomeSlider={sendTrendingNowData}
        handleShowInfoModal={handleShowInfoModal}
      />

      {!loading ? (
        <div className='tranding-now-body-top'>
          {isLoading && <SectionLoader />}
          <div className='tranding-now-body-main-container'>
            <div className='tranding-now-main-image-slider'>
              {trendingPayload?.data?.sliders?.length > 0 ? (
                <div className='tranding-now-slider-container'>
                  <div className='tranding-now-slider'
                    style={{
                      transform: `translateX(-${trandingNowMainImageIndex * 100}%)`,
                      transition: 'transform 0.5s ease'
                    }}
                  >
                    {trendingPayload?.data?.sliders.map((image, index) => (
                      <div
                        className={`tranding-now-slide ${index === trandingNowMainImageIndex ? 'active' : ''}`}
                        key={index}
                      >
                        <div className='tranding-now-slider-body-selected-images-slider'>
                          <button
                            className='image-slider-image-delete'
                            onClick={() => handleSliderImageDelete(image._id)}
                          >
                            <IoClose size={15} color='#595959' />
                          </button>
                          <img
                            src={`${Url + image.image_url}`}
                            alt={`Selected ${index + 1}`}
                            className='tranding-now-image-slider-image'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='tranding-now-pagination-dots'>
                    <div className='pagi-dots'>
                      {trendingPayload?.data?.sliders.map((_, index) => (
                        <span
                          key={index}
                          className={`dot ${index === trandingNowMainImageIndex ? 'active' : ''}`}
                          onClick={() => setTrandingNowMainImageIndex(index)}
                        />
                      ))}
                    </div>
                    <div className='add-image-button-container'>
                      {/* <button onClick={() => handleModalOpen(null)}>+ Add</button> */}
                      <AddButton
                        iconShow={true}
                        handleClick={() => handleModalOpen(null)}
                        text={'Add'}
                        icon={<LuPlus color='#4487C5' size={20} />}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // <div
                //   className='tranding-now-main-image-upload'
                //   onClick={() => { handleModalOpen(null); setClickedType('slider') }}
                // >
                //   <img
                //     src={imageUploadIcon}
                //     alt='image-upload'
                //   />
                // </div>
                <GalleryUpload 
                  openModal={() => { handleModalOpen(null); setClickedType('slider') }}
                />

              )}
            </div>
            <div className='tranding-now-sub-images'>

              {Array.from({ length: 6 }).map((_, index) => {
                const product = trendingPayload?.data[`product_${index + 1}`];

                return Object.keys(product)?.length > 0 ? (
                  <div className='sub-image-single-show' key={index}>
                    <button className='close-sub-image-btn'
                      onClick={() => handleSubImageDelete(product._id)}
                    >
                      <IoClose size={15} color='#595959' />
                    </button>
                    <img
                      src={`${Url + product.image_url}`}
                      alt={product.alt_text || `Product ${index + 1}`}
                      className='product-sub-image'
                    />
                  </div>
                ) : (
                  // Show upload icon if the product is null
                  <div className='sub-image-single-show' key={index} >
                    {/* <img
                      src={imageUploadIcon}
                      alt={`Upload ${index + 1}`}
                      className='product-sub-upload-image'
                    /> */}
                    <GalleryUpload 
                      width='100%'
                      height='100%'
                      fontSize='10px'
                      openModal={() => { handleModalOpen(index); setClickedType(`product_${index + 1}`) }}
                    />
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      ) : (
        <TrendingShimmer />
      )}


      <ImageGalleryPopup
        showImageGalleryPopUp={modalView}
        handleModalView={handleModalClose}
        handleFileChange={handleFileChange}
        onImageSelect={handleImageSelect}
        imageSendPayload={imageSendPayload}
        data={mediaDeta}
        setImageSendPayload={setImageSendPayload}
        editGalleryImageApi={`/api/v1/media/pages/home/trending/`}
      />
      <InfoPopUp
        showInfoModal={infoModal}
        handleCloseInfoModal={handleCloseInfoModal}
      />
    </div>
  )
}

export default TrandingNow

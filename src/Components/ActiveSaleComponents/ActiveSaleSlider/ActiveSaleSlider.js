import React, { useState, useEffect } from 'react'
import './ActiveSaleSlider.css'

// Assets
import loaderOne from '../../../Assets/Images/loader.gif'
import imageIcon from '../../../Assets/Images/uploadImg 48 x 48.png'
import addBtn from '../../../Assets/Images/add-btn-charcol.png'
import crossButton from '../../../Assets/Images/cross-button-32-X-32.png'
import { IoClose } from "react-icons/io5";

// util functions
import { Url } from '../../../Services/Api';
import { uploadImage } from '../../../Services/functions';
import { useActiveSale } from '../../../Context/active-sale-context/ActiveSaleContext';
import axios from 'axios';

// Components
import MainLoader from '../../UI-Controls/MainLoader/MainLoader';
import ImageGalleryPopup from '../../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import CMSHead from '../../UI-Controls/CMSHead/CMSHead'
import GalleryUpload from '../../UI-Controls/GalleryUpload/GalleryUpload'

const ActiveSaleSlider = () => {

  // All States and variables here
  const [infoModal, setInfoModal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [loading, setLoading] = useState()
  const [uploadedStatus, setUploadedStates] = useState('');
  const [data, setData] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0);
  const { activeSalePayload, setActiveSalePayload } = useActiveSale();
  const [viewPort, setViewPort] = useState('desktop')
  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: '',
    title: '',
    description: '',
    link_url: '',
  })


  // Gallery modal
  const handleModalOpen = () => {
    setModalView(true)
  }
  const handleModalClose = () => {
    setModalView(false)
  }

  // info modal
  const handeShowInfoModal = () => {
    setInfoModal(true)
  }
  const handleCloseInfoModal = () => {
    setInfoModal(false);
  }

  // get image for home slider media 
  const getApi = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/pages/home/slider/get`);
      setData(response.data.homeSliders)
    } catch (error) {
      console.log(error);
    } finally {
    }
  }
  useEffect(() => {
    getApi()
  }, [])

  // Add Images into slider Media
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const api = `${Url}/api/v1/media/pages/home/slider/add`

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
      await uploadImage(imagePayloadToSend, api, setUploadedStates)

      getApi();
    }
  }

  const handleViewPort = (view) => {
    setViewPort(view)
    setCurrentIndex(currentIndex)
  }

  // get images in homepage slider 
  const handleImageSelect = (image) => {

    setActiveSalePayload((prevSlider) => ({
      ...prevSlider,
      mainSlider: {
        ...prevSlider.mainSlider,
        [viewPort]: [
          ...(prevSlider.mainSlider[viewPort] || []),
          image
        ]
      }
    }))

    setModalView(false);
  };

  const handleImageDelete = (id, index) => {
    setActiveSalePayload((prevState) => {
      const viewKey = viewPort === 'desktop' ? 'desktop' : 'mobile';

      return {
        ...prevState,
        mainSlider: {
          ...prevState.mainSlider,
          [viewKey]: prevState.mainSlider[viewKey].filter((image) => image._id !== id),
        },
      };
    });

    setCurrentIndex(index === 0 ? 0 : index - 1);
  }

  const [selectedTab, setSelectedTab] = useState('desktop')

  const showTab = (tab) => {
    if (tab === 'mobile') {
      setSelectedTab('mobile')
      handleViewPort('mobile')
    } else {
      setSelectedTab('desktop')
      handleViewPort('desktop')
    }
  }

  const handleShowInfoModal = () => {
    setInfoModal(true)
  }

  useEffect(() => {console.log("active sale payload", activeSalePayload)}, [activeSalePayload])

  return (
    <div className='SlderMainSection'>
      {loading && <MainLoader loaderGif={loaderOne} />}
      <CMSHead
        heading={'Sale Slider'}
        showIcons={true}
        handleShowTab={showTab}
        tabValue={selectedTab}
        isButtonVissible={false}
        handleShowInfoModal={handleShowInfoModal}
      />

      {
        viewPort === 'desktop' ?
          (
            <div className='SliderBody'>
              {activeSalePayload?.mainSlider?.desktop?.length > 0 ? (  // Check if no images are selected
                <div className='slider-container'>
                  <div className='sale-slider'
                    style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease' }}
                  >
                    {activeSalePayload?.mainSlider?.desktop.map((image, index) => (
                      <div
                        className={`slide ${index === currentIndex ? 'active' : ''}`}
                        key={index}
                      >
                        <div className='SliderBodySelectedImagesSlider'>
                          <button className='image-slider-image-delete' onClick={() => handleImageDelete(image._id, index)}>
                            <IoClose size={15} color='#595959' />
                          </button>
                          <img src={`${Url+image.image_url}`} alt={`Selected ${index + 1}`} className='image-slider-image' />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // <div className='upload-image-section'>
                //   <p>Add Image</p>
                //   <div className='image-icon-div' onClick={handleModalOpen}>
                //     <img src={imageIcon} alt='img' />
                //   </div>
                // </div>
                <GalleryUpload 
                  openModal={handleModalOpen}
                />
              )}
              <div className={`SliderAddNewImageBtnDiv ${activeSalePayload?.mainSlider?.desktop?.length === 0 ? 'show-add-more-btn' : ''}`}>
                <div className='pagination-dots-container'>
                  <div className='pagination'>
                    {activeSalePayload?.mainSlider?.desktop?.map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                      ></button>
                    ))}
                  </div>
                </div>
                <button className='add-new-image-btn' onClick={() => setModalView(true)}>
                  <img src={addBtn} alt='add-image' />
                  Add
                </button>
              </div>
            </div>
          )
          : (
            <div className='SliderBody'>
              {activeSalePayload?.mainSlider?.mobile?.length === 0 ? (  // Check if no images are selected
                // <div className='upload-image-section'>
                //   <p>Add Image</p>
                //   <div className='image-icon-div' onClick={handleModalOpen}>
                //     <img src={imageIcon} alt='img' />
                //   </div>
                // </div>
                <GalleryUpload 
                  openModal={handleModalOpen}
                />
              ) : (
                <div className='slider-container'>
                  <div className='sale-slider'
                    style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease' }}
                  >
                    {activeSalePayload?.mainSlider?.mobile.map((image, index) => (
                      <div
                        className={`slide ${index === currentIndex ? 'active' : ''}`}
                        key={index}
                      >
                        <div className='SliderBodySelectedImagesSlider'>
                          <button className='image-slider-image-delete' onClick={() => handleImageDelete(image._id, index)}>
                            <IoClose size={15} color='#595959' />
                          </button>
                          <img src={`${Url+image.image_url}`} alt={`Selected ${index + 1}`} className='image-slider-image' />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className={`SliderAddNewImageBtnDiv ${activeSalePayload?.mainSlider?.mobile?.length === 0 ? 'show-add-more-btn' : ''}`}>
                <div className='pagination-dots-container'>
                  <div className='pagination'>
                    {activeSalePayload?.mainSlider?.mobile.map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                      ></button>
                    ))}
                  </div>
                </div>
                <button className='add-new-image-btn' onClick={() => setModalView(true)}>
                  <img src={addBtn} alt='add-image' />
                  Add
                </button>
              </div>
            </div>
        )
      }

      <ImageGalleryPopup
        showImageGalleryPopUp={modalView}
        handleModalView={handleModalClose}
        onImageSelect={handleImageSelect}
        imageSendPayload={imageSendPayload}
        setImageSendPayload={setImageSendPayload}
        alt_text={imageSendPayload.alt_text}
        title={imageSendPayload.title}
        data={data}
        editGalleryImageApi={`/api/v1/media/pages/home/slider/`}
        handleFileChange={handleFileChange}
      />
      <InfoPopUp
        showInfoModal={infoModal}
        handleCloseInfoModal={handleCloseInfoModal}
      />
    </div>
  )
}

export default ActiveSaleSlider


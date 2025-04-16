import React, { useState, useEffect } from 'react'
import './HomePageSlider.css'
import axios from 'axios';

// icons and images
import loaderOne from '../../../Assets/Images/loader.gif'

// util functions
import { Url } from '../../../Services/Api';
import { uploadImage } from '../../../Services/functions';

// Components
import MainLoader from '../../UI-Controls/MainLoader/MainLoader';
import CMSHead from '../../UI-Controls/CMSHead/CMSHead';
// import CMSBody from '../../CMSBody/CMSBody';
import ImageGalleryPopup from '../../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import CMSBody from '../../CMSBody/CMSBody';
import SmallSlider from '../SmallSlider/SmallSlider';
import SectionLoader from '../../UI-Controls/MainLoader/SectionLoader';

const HomePageSlider = ({setMessage, handleOpen}) => {

  // All States and variables here
  const [infoModal, setInfoModal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [uploadedStatus, setUploadedStates] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('desktop')
  const [apiImages, setApiImages] = useState({});
  const [desktopSlider, setDesktopSlider] = useState([]);
  const [mobileSlider, setMobileSlider] = useState([])
  


  const [homeSliderPayload, setHomeSliderPayload] = useState({
    slider: {
      desktop: [],
      mobile: []
    }
  })

  // gallery modal imports
  const [data, setData] = useState([])
  // Payload to send
  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: '',
    title: '',
    description: '',
    link_url: '',
  })

  // Modals open and close functions
  // Gallery modal
  const handleModalOpen = () => {
    setModalView(true)
  }
  const handleModalClose = () => {
    setModalView(false)
  }

  // info modal
  const handleShowInfoModal = () => {
    setInfoModal(true)
  }

  const handleCloseInfoModal = () => {
    setInfoModal(false);
  }

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


  const handleImageSelect = (image) => {

    setHomeSliderPayload((prevSlider) => ({
      ...prevSlider,
      slider: {
        ...prevSlider.slider,
        [selectedTab]: [
          ...(prevSlider.slider[selectedTab] || []),
          image
        ]
      }
    }))

    setModalView(false);
  };

  const getHomeSlideImages = async () => {
    const api = `/api/v1/pages/home/upd-slider/get`;
    try {
      const response = await axios.get(`${Url}${api}`);
      if (response.status === 200) {
        setApiImages(response.data.slider);
        setDesktopSlider(response.data.slider.desktop);
        setMobileSlider(response.data.slider.mobile)
      }
    } catch (error) {
      console.log("UnExpected Server Error", error);
    }
  }

  useEffect(() => {
    getHomeSlideImages();
  }, [])

  useEffect(() => {
    setHomeSliderPayload((prevData) => ({
      ...prevData,
      slider: {
        ...prevData.slider,
        desktop: [...desktopSlider],
        mobile: [...mobileSlider]
      }
    }))
  }, [desktopSlider, mobileSlider])


  // useEffect(() => {}, [homeSliderPayload])


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
  }, [isMounted])


  const addImageToMainSlider = async () => {
    const api = `/api/v1/pages/home/upd-slider/edit`;
    try {
      setLoading(true)
      const response = await axios.put(`${Url}${api}`, homeSliderPayload.slider)
      if (response.status === 200) {
        handleOpen('Updated Slider Images Successfully')
      }
    } catch (error) {
      console.error("UnExpected Server Error", error);
      handleOpen('UnExpected Server Error')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDesktopBanner = (selectedId) => {
    const filteredBanner = homeSliderPayload.slider.desktop.filter((item) => item._id !== selectedId);
    setHomeSliderPayload((prevData) => ({
      ...prevData,
      slider: {
        ...prevData.slider,
        desktop: filteredBanner
      }
    }))
  }

  const handleDeleteMobileBanner = (selectedId) => {
    const filteredBanner = homeSliderPayload.slider.mobile.filter((item) => item._id !== selectedId);
    setHomeSliderPayload((prevData) => ({
      ...prevData,
      slider: {
        ...prevData.slider,
        mobile: filteredBanner
      }
    }))
  }

  const showTab = (tab) => {
    if (tab === 'mobile') {
      setSelectedTab('mobile')
    } else {
      setSelectedTab('desktop')
    }
  }


  return (
    <div className='SlderMainSection'>
      
      <CMSHead
        heading={'Home Page Slider'}
        buttonText={'Save'}
        showIcons={true}
        handleShowTab={showTab}
        tabValue={selectedTab}
        isButtonVissible={true}
        sendImagesHomeSlider={addImageToMainSlider}
        handleShowInfoModal={handleShowInfoModal}
      />

      {selectedTab === 'desktop' ? (
        <CMSBody
          bodyText={'Upload Image'}
          selectedImage={homeSliderPayload.slider.desktop}
          handleModalOpen={handleModalOpen}
          handleImageDelete={handleDeleteDesktopBanner}
          setModalView={setModalView}
          loading={loading}
        />
      ) : (
        <SmallSlider
          bodyText={'Upload Image'}
          selectedImage={homeSliderPayload.slider.mobile}
          handleModalOpen={handleModalOpen}
          handleImageDelete={handleDeleteMobileBanner}
          setModalView={setModalView}
        />
      )}

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

export default HomePageSlider


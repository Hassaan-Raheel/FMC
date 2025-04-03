import React, { useState, useEffect } from 'react';
import './FinanceSlider.css';
import CMSHead from '../../UI-Controls/CMSHead/CMSHead';
import CMSBody from '../../CMSBody/CMSBody';
import ImageGalleryPopup from '../../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import axios from 'axios';
import { Url } from '../../../Services/Api';
import { uploadImage } from '../../../Services/functions';
import loaderTwo from '../../../Assets/Images/loader-check-one.gif'
import MainLoader from '../../UI-Controls/MainLoader/MainLoader';
import SmallSlider from '../SmallSlider/SmallSlider';

const FinanceSlider = ({handleOpen}) => {
  const [infoModal, setInfoModal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [uploadedStatus, setUploadedStates] = useState('');
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [financingBanner, setFinancingBanner] = useState([]);
  const [mobileApiImages, setMobileApiImages] = useState([]);

  const [sliderPayload, setSliderPayload] = useState({
    slider: {
      desktop: [],
      mobile: []
    }
  })

  const [imageSendPayload, setImageSendPayload] = useState({
    image_url: '',
    alt_text: '',
    title: '',
    description: '',
    link_url: '',
  });
  // Modal open and close functions
  const handleModalOpen = () => {
    setModalView(true);
  };

  const handleModalClose = () => {
    setModalView(false);
  };

  const handleShowInfoModal = () => {
    setInfoModal(true)
  }

  const handleCloseInfoModal = () => {
    setInfoModal(false);
  }

  // Get Finance Slider Media api
  const getApi = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/pages/home/finance/get`)
      setData(response.data.homeFinanceSliders)
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getApi();
  }, []);

  const handleImageSelect = (image) => {

    setSliderPayload((prevData) => ({
      ...prevData,
      slider: {
        ...prevData.slider,
        [selectedTab]: [
          ...(prevData.slider[selectedTab] || []),
          image
        ]
      }
    }))

    setModalView(false);
  };

  // Get images for finance slider
  const getHomeSliderImagesFromApi = async () => {
    const api = `/api/v1/pages/home/upd-finance-slider/get`
    try {
      const response = await axios.get(`${Url}${api}`);
      setFinancingBanner(response.data.slider.desktop)
      setMobileApiImages(response.data.slider.mobile)
    } catch (error) {
      console.error("Error getting slider images:", error);
    }
  };

  useEffect(() => {
    getHomeSliderImagesFromApi();
  }, []);

  useEffect(() => {
    setSliderPayload((prevData) => ({
        ...prevData,
        slider: {
          ...prevData.slider,
          desktop: [...financingBanner],
          mobile: [...mobileApiImages]
        }
      }))
  }, [mobileApiImages, financingBanner])
  
  // handleFilleChange
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const api = `${Url}/api/v1/media/pages/home/finance/add`

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
      getApi()
    }
  }

  const handleDeleteImage = (selectedId) => {
    const filteredImages = sliderPayload.slider.desktop.filter((item) => item._id !== selectedId);
    
    setSliderPayload((prevData) => ({
      ...prevData,
      slider: {
        ...prevData.slider,
        desktop: filteredImages
      }
    }))
  }

  const handleMobileImageDelete = (selectedId) => {
    const filteredImages = sliderPayload.slider.mobile.filter((item) => item._id !== selectedId);
    
    setSliderPayload((prevData) => ({
      ...prevData,
      slider: {
        ...prevData.slider,
        mobile: filteredImages
      }
    }))
  }


  const updateSliderImages = async () => {
    const api = `/api/v1/pages/home/upd-finance-slider/edit`;
    try {
      setLoader(true)
      const response = await axios.put(`${Url}${api}`, sliderPayload.slider)
      
      if (response.status === 200) {
        handleOpen("Financing Update Successfully");
      }
    } catch (error) {
      console.log("UnExpected Server Error", error);
      handleOpen("UnExpected Server Error", error);
      setLoader(false);
    } finally {
      setLoader(false)
    }
  }

  const [selectedTab, setSelectedTab] = useState('desktop')
  const handleTabclick = (tab) => {
    setSelectedTab(tab);
  }


  


  return (
    <div className='FinanceSlider'>
      {loader && <MainLoader loaderGif={loaderTwo} />}
      <CMSHead
        heading={'Finance Slider'}
        buttonText={'Save'}
        showIcons={true}
        handleShowTab={handleTabclick}
        tabValue={selectedTab}
        isButtonVissible={true}
        sendImagesHomeSlider={updateSliderImages}
        handleShowInfoModal={handleShowInfoModal}
      />
      {selectedTab === 'desktop' ? (
        <CMSBody
          bodyText={'Upload Image'}
          selectedImage={sliderPayload.slider.desktop}
          handleModalOpen={handleModalOpen}
          handleImageDelete={handleDeleteImage}
          setModalView={setModalView}
        />
      ) : (
        <SmallSlider
          bodyText={'Upload Image'}
          selectedImage={sliderPayload.slider.mobile}
          handleModalOpen={handleModalOpen}
          handleImageDelete={handleMobileImageDelete}
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
        handleFileChange={handleFileChange}
        editGalleryImageApi={`/api/v1/media/pages/home/finance/`}
      />
      <InfoPopUp
        showInfoModal={infoModal}
        handleCloseInfoModal={handleCloseInfoModal}
      />
    </div>
  );
}

export default FinanceSlider;

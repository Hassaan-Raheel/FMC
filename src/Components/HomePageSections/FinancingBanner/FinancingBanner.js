import React, { useEffect, useState } from 'react'
import './FinancingBanner.css';
import CMSHead from '../../UI-Controls/CMSHead/CMSHead';
import imageUploadIcon from '../../../Assets/Images/uploadImg 48 x 48.png'
import ImageGalleryPopup from '../../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import { uploadImage } from '../../../Services/functions';
import { Url } from '../../../Services/Api';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import DoubleBanner from '../Shimmers/DoubleBanner/DoubleBanner';
import SectionLoader from '../../UI-Controls/MainLoader/SectionLoader';
import GalleryUpload from '../../UI-Controls/GalleryUpload/GalleryUpload';

const FinancingBanner = ({handleOpen}) => {
  const [modalView, setModalView] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [financingBannerData, setFinancingBannerData] = useState({});
  const [temporaryBannerData, setTemporaryBannerData] = useState({});
  const [uploadType, setUploadType] = useState('');
  const [uploadedStatus, setUploadedStates] = useState('');
  const [mediaDeta, setMediaData] = useState([])
  const [selectedTab, setSelectedTab] = useState('desktop');
  const [loader, setLoader] = useState(false)

  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: '',
    title: '',
    description: '',
    usedin: [],
    link_url: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Url}/api/v1/content2/get`);
        const sectionData = response.data.section_2 || {};
        setFinancingBannerData(sectionData);
        setTemporaryBannerData(sectionData);
      } catch (error) {
        console.error("Error fetching financing banners", error);
      }
    };
    fetchData();
  }, []);

  const handleModalOpen = (type) => {
    setModalView(true);
    setUploadType(type);
  };

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

  //   // get images in gallery modal
  const getApi = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/pages/home/finance/get`)
      setMediaData(response.data.homeFinanceSliders)

      // console.log("media get response", mediaDeta)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getApi();
  }, []);

  const handleModalClose = () => setModalView(false);

  const handleImageSelect = (image) => {
    const key = uploadType === 'desktop-banner' ? 'image' : 'mobile_image';
    setTemporaryBannerData((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...image },
    }));
    setModalView(false);
  };

  const handleDeleteImage = (type) => {
    const key = type === 'desktop-banner' ? 'image' : 'mobile_image';
    setTemporaryBannerData((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const handleSave = async () => {
    try {
      setLoader(true)
      await axios.put(`${Url}/api/v1/content2/edit`, { section_2: temporaryBannerData });
      setFinancingBannerData(temporaryBannerData);
      
     handleOpen("Financing Banner Updated successfully");
    } catch (error) {
      console.error("Error saving financing banners", error);
      handleOpen("Error saving financing banners", error);
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };

  const handleTabclick = (tab) => {
    setSelectedTab(tab);
  }

  useState(() => {}, [selectedTab]);


  return (
    <div>
      <CMSHead
        heading="Financing Available"
        buttonText="Save"
        showIcons={true}
        tabValue={selectedTab}
        handleShowTab={handleTabclick}
        isButtonVissible={true}
        handleShowInfoModal={() => setInfoModal(true)}
        sendImagesHomeSlider={handleSave}
      />


      {Object.keys(temporaryBannerData).length > 0 ?(
        <div className="financing-slider-main-body">
          {loader && <SectionLoader />}
          {/* Desktop Banner */}
          {selectedTab === 'desktop' ? (
            <div className="financing-slider-inner-body">
            {temporaryBannerData?.image?.image_url ? (
              <div className='financing-banner-selected-image-container'>
                <img src={`${Url + temporaryBannerData.image.image_url}`} alt="Desktop Banner" className='financing-banner-image' />
                <button className='financing-banner-selected-image-delete-btn' onClick={() => handleDeleteImage('desktop-banner')}>
                  <IoClose size={15} color='#595959' />
                </button>
              </div>
            ) : (
              // <div className='financing-banner-image-border' onClick={() => handleModalOpen('desktop-banner')}>
              //   <img src={imageUploadIcon} alt="Upload" />
              // </div>
              <GalleryUpload 
                openModal={() => handleModalOpen('desktop-banner')}
              />
            )}
          </div>
          ) : (
            <div className="financing-slider-mobile-image-content">
            {temporaryBannerData?.mobile_image?.image_url ? (
              <div className="financing-banner-selected-mobile-image-container">
                <img src={`${Url + temporaryBannerData.mobile_image.image_url}`} alt="Mobile Banner" className='financing-banner-mobile-image' />
                <button className="financing-banner-selected-mobile-image-delete-btn" onClick={() => handleDeleteImage('mobile-banner')}>
                  <IoClose size={15} color='#595959' />
                </button>
              </div>
            ) : (
              // <div className="financing-banner-mobile-image-border" onClick={() => handleModalOpen('mobile-banner')}>
              //   <img src={imageUploadIcon} alt="Upload" />
              // </div>
              <GalleryUpload 
                openModal={() => handleModalOpen('mobile-banner')}
              />
            )}
          </div>
          )}
          

          {/* Mobile Banner */}
          
        </div>
      ) : (
      <DoubleBanner />
      )}


      <ImageGalleryPopup
        showImageGalleryPopUp={modalView}
        handleModalView={handleModalClose}
        onImageSelect={handleImageSelect}
        imageSendPayload={imageSendPayload}
        setImageSendPayload={setImageSendPayload}
        alt_text={imageSendPayload.alt_text}
        title={imageSendPayload.title}
        handleFileChange={handleFileChange}
        data={mediaDeta}
      />

      <InfoPopUp showInfoModal={infoModal} handleCloseInfoModal={() => setInfoModal(false)} />
    </div>
  );
};

export default FinancingBanner;





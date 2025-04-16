import React, { useEffect, useState } from 'react'
import './AdvertisingBanner.css'
import CMSHead from '../../UI-Controls/CMSHead/CMSHead'
import uploadImageIcon from '../../../Assets/Images/uploadImg 48 x 48.png'
import ImageGalleryPopup from '../../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup'
import InfoPopUp from '../../InfoPopUp/InfoPopUp'
import { IoClose } from "react-icons/io5";
import crossBtn from '../../../Assets/Images/cross-button-32-X-32.png'
import axios from 'axios'
import { Url } from '../../../Services/Api'
import { uploadImage } from '../../../Services/functions'
import DoubleBanner from '../Shimmers/DoubleBanner/DoubleBanner'
import SectionLoader from '../../UI-Controls/MainLoader/SectionLoader'
import GalleryUpload from '../../UI-Controls/GalleryUpload/GalleryUpload'

const AdvertisingBanner = ({ handleOpen }) => {
  const [modalView, setModalView] = useState(false);
  const [bannerHeading, setBannerHeading] = useState('')
  const [selectedImage, setSelectedImage] = useState([])
  const [infoModal, setInfoModal] = useState(false);
  const [uploadType, setUploadType] = useState()
  const [mediaDeta, setMediaData] = useState([])
  const [uploadedStatus, setUploadedStates] = useState('');
  const [advPayload, setAdvPayload] = useState();
  const [loading, setLoading] = useState(false);


  const [advertisingPayload, setAdvertisingPayload] = useState({
    section_1: {
      heading: "",
      image: {},
      mobile_image: {},
    }
  })


  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: '',
    title: '',
    description: '',
    usedin: [],
    link_url: '',
  });

  useEffect(() => {
    const fetchFinancingBannerImages = async () => {
      const api = `/api/v1/content2/get`;
      try {
        const response = await axios.get(`${Url + api}`);
        console.log("advertising response", response.data.section_1)
        setAdvPayload(response.data.section_1)
        setAdvertisingPayload(response.data.section_1);
      } catch (error) {
        console.error("error geting financing banners", error);
      }
    }
    fetchFinancingBannerImages()
  }, [])

  // useEffect(() => {
  //   setAdvertisingPayload(advPayload)
  // }, [advPayload])

  // Gallery modal
  const handleModalOpen = (type) => {
    setModalView(true)
    setUploadType(type)
  }
  const handleModalClose = () => {
    setModalView(false)
  }
  // Modal open and close functions
  const handleShowInfoModal = () => {
    setInfoModal(true)
  }
  const handleCloseInfoModal = () => {
    setInfoModal(false);
  }

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
        getApi()
      } catch (error) {
        console.error("Image upload failed:", error);
        setUploadedStates('error');
      }

    }
  }

  // get images in gallery modal
  const getApi = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/media/global/get`);
      setMediaData(response.data.media);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getApi();
  }, []);

  const handleImageSelect = (image) => {
    setSelectedImage(image);

    console.log("upload Type", uploadType)
    console.log("selected image", image)
    setAdvertisingPayload((prevData) => ({
      ...prevData,
      [uploadType]: image
    }))
    setModalView(false);
  };

  useEffect(() => {console.log("advertising payload", advertisingPayload)}, [advertisingPayload])



  const handleHeadingSet = (e) => {
    const {name, value} = e.target
    setAdvertisingPayload((prevPayload) => ({
      ...prevPayload,
      section_1: {
        ...prevPayload.section_1,
        [name]: value,
      },
    }));
  }


  const handleDeleteImage = (key) => {
    setAdvertisingPayload((prevData) => ({
      ...prevData,
      [key]: {}
    }))

  };

  const handleSubmitFinancingBannerData = async () => {
    const api = `/api/v1/content2/edit`;
    console.log("dare to compare before send", advertisingPayload )
    try {
      setLoading(true)
      await axios.put(`${Url + api}`, { section_1: advertisingPayload })
        .then(response => { console.log("response", response) })
        .then(error => { console.log("error", error) })

      handleOpen("Advertising Banner Update Successfully")
    } catch (error) {
      setLoading(true)
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        // No response was received from the server
        console.error("No response from server:", error.request);
      } else {
        // Error in setting up the request
        console.error("Error in request setup:", error.message);
      }
      handleOpen("UnExpected Server Error")
    } finally {
      setLoading(false)
    }
  }


  const [selectedTab, setSelectedTab] = useState('desktop');
  const handleTabclick = (tab) => {
    setSelectedTab(tab);
  }




  return (
    <div className='advertising-banner-main-container'>
      {loading && <SectionLoader />}
      <CMSHead
        heading={bannerHeading.length > 0 ? bannerHeading : "Advertising Banner"}
        buttonText={"Save"}
        showIcons={true}
        tabValue={selectedTab}
        handleShowTab={handleTabclick}
        isButtonVissible={true}
        handleShowInfoModal={handleShowInfoModal}
        sendImagesHomeSlider={handleSubmitFinancingBannerData}
      />

      {advertisingPayload !== null ? (
        <div className='advertising-banner-body-main'>
          <div className='advertising-banner-containt'>
            <div className='advertising-banner-name-input'>
              <input
                type='text'
                placeholder='Title'
                name='heading'
                value={advertisingPayload?.heading}
                onChange={handleHeadingSet}
              />
            </div>

            <div className='financing-slider-main-body'>

              {selectedTab === 'desktop' ? (
                <div className='financing-slider-inner-body'>
                  {advertisingPayload?.image && Object.keys(advertisingPayload.image).length > 0 ? (
                    <div className='financing-banner-selected-image-container'>
                      <button className='financing-banner-selected-image-delete-btn' onClick={() => handleDeleteImage('image')}>
                        <IoClose size={15} color='#595959' />
                      </button>
                      <img src={`${Url + advertisingPayload?.image?.image_url}`} alt='financing banner' className='financing-banner-image' />
                    </div>
                    
                    
                  ) : (
                    <GalleryUpload 
                      openModal={() => handleModalOpen('image')}
                    />
                  )}

                </div>
              ) : (
                <div className='financing-slider-mobile-image-content'>
                  {advertisingPayload?.mobile_image && Object.keys(advertisingPayload.mobile_image).length > 0 ? (
                    <div className='financing-banner-selected-mobile-image-container'>
                      <button className='financing-banner-selected-mobile-image-delete-btn' onClick={() => handleDeleteImage("mobile_image")}>
                        <IoClose size={15} color='#595959' />
                      </button>
                      <img src={`${Url + advertisingPayload?.mobile_image?.image_url}`} alt='financing banner' className='financing-banner-mobile-image' />
                    </div>
                    
                  ) : (
                    <GalleryUpload 
                      openModal={() => handleModalOpen('mobile_image')}
                    />
                  )}
                </div>
              )}

            </div>
          </div>
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
      <InfoPopUp
        showInfoModal={infoModal}
        handleCloseInfoModal={handleCloseInfoModal}
      />
    </div>
  )
}

export default AdvertisingBanner



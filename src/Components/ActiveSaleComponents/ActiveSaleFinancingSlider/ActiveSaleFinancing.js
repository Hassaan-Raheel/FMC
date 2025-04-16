import React, { useRef, useState, useEffect } from 'react';
import './ActiveSaleFinancing.css';
import '../../../Pages/Page/GeneralPage.css';
import ImageGalleryPopup from '../../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import axios from 'axios';
import { Url } from '../../../Services/Api';
import { uploadImage } from '../../../Services/functions';

import addBtn from '../../../Assets/Images/add-btn-charcol.png'
import crossButton from '../../../Assets/Images/cross-button-32-X-32.png'
import { IoClose } from "react-icons/io5";
import { useActiveSale } from '../../../Context/active-sale-context/ActiveSaleContext';
import JoditEditor from "jodit-react";
import '../../../../src/JoditEditorStyle.css';
import CMSHead from '../../UI-Controls/CMSHead/CMSHead';
import GalleryUpload from '../../UI-Controls/GalleryUpload/GalleryUpload';

const ActiveSaleFinancing = () => {

  const editor = useRef(null); // Reference for JoditEditor
  const [infoModal, setInfoModal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Visual");
  const [uploadedStatus, setUploadedStates] = useState('');
  const [homeSliderImagesFromApi, setHomeSliderImagesFromApi] = useState([]);
  const [data, setData] = useState([]);
  const [viewPort, setViewPort] = useState('desktop')
  const { activeSalePayload, setActiveSalePayload } = useActiveSale()
  const [imageSendPayload, setImageSendPayload] = useState({
    image_url: '',
    alt_text: '',
    title: '',
    description: '',
    link_url: '',
  });

  // Modal open and close functions
  const [openModalType, setOpenModalType] = useState()
  const handleModalOpen = (type) => {
    setModalView(true);
    setOpenModalType(type)
  };

  const handleModalClose = () => {
    setModalView(false);
  };

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

  // Get images for finance slider
  const getHomeSliderImagesFromApi = async () => {
    try {
      const response = await axios.get(`${Url}/api/v1/pages/home/finance-slider/get`);
      const { homeSliders } = response.data;
      setHomeSliderImagesFromApi(homeSliders);
    } catch (error) {
      console.error("Error getting slider images:", error);
    }
  };

  useEffect(() => {
    getHomeSliderImagesFromApi();
  }, []);

  const handleImageSelect = (image) => {
    if (openModalType === 'banner1') {
      setActiveSalePayload((prevSlider) => ({
        ...prevSlider,
        banner1: {
          ...prevSlider.banner1,
          [viewPort]: [
            ...(prevSlider.banner1?.[viewPort] || []),
            image
          ]
        }
      }))
    } else {
      setActiveSalePayload((prevSlider) => ({
        ...prevSlider,
        banner2: [
          image
        ]
      }))
    }
    setModalView(false);
  };

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

  const handleViewPort = (view) => {
    setViewPort(view)
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageDelete = (id, index) => {
    console.log("deleted index", index)
    const viewKey = viewPort === 'desktop' ? 'desktop' : 'mobile';

    setActiveSalePayload((prevState) => ({
      ...prevState,
      banner1: {
        ...prevState.banner1,
        [viewKey]: prevState.banner1[viewKey].filter((image) => image._id !== id),
      },
    }));

    setCurrentIndex(index === 0 ? 0 : index - 1);
  }

  /* --- Jodit Editor Configuration --- */
  const configEditor = {
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "paragraph", // Adds paragraph options
      "fontsize", // Adds font size options
      "lineHeight", // Adds line height options
      "|",
      "ul", // Unordered list
      "ol", // Ordered list
      "|",
      "|",
      "align",
      "undo",
      "redo",
    ],
    style: {
      fontFamily: "var(--font-family)",
      fontSize: "var(--font-size-small)",
      lineHeight: "1.6",
      color: "var(--text-color-1)",
      height: "400px",
    },
    toolbarAdaptive: false,
    toolbarSticky: false,
  };

  const handleEditorOnChange = (newContent) => {
    setActiveSalePayload((prevState) => ({
      ...prevState,
      content1: newContent, // Update content2 with the new data
    }));
  };

  const handleDeleteBanner2 = () => {
    setActiveSalePayload((prevState) => ({
      ...prevState,
      banner2: prevState.banner2.map((banner, index) =>
        index === 0 // Target the first object
          ? { ...banner, image_url: '' } // Set image_url to empty
          : banner // Keep other objects unchanged
      ),
    }));
  };

  const [selectedSec, setSelectedSec] = useState('desktop')

  const showTab = (tab) => {
    if (tab === 'mobile') {
      setSelectedSec('mobile')
      handleViewPort('mobile')
    } else {
      setSelectedSec('desktop')
      handleViewPort('desktop')
    }
  }

  const handleShowInfoModal = () => {
    setInfoModal(true)
  }

  return (
    <div className='FinanceSlider'>
      <CMSHead
        heading={'Financing Banner'}
        showIcons={true}
        handleShowTab={showTab}
        tabValue={selectedSec}
        isButtonVissible={false}
        handleShowInfoModal={handleShowInfoModal}
      />

      {viewPort === 'desktop' ?
        (
          <div className='SliderBody'>
            {activeSalePayload?.banner1?.desktop?.length === 0 ? (  
              <GalleryUpload 
                openModal={() => handleModalOpen('banner1')}
              />
            ) : (
              <div className='slider-container'>
                <div className='sale-slider'
                  style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease' }}
                >
                  {activeSalePayload?.banner1 && activeSalePayload?.banner1?.desktop?.map((image, index) => (
                    <div
                      className={`slide ${index === currentIndex ? 'active' : ''}`}
                      key={index}
                    >
                      <div className='SliderBodySelectedImagesSlider'>
                        <button className='image-slider-image-delete' onClick={() => handleImageDelete(image._id, index)}>
                          <IoClose size={15} color='#595959' />
                        </button>
                        <img src={`${Url + image.image_url}`} alt={`Selected ${index + 1}`} className='image-slider-image' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className={`SliderAddNewImageBtnDiv ${activeSalePayload?.banner1?.desktop?.length === 0 ? 'show-add-more-btn' : ''}`}>
              <div className='pagination-dots-container'>
                <div className='pagination'>
                  {activeSalePayload?.banner1 && activeSalePayload?.banner1?.desktop?.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(index)}
                    ></button>
                  ))}
                </div>
              </div>
              <button className='add-new-image-btn' onClick={() => handleModalOpen('banner1')}>
                <img src={addBtn} alt='add-image' />
                Add
              </button>
            </div>
          </div>
        )
        : (
          <div className='SliderBody'>
            {activeSalePayload?.banner1?.mobile?.length === 0 ? (  
              <GalleryUpload 
                openModal={() => handleModalOpen('banner1')}
              />
            ) : (
              <div className='slider-container'>
                <div className='sale-slider'
                  style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease' }}
                >
                  {activeSalePayload?.banner1 && activeSalePayload?.banner1?.mobile?.map((image, index) => (
                    <div
                      className={`slide ${index === currentIndex ? 'active' : ''}`}
                      key={index}
                    >
                      <div className='SliderBodySelectedImagesSlider'>
                        <button className='image-slider-image-delete' onClick={() => handleImageDelete(image._id, index)}>
                          <IoClose size={15} color='#595959' />
                        </button>
                        <img src={`${Url + image.image_url}`} alt={`Selected ${index + 1}`} className='image-slider-image' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className={`SliderAddNewImageBtnDiv ${activeSalePayload?.banner1 && activeSalePayload?.banner1?.mobile?.length === 0 ? 'show-add-more-btn' : ''}`}>
              <div className='pagination-dots-container'>
                <div className='pagination'>
                  {activeSalePayload?.banner1 && activeSalePayload?.banner1?.mobile?.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(index)}
                    ></button>
                  ))}
                </div>
              </div>
              <button className='add-new-image-btn' onClick={() => handleModalOpen('banner1')}>
                <img src={addBtn} alt='add-image' />
                Add
              </button>
            </div>
          </div>
        )
      }

      <div className='active-sale-content1-and-banner2'>
        <div className='active-sale-content1'>
          <div className="custom-editor-pageSection">
            <div className="Policy-Editor">
              <div className="Editor-Row">
                <div className="General-Editor-Container">
                  <div className="General-Editor-Tabs">
                    <div
                      className={`Tab ${selectedTab === "Visual" ? "active" : ""}`}
                      onClick={() => setSelectedTab("Visual")}
                    >
                      Visual
                    </div>
                    <div
                      className={`Tab ${selectedTab === "Text" ? "active" : ""}`}
                      onClick={() => setSelectedTab("Text")}
                    >
                      Text
                    </div>
                  </div>
                  <div className="General-Editor-Content">
                    {selectedTab === "Visual" ? (
                      <JoditEditor
                        ref={editor}
                        value={activeSalePayload.content1}
                        tabIndex={1}
                        onBlur={handleEditorOnChange}
                        config={configEditor}
                      />
                    ) : (
                      <textarea
                        id="content1Description"
                        name="content1Description"
                        value={activeSalePayload.content1}
                        onChange={(e) => setActiveSalePayload.content1(e.target.value)}
                        className="General-Editor-Text-Area"
                        placeholder="Content 1 Description"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='active-sale-banner2'>
          {activeSalePayload?.banner2?.[0]?.image_url === '' ? (
            <GalleryUpload 
              openModal={() => handleModalOpen('banner2')}
            />

          )
            : (
              <div className='active-sale-banner-2-image-div'>
                <button className='active-sale-banner-delete-button' onClick={handleDeleteBanner2}>
                  <IoClose size={15} color='#595959' />
                </button>
                <img src={`${Url + activeSalePayload?.banner2?.[0]?.image_url}`} alt='banner 2' className='active-sale-banner-image' />
              </div>
            )}
        </div>
      </div>

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
};

export default ActiveSaleFinancing;

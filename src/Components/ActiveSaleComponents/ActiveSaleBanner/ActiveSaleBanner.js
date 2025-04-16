import React, { useRef, useState, useEffect } from 'react';
import './ActiveSaleBanner.css';
import "../../../Pages/Page/GeneralPage.css";
// Assets
import imageIcon from '../../../Assets/Images/uploadImg 48 x 48.png'
import addBtn from '../../../Assets/Images/add-btn-charcol.png'
import loaderTwo from '../../../Assets/Images/loader-check-one.gif'
import crossButton from '../../../Assets/Images/cross-button-32-X-32.png'
import { IoClose } from "react-icons/io5";

// Components
import ImageGalleryPopup from '../../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import InfoPopUp from '../../InfoPopUp/InfoPopUp';
import MainLoader from '../../UI-Controls/MainLoader/MainLoader';
import ActiveSaleCMSHead from '../ActiveSaleCMSHead/ActiveSaleCMSHead';
import JoditEditor from "jodit-react";
import '../../../../src/JoditEditorStyle.css';

// functions and liberaries
import axios from 'axios';
import { Url } from '../../../Services/Api';
import { uploadImage } from '../../../Services/functions';
import { useActiveSale } from '../../../Context/active-sale-context/ActiveSaleContext';
import CMSHead from '../../UI-Controls/CMSHead/CMSHead';
import GalleryUpload from '../../UI-Controls/GalleryUpload/GalleryUpload';

const ActiveSaleBanner = () => {

  const editor = useRef(null); // Reference for JoditEditor
  const [infoModal, setInfoModal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Visual");
  const [uploadedStatus, setUploadedStates] = useState('');
  const [data, setData] = useState([]);
  const [openModalType, setOpenModalType] = useState()
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewPort, setViewPort] = useState('desktop')
  const { activeSalePayload, setActiveSalePayload } = useActiveSale()

  const [imageSendPayload, setImageSendPayload] = useState({
    image_url: '',
    alt_text: '',
    title: '',
    description: '',
    link_url: '',
  });

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
      "link",
      "image",
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

  // Modal open and close functions
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

  const handleImageSelect = (image) => {
    if (viewPort === 'desktop') {
      setActiveSalePayload((prevState) => ({
        ...prevState,
        banner3: {
          ...prevState.banner3,
          desktop: [
            ...(prevState.banner3?.desktop || []),
            {
              image_url: image.image_url,
              alt_text: image.alt_text,
              title: image.title,
              link_url: image.link_url,
              description: image.description
            },
          ]
        }
      }))
    }
    else {
      setActiveSalePayload((prevState) => ({
        ...prevState,
        banner3: {
          ...prevState.banner3,
          desktop: [
            ...(prevState.banner3?.desktop || []),
            {
              image_url: image.image_url,
              alt_text: image.alt_text,
              title: image.title,
              link_url: image.link_url,
              description: image.description
            }
          ]
        }
      }))
    }
    setModalView(false);
  }

  const handleViewPort = (view) => {
    setViewPort(view)
  }

  // const config = {
  //   placeholder: "Elevate your bedroom with the Cypress Bedroom Set in Gray...",
  //   showXPathInStatusbar: false, // Hides the XPath section in the status bar
  //   showCharsCounter: false, // Hides the character counter
  //   showWordsCounter: false, // Hides the word counter
  //   toolbarSticky: false, // Optional: Makes toolbar non-sticky
  //   removeButtons: ["about"], // Removes the "About" button that displays branding info
  // };

  const handleEditorOnChange = (newContent) => {
    setActiveSalePayload((prevState) => ({
      ...prevState,
      content2: newContent, // Update content2 with the new data
    }));
  };

  const handleImageDelete = (id) => {
    setActiveSalePayload((prevState) => {
      // Check the viewport type
      const viewKey = viewPort === 'desktop' ? 'desktop' : 'desktop';

      return {
        ...prevState,
        banner3: {
          ...prevState.banner3,
          [viewKey]: prevState.banner3[viewKey].filter((image) => image._id !== id),
        },
      };
    });
  }

  const [selectedSec, setSelectedSec] = useState('desktop')

  const showTab = (tab) => {
    if (tab === 'mobile') {
      setSelectedSec('mobile')
      handleViewPort('desktop')
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
        heading={'Financing Slider'}
        showIcons={true}
        handleShowTab={showTab}
        tabValue={selectedSec}
        isButtonVissible={false}
        handleShowInfoModal={handleShowInfoModal}
      />

      {viewPort === 'desktop' ?
        (
          <div className='SliderBody'>
            {activeSalePayload?.banner3?.desktop?.length === 0 ? (  // Check if no images are selected
              // <div className='upload-image-section'>
              //   <p>upload image</p>
              //   <div className='image-icon-div' onClick={() => handleModalOpen('banner1')}>
              //     <img src={imageIcon} alt='img' />
              //   </div>
              // </div>
              <GalleryUpload 
                openModal={() => handleModalOpen('banner1')}
              />
            ) : (
              <div className='slider-container'>
                <div className='sale-slider'
                  style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease' }}
                >
                  {activeSalePayload?.banner3?.desktop?.map((image, index) => (
                    <div
                      className={`slide ${index === currentIndex ? 'active' : ''}`}
                      key={index}
                    >
                      <div className='SliderBodySelectedImagesSlider'>
                        <button className='image-slider-image-delete' onClick={() => handleImageDelete(image._id)}>
                          <IoClose size={15} color='#595959' />
                        </button>
                        <img src={`${Url + image.image_url}`} alt={`Selected ${index + 1}`} className='image-slider-image' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className={`SliderAddNewImageBtnDiv ${activeSalePayload?.banner3?.desktop?.length === 0 ? 'show-add-more-btn' : ''}`}>
              <div className='pagination-dots-container'>
                <div className='pagination'>
                  {activeSalePayload?.banner3?.desktop?.map((_, index) => (
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
            {activeSalePayload?.banner3?.desktop?.length === 0 ? (  // Check if no images are selected
              <div className='upload-image-section'>
                <p>image upload</p>
                <div className='image-icon-div' onClick={() => handleModalOpen('banner1')}>
                  <img src={imageIcon} alt='img' />
                </div>
              </div>
            ) : (
              <div className='slider-container'>
                <div className='sale-slider'
                  style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease' }}
                >
                  {activeSalePayload?.banner3?.desktop?.map((image, index) => (
                    <div
                      className={`slide ${index === currentIndex ? 'active' : ''}`}
                      key={index}
                    >
                      <div className='SliderBodySelectedImagesSlider'>
                        <button className='image-slider-image-delete' onClick={() => handleImageDelete(image._id)}>
                          <IoClose size={15} color='#595959' />
                        </button>
                        <img src={`${Url + image.image_url}`} alt={`Selected ${index + 1}`} className='image-slider-image' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className={`SliderAddNewImageBtnDiv ${activeSalePayload?.banner3?.desktop?.length === 0 ? 'show-add-more-btn' : ''}`}>
              <div className='pagination-dots-container'>
                <div className='pagination'>
                  {activeSalePayload?.banner3?.desktop?.map((_, index) => (
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

      <div className='active-sale-content2'>
        <div className='active-sale-content2'>
          <div className="custom-editor-pageSection">
            <div className="Policy-Editor">
              <div className="Editor-ActiveSaleRow">
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
                        value={activeSalePayload.content2}
                        tabIndex={1}
                        onBlur={handleEditorOnChange}
                        config={configEditor}
                      />
                    ) : (
                      <textarea
                        id="content2Description"
                        name="content2Description"
                        value={activeSalePayload.content2}
                        onChange={(e) => setActiveSalePayload.content2(e.target.value)}
                        className="General-Editor-Text-Area"
                        placeholder="Content 2 Description"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default ActiveSaleBanner;




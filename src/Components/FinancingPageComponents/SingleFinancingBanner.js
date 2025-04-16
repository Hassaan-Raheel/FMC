import React, { useState, useEffect } from "react";
import "./FPage.css";

// Assets
import imageIcon from "../../Assets/Images/uploadImg 48 x 48.png";
import crossButton from "../../Assets/Images/cross-button-32-X-32.png";
import { IoClose } from "react-icons/io5";

// util functions
import { Url } from "../../Services/Api";
import { uploadImage } from "../../Services/functions";
import { useActiveFinance } from "../../Context/ActiveFinanceContext/ActiveFinanceContext";
import axios from "axios";

// Components
import ImageGalleryPopup from "../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup";
import InfoPopUp from "../InfoPopUp/InfoPopUp";
import CMSHead from "../UI-Controls/CMSHead/CMSHead";
import GalleryUpload from "../UI-Controls/GalleryUpload/GalleryUpload";

const ActiveFinancingBanner = () => {
  // All States and variables here
  const [infoModal, setInfoModal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [loading, setLoading] = useState();
  const [uploadedStatus, setUploadedStates] = useState("");
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('desktop')
  const [viewPort, setViewPort] = useState('desktop')
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    activeFinancePayload,
    setActiveFinancePayload,
  } = useActiveFinance();

  const [imageSendPayload, setImageSendPayload] = useState({
    file: null,
    alt_text: "",
    title: "",
    description: "",
    link_url: "",
  });

  // console.log("active Finance payload data", activeFinancePayload);

  // Gallery modal
  const handleModalOpen = () => {
    setModalView(true);
  };
  const handleModalClose = () => {
    setModalView(false);
  };

  // info modal
  const handeShowInfoModal = () => {
    setInfoModal(true);
  };
  const handleCloseInfoModal = () => {
    setInfoModal(false);
  };

  // get image for home slider media
  const getApi = async () => {
    try {
      const response = await axios.get(
        `${Url}/api/v1/media/pages/home/finance/get`
      );
      // console.log("api response", response.data);
      setData(response.data?.homeFinanceSliders);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    getApi();
  }, []);

  // Add Images into slider Media
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const api = `${Url}/api/v1/media/pages/home/finance/add`;

    if (file) {
      setImageSendPayload((prevData) => ({
        ...prevData,
        file: file,
      }));
      setUploadedStates("loading");
      const imagePayloadToSend = new FormData();
      imagePayloadToSend.append("image", file);
      imagePayloadToSend.append("alt_text", imageSendPayload.alt_text);
      imagePayloadToSend.append("title", imageSendPayload.title);
      imagePayloadToSend.append("description", imageSendPayload.description);
      imagePayloadToSend.append("image_url", imageSendPayload.image_url);
      imagePayloadToSend.append("link_url", imageSendPayload.link_url);

      await uploadImage(imagePayloadToSend, api, setUploadedStates);
      getApi();
    }
  };

  const handleViewPort = (view) => {
    setViewPort(view);
  };

  // get images in homepage slider
  const handleImageSelect = (image) => {

    setActiveFinancePayload((prevData) => ({
      ...prevData,
      main_banner: {
        ...prevData.main_banner,
        [selectedTab]: {
          image_url: image.image_url,
          alt_text: image.alt_text,
          title: image.title,
          link_url: image.link_url,
          description: image.description,
          _id: image._id,
        }
      }
    }))

    setModalView(false);
  };

  // Handle image deletion
  const handleImageDelete = (id) => {

    console.log("view port value", viewPort)
    const viewKey = viewPort === "desktop" ? "desktop" : "mobile";

    if(selectedTab === 'mobile') {
      setActiveFinancePayload((prevState) => ({
      ...prevState,
      main_banner: {
        ...prevState.main_banner,
        mobile: {
          image_url: "",
          alt_text: "",
          title: "",
          link_url: "",
          description: "",
        },
      },
    }));
    } else {
      setActiveFinancePayload((prevState) => ({
      ...prevState,
      main_banner: {
        ...prevState.main_banner,
        desktop: {
          image_url: "",
          alt_text: "",
          title: "",
          link_url: "",
          description: "",
        },
      },
    }));
    }
    
  };

  const showTab = (tab) => {
    if (tab === 'mobile') {
      setSelectedTab('mobile')
      handleViewPort("mobile")
    } else {
      setSelectedTab('desktop')
      handleViewPort("desktop")
    }
  }

  return (
    <div className="SlderMainSection">

      <CMSHead
        heading={"Financing Banner"}
        showIcons={true}
        handleShowTab={showTab}
        tabValue={selectedTab}
        isButtonVissible={false}
        handleShowInfoModal={handeShowInfoModal}
      />

      {viewPort === "desktop" ? (
        <div className="SliderBody">
          {activeFinancePayload?.main_banner?.desktop?.image_url !== '' ? (
            <div className="slider-container">
              <div
                className="sale-slider"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: "transform 0.5s ease",
                }}
              >
                <div className={`slide ${currentIndex === 0 ? "active" : ""}`}>
                  <div className="SliderBodySelectedImagesSlider">
                    <button
                      className="image-slider-image-delete"
                      onClick={() =>
                        handleImageDelete(activeFinancePayload?.main_banner?.desktop?.image_url)
                      }
                    >
                      <IoClose size={15} color="#595959" />
                    </button>
                    <img
                      src={`${Url + activeFinancePayload?.main_banner?.desktop?.image_url}`}
                      alt={activeFinancePayload?.main_banner?.desktop?.alt_text || "Selected Image"
                      }
                      className="image-slider-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <GalleryUpload 
              openModal={handleModalOpen}
            />
          )}
          <div
            className={`SliderAddNewImageBtnDiv ${!activeFinancePayload?.main_banner?.desktop?.image_url
              ? "show-add-more-btn"
              : ""
              }`}
          >
          </div>
        </div>
      ) : (
        <div className="SliderBody">
          {activeFinancePayload?.main_banner?.mobile?.image_url ? (
            <div className="slider-container">
              <div
                className="sale-slider"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: "transform 0.5s ease",
                }}
              >
                <div className={`slide ${currentIndex === 0 ? "active" : ""}`}>
                  <div className="SliderBodySelectedImagesSlider">
                    <button
                      className="image-slider-image-delete"
                      onClick={() =>
                        handleImageDelete(
                          activeFinancePayload.main_banner.mobile.image_url
                        )
                      }
                    >
                      <IoClose size={15} color="#595959" />
                    </button>
                    <img
                      src={`${Url + activeFinancePayload.main_banner.mobile.image_url}`}
                      alt={
                        activeFinancePayload.main_banner.mobile.alt_text ||
                        "Selected Image"
                      }
                      className="image-slider-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <GalleryUpload 
              openModal={handleModalOpen}
            />
          )}
          <div
            className={`SliderAddNewImageBtnDiv ${!activeFinancePayload?.main_banner?.mobile?.image_url
              ? "show-add-more-btn"
              : ""
              }`}
          >
          </div>
        </div>
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
        // editGalleryImageApi={`/api/v1/media/pages/financing/`}
        handleFileChange={handleFileChange}
      />
      <InfoPopUp
        showInfoModal={infoModal}
        handleCloseInfoModal={handleCloseInfoModal}
      />
    </div>
  )
};

export default ActiveFinancingBanner;

import React, { useState, useEffect } from "react";
import "./FPage.css";
import "../../Pages/Page/GeneralPage.css";
// Assets
import imageIcon from "../../Assets/Images/uploadImg 48 x 48.png";
import addBtn from "../../Assets/Images/add-btn-charcol.png";
import loaderTwo from "../../Assets/Images/loader-check-one.gif";
import crossButton from "../../Assets/Images/cross-button-32-X-32.png";
import { IoClose } from "react-icons/io5";

// Components
import ImageGalleryPopup from "../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup";
import InfoPopUp from "../InfoPopUp/InfoPopUp";
import MainLoader from "../UI-Controls/MainLoader/MainLoader";
import ActiveFinancingCMSHead from "./ActiveFinancingCMSHead/ActiveFinancingCMSHead";

// functions and liberaries
import axios from "axios";
import { Url } from "../../Services/Api";
import { uploadImage } from "../../Services/functions";
import { useActiveFinance } from "../../Context/ActiveFinanceContext/ActiveFinanceContext";
import CMSHead from "../UI-Controls/CMSHead/CMSHead";
import CMSBody from "../CMSBody/CMSBody";
import SmallSlider from "../HomePageSections/SmallSlider/SmallSlider";

const FinancingSliders = () => {
  const [infoModal, setInfoModal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [viewPort, setViewPort] = useState('desktop')
  const [uploadedStatus, setUploadedStates] = useState("");
  const [data, setData] = useState([]);
  // const [viewPort, setViewPort] = useState('desktop')
  const {
    activeFinancePayload,
    setActiveFinancePayload,

  } = useActiveFinance();



  const [imageSendPayload, setImageSendPayload] = useState({
    image_url: "",
    alt_text: "",
    title: "",
    description: "",
    link_url: "",
  });

  const handleGalleryModal = () => {
    setModalView(true);
  }

  const handleModalClose = () => {
    setModalView(false);
  };

  const handeShowInfoModal = () => {
    setInfoModal(true);
  };
  const handleCloseInfoModal = () => {
    setInfoModal(false);
  };

  // Get Finance Slider Media api
  const getApi = async () => {
    try {
      const response = await axios.get(
        `${Url}/api/v1/media/pages/home/finance/get`
      );
      setData(response.data.homeFinanceSliders);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getApi();
  }, []);

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

  const handleImageSelect = (image) => {

    setActiveFinancePayload((prevState) => ({
      ...prevState,

      slides: {
        ...prevState.slides,
        [viewPort]: [
          ...(prevState.slides[viewPort] || []), // Preserve existing images
          image, // Add the new image
        ],
      },
    }))

    setModalView(false);
  };





  const handleImageDelete = (id) => {
    if(selectedTab === 'mobile') {
      const filteredData = activeFinancePayload.slides.mobile.filter((item) => item._id !== id);
      setActiveFinancePayload((prevData) => ({
        ...prevData,
        slides: {
          ...prevData.slides,
          mobile: filteredData
        }
      }))
    } else {
      const filteredData = activeFinancePayload.slides.desktop.filter((item) => item._id !== id);
      setActiveFinancePayload((prevData) => ({
        ...prevData,
        slides: {
          ...prevData.slides,
          desktop: filteredData
        }
      }))
    }
  };





  const [selectedTab, setSelectedTab] = useState('desktop')
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
    <div className="FinanceSlider">


      <CMSHead
        heading={"Financing Slider"}
        showIcons={true}
        handleShowTab={showTab}
        tabValue={selectedTab}
        isButtonVissible={false}
        handleShowInfoModal={handeShowInfoModal}
      />


      {selectedTab === 'desktop' ? (
        <CMSBody
          bodyText={'Upload Image'}
          selectedImage={activeFinancePayload.slides.desktop}
          handleModalOpen={handleGalleryModal}
          handleImageDelete={handleImageDelete}
          setModalView={setModalView}
          // loading={loading}
        />
      ) : (
        <SmallSlider
          bodyText={'Upload Image'}
          selectedImage={activeFinancePayload.slides.mobile}
          handleModalOpen={handleGalleryModal}
          handleImageDelete={handleImageDelete}
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
};

export default FinancingSliders;

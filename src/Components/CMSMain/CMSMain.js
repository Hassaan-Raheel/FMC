import React, {useState} from 'react'
import CMSHead from '../UI-Controls/CMSHead/CMSHead';
import CMSBody from '../CMSBody/CMSBody';
import ImageGalleryPopup from '../UI-Controls/PopUp/ImageGalleryPapup/ImageGalleryPopup';
import InfoPopUp from '../InfoPopUp/InfoPopUp';

const CMSMain = ({modalView, setModalView, sendImagesHomeSlider, handeShowInfoModal, selectedImage, handleImageDelete, handleImageSelect, infoModal, handleCloseInfoModal}) => {
    // const [modalView, setModalView] = useState(false);
    const handleModalOpen = () => {setModalView(true)}
    const handleModalClose = () => {setModalView(false)}
  return (
    <div className='SlderMainSection'>
        <CMSHead
          heading={'Home Page Slider'}
          buttonText={'Save'}
          sendImagesHomeSlider={sendImagesHomeSlider}
          handeShowInfoModal={handeShowInfoModal}
        />
        <CMSBody 
          bodyText={'Upload Image'}
          selectedImage={selectedImage}
          handleModalOpen={handleModalOpen}
          handleImageDelete={handleImageDelete}
          setModalView={setModalView}
        />
        <ImageGalleryPopup 
        showImageGalleryPopUp={modalView}
        handleModalView={handleModalClose}
        onImageSelect={handleImageSelect}
        />
        <InfoPopUp 
          showInfoModal={infoModal}
          handleCloseInfoModal={handleCloseInfoModal} 
        />
      </div>
  )
}

export default CMSMain

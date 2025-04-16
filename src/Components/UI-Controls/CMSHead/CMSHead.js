import React from 'react'
import './CMSHead.css'
import explanationMark from '../../../Assets/Images/Frame.png';
import eyeIcon from '../../../Assets/Images/hide-show.png'
import { BsLaptop } from "react-icons/bs";
import { LuSmartphone } from "react-icons/lu";
import { IoEyeOutline } from "react-icons/io5";
import { BsInfoCircleFill } from "react-icons/bs";


const CMSHead = (
  { 
    handleShowInfoModal, 
    sendImagesHomeSlider, 
    heading, 
    buttonText,
    handleShowTab,
    tabValue,
    showIcons,
    isButtonVissible,
  }) => {

  return (

    <div className='SliderHead'>
      <div className='SliderHeadLeft'>
        <h3>{heading}</h3>
        {/* <img src={explanationMark} alt='img' onClick={handleShowInfoModal} /> */}
        <BsInfoCircleFill size={15} color='#595959' onClick={handleShowInfoModal} style={{cursor: 'pointer'}} />
      </div>
      {showIcons && (
        <div className='SliderHeadCenter'>
        <button className={`desktop-and-mobile-view-button ${tabValue === 'mobile' ? 'show-border-bottom' : ''}`} onClick={() => handleShowTab('mobile')} >
          <LuSmartphone size={20} color={tabValue === 'mobile' ? '#4487C5' : '#595959'} />
        </button>
        <button className={`desktop-and-mobile-view-button ${tabValue === 'desktop' ? 'show-border-bottom' : ''}`} onClick={() => handleShowTab('desktop')}>
          <BsLaptop size={20} color={tabValue === 'desktop' ? '#4487C5' : '#595959'} />
        </button>
      </div>
      )}
      
      <div className='SliderHeadRight'>
        <IoEyeOutline size={20} color='#595959' onClick={handleShowInfoModal} />
        {isButtonVissible && (
          <button className='SliderAddAndSaveBtn' onClick={sendImagesHomeSlider}>
          {buttonText}
        </button>
        )}
          
        
      </div>
    </div>
  )
}

export default CMSHead

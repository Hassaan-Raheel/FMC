import React from 'react'
import './ActiveFinancingCMSHead.css'
import explanationMark from '../../../Assets/Images/Frame.png';
import eyeIcon from '../../../Assets/Images/hide-show.png'
import { IoEyeOutline } from "react-icons/io5";


const ActiveFinancingCMSHead = ({
  handeShowInfoModal,
  showMobileBtn,
  handleViewPort,
  handleMobileView,
  handleDesktopView,
  sendDesktopSliderImages,
  mobileBtnText,
  sendMobileSliderImage,
  heading,
  buttonText
}) => {
  
  return (
    <div className='SliderHead'>
      <div className='SliderHeadLeft'>
        <h3>{heading}</h3>
        <img src={explanationMark} alt='img' onClick={handeShowInfoModal} />
        
      </div>
      <div className='SliderHeadRight'>
        <IoEyeOutline size={20} color='#595959' />
        {showMobileBtn &&
          <button className='SliderAddAndSaveBtn' onClick={handleMobileView}>
            {mobileBtnText}
          </button>}

        <button className='SliderAddAndSaveBtn' onClick={handleDesktopView}>
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default ActiveFinancingCMSHead

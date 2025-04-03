import React, { useState } from 'react'
import './ActiveSaleCMSHead.css'
import explanationMark from '../../../Assets/Images/Frame.png';
import eyeIcon from '../../../Assets/Images/hide-show.png'
import { BsLaptop } from "react-icons/bs";
import { LuSmartphone } from "react-icons/lu";

const ActiveSaleCMSHead = ({
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

  const [activeButton, setActiveButton] = useState('desktop_view')
  const handleActiveButton = (activeTag) => {
    setActiveButton(activeTag)
  }
  
  return (
    <div className='SliderHead'>

      <div className='SliderHeadLeft'>
        <h3>{heading}</h3>
        <img src={explanationMark} alt='img' onClick={handeShowInfoModal} />
      </div>

      <div className='SliderHeadRight'>
        {/* {showMobileBtn && */}
          <button className={`head-responsive-button ${activeButton === 'mobile_view' ? 'select-head-active' : ''}`} onClick={() => {handleMobileView(); handleActiveButton('mobile_view')}}>
            <LuSmartphone size={28} color='#595959' />
          </button>
        {/* } */}

        <button className={`head-responsive-button ${activeButton === 'desktop_view' ? 'select-head-active' : ''}`} onClick={() => {handleMobileView(); handleActiveButton('desktop_view')}}>
          <BsLaptop size={28} color='#595959' />
        </button>
      </div>

      <div>
        <img src={eyeIcon} alt='hide-show' />
      </div>
    </div>
  )
}

export default ActiveSaleCMSHead

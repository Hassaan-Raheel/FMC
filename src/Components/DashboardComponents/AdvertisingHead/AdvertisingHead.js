import React from 'react'
import './AdvertisingHead.css';
import arrowRight from '../../../Assets/Images/Active-Navigator-Right 15 x 15.png'

const AdvertisingHead = () => {
  return (
    // <div className='advertising-head-main-container'>
      <div className='advertising-head-inner-container'>
        <p className='advertising-head-tag'>ONLINE COURSE</p>
        <h3 className='advertising-head-main-heading'>Sharpen Your Skills with <br /> Professional Online Courses</h3>
        <button className='advertising-head-join-now-button'>
            Join now 
            <span className='advertising-head-join-now-button-arrow'>
                <img src={arrowRight} alt='arrow right' />
            </span>
        </button>
      </div>
    // </div>
  )
}

export default AdvertisingHead

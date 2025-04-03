import React from 'react'
import './DoubleBanner.css'

const DoubleBanner = () => {
  return (
    <div className='double-banner-main-shimmer-container'>
      <div className='desktop-banner-shimmer'></div>
      <div className='mobile-banner-container'>
        <div className='mobile-banner-shimmer'></div>
      </div>
    </div>
  )
}

export default DoubleBanner

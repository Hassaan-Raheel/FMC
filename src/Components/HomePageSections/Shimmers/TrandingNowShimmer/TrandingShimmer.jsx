import React from 'react'
import './TrandingShimmer.css'

const TrendingShimmer = () => {
  return (
    <div className='trending-now-shimmer-main'>
      <div className='trending-now-images-shimmer-main'>
        <div className='trending-now-main-banner-shimmer'></div>
        <div className='trending-now-sub-images-shimmer'>
            {Array.from({length: 6}).map((_, index) => (
                <div className='trending-now-sub-image-shimmer'></div>
            ))}
        </div>
      </div>
      <div className='trending-now-dots-shimmer'>
        {Array.from({length: 2}).map((_, index) => (
            <div className='trending-now-dot-shimmer'></div>
        ))}
        <div className='trending-now-add-btn-shimmer'></div>
      </div>
    </div>
  )
}

export default TrendingShimmer

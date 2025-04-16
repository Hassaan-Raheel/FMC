import React from 'react'
import './BannerShimmer.css'

const BannerShimmer = ({mainHeight, bannerHeight}) => {
    return (
        <div className='slider-main-container-cms-shimmer' style={{height: mainHeight}}>
            <div className='slider-cms-shimmer' style={{height: bannerHeight}}></div>
            <div className='slider-dots-and-button-container-shimmer'>
                {Array.from({ length: 2 }).map((_, index) => (
                    <div className='slider-dot-shimmer'></div>
                ))}
                <div className='slider-add-btn-shimmer'></div>
            </div>
        </div>
    )
}

export default BannerShimmer

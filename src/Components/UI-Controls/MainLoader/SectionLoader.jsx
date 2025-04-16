import React from 'react'
import './SectionLoader.css';
import loaderGif from '../../../Assets/Images/loader-check-three.gif'

const SectionLoader = () => {
    return (
        <div className='main-loader-container'>
            <img src={loaderGif} alt='loader-gif' />
            <h3>Please Wait...</h3>
        </div>
    )
}

export default SectionLoader

import React, { useState, useEffect } from 'react'
import './CMSBody.css'
import imageIcon from '../../Assets/Images/uploadImg 48 x 48.png'
import addBtn from '../../Assets/Images/add-btn-charcol.png'
import crossButton from '../../Assets/Images/cross-button-32-X-32.png'
import { Url } from '../../Services/Api'

const CMSBody = ({ bodyText, selectedImage, handleModalOpen, handleImageDelete, setModalView }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    return (
        <div className='SliderBody'>
            {selectedImage.length === 0 ? (
                <div className='upload-image-section'>
                    <p>{bodyText}</p>
                    <div className='image-icon-div' onClick={handleModalOpen}>
                        <img src={imageIcon} alt='img' />
                    </div>
                </div>
            ) : (
                <div className='slider-container'>
                    <div className='slider'
                        style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease' }}
                    >
                        {selectedImage.map((image, index) => (
                            <div
                                className={`slide ${index === currentIndex ? 'active' : ''}`}
                                key={index}
                            >
                                <div className='SliderBodySelectedImagesSlider'>
                                    <button className='image-slider-image-delete' onClick={() => handleImageDelete(image._id)}>
                                        <img src={crossButton} alt='delete-btn' />
                                    </button>
                                    <img src={`${Url}${image.image_url}`} alt={`Selected ${index + 1}`} className='image-slider-image' />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className={`SliderAddNewImageBtnDiv ${selectedImage.length === 0 ? 'show-add-more-btn' : ''}`}>
                <div className='pagination-dots-container'>
                    <div className='pagination'>
                        {selectedImage.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            ></button>
                        ))}
                    </div>
                </div>
                <button className='add-new-image-btn' onClick={() => setModalView(true)}>
                    <img src={addBtn} alt='add-image' />
                    Add
                </button>
            </div>
        </div>
    )
}

export default CMSBody
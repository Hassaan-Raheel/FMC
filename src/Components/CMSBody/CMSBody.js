import React, { useState, useEffect } from 'react'
import './CMSBody.css'
import { Url } from '../../Services/Api'
import { IoClose } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";

import SectionLoader from '../UI-Controls/MainLoader/SectionLoader'
import AddButton from '../UI-Controls/AddButton/AddButton'
import GalleryUpload from '../UI-Controls/GalleryUpload/GalleryUpload';

const CMSBody = ({ loading, bodyText, selectedImage, handleModalOpen, handleImageDelete, setModalView }) => {
    
    const [currentIndex, setCurrentIndex] = useState(0);
    return (
        <div className='SliderBody'>
            {loading && <SectionLoader />}
            {selectedImage?.length === 0 ? (  // Check if no images are selected
                <GalleryUpload 
                    openModal={handleModalOpen}
                />
            ) : (
                <div className='slider-container'>
                    <div className='financing-slider'
                        style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease' }}
                    >
                        {selectedImage?.map((image, index) => (
                            <div
                                className={`slide ${index === currentIndex ? 'active' : ''}`}
                                key={index}
                            >
                                <div className='SliderBodySelectedImagesSlider'>
                                    <button className='image-slider-image-delete' onClick={() => handleImageDelete(image._id)}>
                                        {/* <img src={crossButton} alt='delete-btn' /> */}
                                        <IoClose size={15} color='#595959' />
                                    </button>
                                    <img src={`${Url}${image.image_url}`} alt={`Selected ${index + 1}`} className='image-slider-image' />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className={`SliderAddNewImageBtnDiv ${selectedImage?.length === 0 ? 'show-add-more-btn' : ''}`}>
                <div className='pagination-dots-container'>
                    <div className='pagination'>
                        {selectedImage?.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            ></button>
                        ))}
                    </div>
                </div>

                <AddButton
                    handleClick={handleModalOpen}
                    iconShow={true}
                    icon={<LuPlus color='#4487C5' size={20} />}
                    text={'Add'}
                    rowDirection={'row'}
                />

            </div>
        </div>
    )
}

export default CMSBody

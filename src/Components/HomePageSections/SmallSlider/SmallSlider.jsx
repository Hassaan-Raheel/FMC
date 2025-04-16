import React, { useEffect, useRef, useState } from 'react'
import './SmallSlider.css'
import { Url } from '../../../Services/Api'
import { IoIosClose } from "react-icons/io";
import AddButton from '../../UI-Controls/AddButton/AddButton';
import { LuPlus } from "react-icons/lu";
import GalleryUpload from '../../UI-Controls/GalleryUpload/GalleryUpload';

const SmallSlider = ({ bodyText, selectedImage, handleModalOpen, handleImageDelete, setModalView }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);
    const [totalDots, setTotalDots] = useState(0);

    useEffect(() => {
        if (sliderRef.current) {
            const containerWidth = sliderRef.current.clientWidth;
            const totalWidth = sliderRef.current.scrollWidth;
            const imagesWidth = 250 + 15;
            const dotCount = Math.ceil((totalWidth - containerWidth) / containerWidth) + 1;
            setTotalDots(dotCount);

        }
    }, [selectedImage])

    const handleDotClick = (index) => {
        if (sliderRef.current) {
            const containerWidth = sliderRef.current.clientWidth;
            sliderRef.current.scrollTo({
                left: index * containerWidth,
                behaivior: 'smooth',
            })
            setCurrentIndex(index)
        }
    }

    return (
        <div className='small-slider-main-container'>
            <div className='small-slider-inner-container'>
                {selectedImage && selectedImage.length > 0 ? (
                    selectedImage.map((item, index) => (
                        <div className='slider-single-image-container'>
                            <button onClick={() => handleImageDelete(item._id)}>
                                <IoIosClose size={15} />
                            </button>
                            <img src={Url + item.image_url} alt='mobile banner' />
                        </div>
                    ))
                ) : (
                    <GalleryUpload 
                            openModal={handleModalOpen}
                    />
                )}

            </div>
            <div className='mobile-slider-add-and-dots'>
                <div className='mobile-slider-dots-container'>
                    {Array.from({ length: totalDots }).map((_, index) => (
                        <div
                            key={index}
                            className={`slider-dot ${currentIndex === index ? 'active' : ''}`}
                            onClick={() => handleDotClick(index)}
                        />
                    ))}
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

export default SmallSlider

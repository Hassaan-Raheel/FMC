import React from 'react'
import './GalleryUpload.css'
import { IoImageOutline } from "react-icons/io5";

const GalleryUpload = ({openModal, width = '176px', height = '120px', fontSize = '12px', ...props}) => {
    const handleClick = () => {
        if (openModal) {
            openModal(); // Executes the function(s) passed as prop
        }
    };

    return (
        <div
            className="Gallery-upload-main-container"
            onClick={handleClick}
            style={{width: width, height: height}}
            {...props}
        >
            <IoImageOutline size={45} color="#555" className="Gallery-uploaded-image" />
            <span className="upload-Gallery-text" style={{fontSize: fontSize}}>
                Click to Upload Image
            </span>
        </div>
    )
}

export default GalleryUpload
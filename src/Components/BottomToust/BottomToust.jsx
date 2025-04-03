import React from 'react'
import './BottomToust.css'
import { RxCross1 } from "react-icons/rx";


const BottomToust = ({showMessage, message, handleCloseMessageModal}) => {
    return (
        <div className={`snake-bar-main-container ${showMessage ? 'show-snake-container' : ''}`}>
            <div className='snake-bar-inner-container'>
                <p className='snake-bar-main-container-text'>{message}</p>
                <button className='snake-bar-close-button' onClick={handleCloseMessageModal}>
                    <RxCross1 color='#FFFFFF' size={20} />
                </button>
            </div>
        </div>
    )
}

export default BottomToust
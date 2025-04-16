import React from 'react'
import './InfoPopUp.css';
import crossBtn from '../../Assets/Images/cross-button-32-X-32.png';

const InfoPopUp = ({ showInfoModal, handleCloseInfoModal }) => {

    return (
        <div className={`info-modal-main-container ${showInfoModal ? 'show-info' : ''}`}>
            <div className={`info-modal-containt-container ${showInfoModal ? 'show-info-modal-body' : ''}`}>
                <button className='info-modal-close-btn' onClick={handleCloseInfoModal}>
                    <img src={crossBtn} alt='close-btn' />
                </button>
                <div className='info-modal-head'>
                    <h3>Image Requirements</h3>
                </div>
                <div className='info-modal-body'>
                    <table className='info-po-up-table'>
                        <tr>
                            <td>Image Resolutions:</td>
                            <td>1440 X 440 px</td>
                        </tr>
                        <tr>
                            <td>Image aspect ration:</td>
                            <td>3.77:1</td>
                        </tr>
                        <tr>
                            <td>Image Size</td>
                            <td>1440 X 379.5 px</td>
                        </tr>
                        <tr>
                            <td>Description:</td>
                            <td>This is the image for the main slider present at the
                                landing page of the website. This is the image for the
                                main slider present at the landing page of te website</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default InfoPopUp
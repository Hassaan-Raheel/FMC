import React from 'react'
import './AddButton.css';

const AddButton = ({ handleClick, iconShow, icon, text, rowDirection , gap}) => {
  return (
    <button className='add-button-style' style={{flexDirection: rowDirection, gap: gap}} onClick={handleClick}>
        {iconShow && icon} {text}
    </button>
  )
}

export default AddButton

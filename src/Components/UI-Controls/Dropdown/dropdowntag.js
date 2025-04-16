import React, { useState } from 'react';
import openIcon from '../../../Assets/Images/dropup 20 x 20.png';
import closeIcon from '../../../Assets/Images/dropdown 20 x 20.png';

const DropdownWithFields = () => {
  
  const [inputValues, setInputValues] = useState({
    textInputValue: '',
    colorInputValue1: '#ffffff',
    colorInputValue2: '#ffffff',
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid #F0F0F0',
          borderRadius: '5px',
          padding: '10px',
          width: '298px',
          height: '18px',
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--font-size-avg)',
          fontWeight: 'var(--font-weight-regular)',
          color: 'var(--text-color)',
          lineHeight: '19.5px',
        }}
      >
        {isOpen ? 'Text' : 'Text'}
        <span
          className="dropdown-arrow"
          style={{ transform: isOpen ? 'rotate(360deg)' : 'rotate(0deg)' }}
        >
          <img src={isOpen ? openIcon : closeIcon} alt="toggle" />
        </span>
      </div>

      <div
        style={{
          maxHeight: isOpen ? '500px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
          border: isOpen ? '1px solid #F0F0F0' : 'none',
          borderRadius: '5px',
          marginTop: '5px',
          padding: isOpen ? '10px' : '0px',
          backgroundColor: '#fff',
          width: '298px',
          height: isOpen ? '222px' : '0px',
        }}
      >

        <label
          style={{
            lineHeight: '18px',
            color: 'var(--text-color)',
            fontFamily: 'var(--font-family)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-small)',
            marginBottom: '5px',
            display: 'block',
          }}
        >
          Background Color<span className="superscript">*</span>
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #F0F0F0',
            borderRadius: '4px',
            height: '40px',
            width: '300px',
          }}
        >
          <span
            style={{
              lineHeight: '19.5px',
              color: 'var(--text-color)',
              fontFamily: 'var(--font-family)',
              fontWeight: 'var(--font-weight-regular)',
              fontSize: 'var(--font-size-avg)',
              marginRight: '5px',
              marginLeft: '10px',
            }}
          >
            {inputValues.colorInputValue1}
          </span>{' '}

          <div style={{ flexGrow: 1 }} />
          <input
            type="color"
            name="colorInputValue1"
            value={inputValues.colorInputValue1}
            onChange={handleInputChange}
            style={{
              width: '34px',
              height: '34px',
              border: 'none',
              borderRadius: '3px',
              margin: '5px',
              padding: 0,
            }}
          />
        </div>

        <label
          style={{
            lineHeight: '18px',
            color: 'var(--text-color)',
            fontFamily: 'var(--font-family)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-small)',
            marginBottom: '5px',
            display: 'block',
            marginTop: '5px',
          }}
        >
          Text Color<span className="superscript">*</span>
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #F0F0F0',
            borderRadius: '4px',
            height: '40px',
            width: '300px',
          }}
        >
          <span
            style={{
              lineHeight: '19.5px',
              color: 'var(--text-color)',
              fontFamily: 'var(--font-family)',
              fontWeight: 'var(--font-weight-regular)',
              fontSize: 'var(--font-size-avg)',
              marginRight: '5px',
              marginLeft: '10px',
            }}
          >
            {inputValues.colorInputValue2}
          </span>{' '}

          <div style={{ flexGrow: 1 }} />
          <input
            type="color"
            name="colorInputValue2"
            value={inputValues.colorInputValue2}
            onChange={handleInputChange}
            style={{
              width: '34px',
              height: '34px',
              border: 'none',
              outline: 'none',
              borderRadius: '3px',
              margin: '5px',
              padding: 0,
            }}
          />
        </div>

        <label
          style={{
            lineHeight: '18px',
            color: 'var(--text-color)',
            fontFamily: 'var(--font-family)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-small)',
            marginBottom: '5px',
            display: 'block',
            marginTop: '5px',
          }}
        >
          Text<span className="superscript">*</span>
        </label>
        <input
          type="text"
          name="textInputValue"
          placeholder="Enter text"
          value={inputValues.textInputValue}
          onChange={handleInputChange}
          style={{
            width: '278px',
            height: '18px',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #F0F0F0',
          }}
        />
      </div>
    </div>
  );
};

export default DropdownWithFields;
import React from "react";
import "./InputIconField.css";
import { TbSend } from "react-icons/tb";

const InputIconField = ({
    placeholder,
    value,
    name,
    onChange,
    readOnly,
    onSubmit = () => {},
}) => {
    return (
        <div className="price-range-filter">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                name={name}
                onChange={onChange}
                readOnly={readOnly}
                className="input-icon-field"
            />
            <button 
                type="button" 
                className="input-icon-button"
                onClick={onSubmit}
                aria-label="Send"
            >
                <TbSend className="InputImageStyle" />
            </button>
        </div>
    );
};

export default InputIconField;
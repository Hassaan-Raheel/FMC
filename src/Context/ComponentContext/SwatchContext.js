import React, { createContext, useContext, useState } from 'react';

const SwatchContext = createContext();

export const SwatchProvider = ({ children }) => {
    const [accordionsData, setAccordionsData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [activeIndexOpt, setActiveIndexOpt] = useState(-1);
    const [imgsrc, setImgSrc] = useState('ggf');

    return (
        <SwatchContext.Provider 
        value={{ 
            accordionsData, 
            setAccordionsData, 
            activeIndex, 
            setActiveIndex, 
            imgsrc, 
            setImgSrc,
            activeIndexOpt, 
            setActiveIndexOpt
            }}>
            {children}
        </SwatchContext.Provider>
    );
};

export const useSwatchContext = () => useContext(SwatchContext);

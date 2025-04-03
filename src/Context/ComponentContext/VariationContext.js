import React, { createContext, useContext, useState, useEffect } from 'react';

const VariationContext = createContext();

export const VariationProvider = ({ children }) => {
    const [variationData, setVariationData] = useState([
    
    ]);

    useEffect(() => {
    }, [variationData]);

    function setImageAtIndex(index, newImage, imageType) {
      
        setVariationData((prevVariationData) => {
      
          const newVariationData = [...prevVariationData];
      
          if (newVariationData[index]) {
      
            if (imageType === "Single Image") {
              newVariationData[index] = {
                ...newVariationData[index],
                image: newImage,
              };
            }
      
            if (imageType === "Additional Image") {
              const currentImages = newVariationData[index].images || [];
              const updatedImages = Array.isArray(currentImages)
                ? [...currentImages, newImage]
                : [newImage];
      
              newVariationData[index] = {
                ...newVariationData[index],
                images: updatedImages,
              };
            }

          } else {
            console.error(`Index ${index} does not exist in newVariationData.`);
          }
      
          return newVariationData;
        });
      }
    
    return (
        <VariationContext.Provider 
        value={{ 
            variationData,
            setVariationData,
            setImageAtIndex
            }}>
            {children}
        </VariationContext.Provider>
    );
};

export const useVariationContext = () => useContext(VariationContext);
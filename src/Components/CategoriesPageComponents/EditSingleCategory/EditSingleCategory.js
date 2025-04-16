import React, { useEffect, useState } from 'react'
import '../../../Pages/Page.css';
import HeaderCategories from '../HeaderCategories/HeaderCategories'
import ShopByCategory from '../../HomePageSections/ShopByCategory/ShopByCategory'
import BestSellerSection from '../../HomePageSections/BestSellerSection/BestSellerSection'
import CategoryDescription from '../CategoryDescription/CategoryDescription'
import SubCategories from '../../HomePageSections/ShopByCategory/SubCategories';
import BestSellerHomeSection from '../../HomePageSections/BestSellerSection/BestSellerHomeSection';
import BottomToust from '../../BottomToust/BottomToust';
import { useLocation } from 'react-router-dom';

const EditSingleCategory = () => {

  const location = useLocation()
    const subCategoryData = location.state

  const [statusMessage, setStatusMessage] = useState('');
      const [statusState, setStatusState] = useState(false)
      
      const handleOpenStatusBar = (message) => {
        setStatusMessage(message)
        setStatusState(true);
      }
      useEffect(() => {
        const timeOut = setTimeout(() => {
          setStatusState(false);
        }, 1500);

        return () => {clearTimeout(timeOut)}
      }, [statusState])
    
      const handleCloseStatusBar = () => {
        setStatusState(false);
      }

  return (
    <div className="HomePage" style={{ gap: '20px' }}>

      <SubCategories
        handleOpen={handleOpenStatusBar}
      />

      <BestSellerSection 
        handleOpen={handleOpenStatusBar}
      />
      <CategoryDescription />

      <BottomToust 
          showMessage={statusState}
          message={statusMessage}
          handleCloseMessageModal={handleCloseStatusBar}
        />
    </div>
  )
}

export default EditSingleCategory

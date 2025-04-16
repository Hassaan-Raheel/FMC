import React, { useEffect, useState } from 'react';
import TrandingNow from '../../Components/HomePageSections/TrandingNow/TrandingNow';
import FinancingBanner from '../../Components/HomePageSections/FinancingBanner/FinancingBanner';
import AdvertisingBanner from '../../Components/HomePageSections/AdvertisingBanner/AdvertisingBanner';
import DealOfMonth from '../../Components/HomePageSections/DealOfMonth/DealOfMonth';
import FurnitureForBudget from '../../Components/HomePageSections/FurnitureForBudget/FurnitureForBudget';
import FinanceSlider from '../../Components/HomePageSections/FinanceSlider/FinanceSlider';
import HomePageSlider from '../../Components/HomePageSections/HomePageSlider/HomePageSlider';
import ShopByCategory from '../../Components/HomePageSections/ShopByCategory/ShopByCategory'
import BestSellerHomeSection from '../../Components/HomePageSections/BestSellerSection/BestSellerHomeSection';
import BottomToust from '../../Components/BottomToust/BottomToust';

const HomePage = () => {

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

    return () => { clearTimeout(timeOut) }
  }, [statusState])

  const handleCloseStatusBar = () => {
    setStatusState(false);
  }

  return (
    <div className="HomePage" style={{ gap: '10px' }}>
            <HomePageSlider
              handleOpen={handleOpenStatusBar}
            />
            <ShopByCategory
              handleOpen={handleOpenStatusBar}
            />
            <FinanceSlider
              handleOpen={handleOpenStatusBar}
            />
            <TrandingNow
              handleOpen={handleOpenStatusBar}
            />
            <BestSellerHomeSection
              galleryApi={`/api/v1/media/pages/global/bestseller/get`}
              addMediaApi={`/api/v1/media/pages/global/bestseller/add`}
              categoryApi={`/api/v1/best-seller-home/get`}
              subCategoryApi={`/api/v1/productCategory/get?parent=0`}
              editBulkApi={`/api/v1/best-seller-home/edit-bulk`}
              bestSellerHeading={"Best Seller"}
              handleOpen={handleOpenStatusBar}
            />
            <FinancingBanner
              handleOpen={handleOpenStatusBar}
            />
            <AdvertisingBanner
              handleOpen={handleOpenStatusBar}
            />
            <DealOfMonth
              handleOpen={handleOpenStatusBar}
            />
            <FurnitureForBudget
              handleOpen={handleOpenStatusBar}
            />


      <BottomToust
        showMessage={statusState}
        message={statusMessage}
        handleCloseMessageModal={handleCloseStatusBar}
      />
    </div >
  );
};

export default HomePage;
import React, { useEffect, useState } from 'react'
// import useLoader from '../../Services/LoaderHook';
import ActiveSaleSlider from '../../Components/ActiveSaleComponents/ActiveSaleSlider/ActiveSaleSlider';
import ActiveSaleCategory from '../../Components/ActiveSaleComponents/ActiveSaleCategory/ActiveSaleCategory';
import ActiveSaleFinancing from '../../Components/ActiveSaleComponents/ActiveSaleFinancingSlider/ActiveSaleFinancing';
import ActiveSaleBanner from '../../Components/ActiveSaleComponents/ActiveSaleBanner/ActiveSaleBanner';
import { useActiveSale } from '../../Context/active-sale-context/ActiveSaleContext';
import SectionLoader from '../../Components/UI-Controls/MainLoader/SectionLoader';
import BottomToust from '../../Components/BottomToust/BottomToust';

const ActiveSale = () => {
    // const currentLocation = window.location.pathname;
    const { getDataOfActiveSale, updateActiveSale, loading, message, } = useActiveSale()
    const [openToust, setOpenToust] = useState(false)
    useEffect(() => { getDataOfActiveSale() }, [])
    
    
    const handleOpenToust = () => {
        setOpenToust(true);
    }

    const handleCloseToust = () => {
        setOpenToust(false);
    }



    return (
        <div className="HomePage" style={{ gap: '20px' }}>
            {loading && <SectionLoader />}
            <>
                <ActiveSaleSlider />
                <ActiveSaleCategory />
                <ActiveSaleFinancing />
                <ActiveSaleBanner />
                <div style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'end'
                }}>
                    <button
                        style={{
                            width: 'max-content',
                            heightL: "max-content",
                            padding: '10px 25px',
                            backgroundColor: '#4487c5',
                            color: '#fff',
                            border: 'none',
                            outline: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                        onClick={() => {updateActiveSale() ; handleOpenToust()} }
                    >
                        Save
                    </button>
                </div>
            </>

            <BottomToust 
                message={message}
                showMessage={openToust}
                handleCloseMessageModal={handleCloseToust}
            />
        </div >
    );
}

export default ActiveSale

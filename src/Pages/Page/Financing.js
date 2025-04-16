import React, { useEffect, useState } from "react";
import { useActiveFinance } from "../../Context/ActiveFinanceContext/ActiveFinanceContext";
import ActiveFinancingBanner from "../../Components/FinancingPageComponents/SingleFinancingBanner";
import FinancingSliders from "../../Components/FinancingPageComponents/FinancingSliders";
import SectionLoader from "../../Components/UI-Controls/MainLoader/SectionLoader";
import BottomToust from "../../Components/BottomToust/BottomToust";

const Financing = () => {
  const { getDataOfActiveFinance, updateActiveFinance, loading, message,  } = useActiveFinance();

  useEffect(() => {
    getDataOfActiveFinance();
  }, []);

  
  const [openToust, setOpenToust] = useState(false);
  const handleOpenToust = () => {
    setOpenToust(true);

    const timeout = setTimeout(() => {
      setOpenToust(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }

  const handleCloseToust = () => {
    setOpenToust(false);
  }

  return (
    <div className="HomePage" style={{ gap: "20px" }}>
        {loading && <SectionLoader />}
          <ActiveFinancingBanner />
          <FinancingSliders />
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <button
              style={{
                width: "max-content",
                heightL: "max-content",
                padding: "10px 25px",
                backgroundColor: "#4487c5",
                color: "#fff",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => {updateActiveFinance(); handleOpenToust()} }
            >
              Save
            </button>
          </div>

          <BottomToust 
            message={message}
            showMessage={openToust}
            handleCloseMessageModal={handleCloseToust}
          />
    </div>
  );
};

export default Financing;

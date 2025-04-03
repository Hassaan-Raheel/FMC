import React, { useState, useEffect } from "react";
import "./ECommerceComponents.css";
import axios from "axios";
// import MainLoader from "../../Components/UI-Controls/MainLoader/MainLoader";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import { Url } from "../../Services/Api";

const PayMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPaymentMethods() {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.get(`${Url}/api/v1/payment-methods/get-all`);
        const paymentMethods = response.data.paymentMethods || [];
        setPaymentMethods(paymentMethods);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  }
    
  useEffect(() => {
    fetchPaymentMethods();
  }, []);
  
  const handleToggle = async (method) => {
    const updatedStatus = method.activeStatus === 1 ? 0 : 1;
  
    setPaymentMethods((prevMethods) =>
      prevMethods.map((item) =>
        item.id === method.id ? { ...item, activeStatus: updatedStatus } : item
      )
    );
  
    try {
      const response = await fetch(`${Url}/api/v1/payment-methods/edit-method`, {
        method: 'Put',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: method.id,
          activeStatus: updatedStatus,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update payment method status');
      }
  
    } catch (error) {
      console.error('Error updating payment method:', error);
  
      setPaymentMethods((prevMethods) =>
        prevMethods.map((item) =>
          item.id === method.id ? { ...item, activeStatus: method.activeStatus } : item
        )
      );
    }
  };

  const getPayMethodImage = (imagePath) => {
    return imagePath ? `${Url+imagePath}` : "";
  };

  return (
    <div className="PaymentMethodsMainPage">
      {/* {loading && (
        <div className="backdrop">
          <MainLoader />
        </div>
      )} */}

      <div className="PaySection-01">
        <div className="Row-01">
          <div className="Leftside">
            <div className="MainPayContainer">
              <span className="PayMethods-Header">Payment Gateways</span>
            </div>

            <div className="BodyContainer-PayMethod">
              {loading ? (
                Array(3).fill().map((_, index) => (
                  <div key={index} className="PaymentMethodShimmerRow">
                    <div style={{marginLeft: "10px"}}><ShimmerLoader width="60px" height="50px" borderRadius="20%" /></div>
                    <div style={{marginLeft: "30px"}}> <ShimmerLoader width="230px" height="20px" borderRadius="5px" /></div>
                    <div style={{marginLeft: "70px"}}> <ShimmerLoader width="60px" height="30px" /></div>
                  </div>
                ))
              ) : (
                paymentMethods
                  .slice()
                  .sort((a, b) => a.menu_order - b.menu_order)
                  .map((method) => (
                    <div key={method.id} className="PaymentMethodRow">
                      <img
                        src={getPayMethodImage(method.logo)}
                        className="PaymentMethodImage"
                      />
                      <span className="PaymentMethodName">{method.name}</span>
                      <div
                        className={`CustomToggle ${
                          method.activeStatus === 1 ? "Enabled" : "Disabled"
                        }`}
                        onClick={() => handleToggle(method)}
                      >
                        <div className="ToggleCircle"></div>
                      </div>
                    </div>
                  ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PayMethods;

import React from "react";
import "./AnalyticsOverviewCard.css";
import ProgressBar from "../../UI-Controls/ProgressBar/ProgressBar";
import ShimmerLoader from "../../UI-Controls/Loader/ShimmerLoader";

const OrderProgress = ({ data, loading }) => {
  return (
    <div className="Order-Progress-Main-Container">
      <div className="Order-Progress-Body">
        {data.map((item, index) => (
          <div className="Order-Progress-Product-Content">
            <div className="Order-Progress-Product-Name-Value">
              <h3>{item.name}</h3>
              <div className="Order-Progress-Values">
                {/*<p>
                 {" "}
                  {loading ? (
                    <ShimmerLoader
                      width="36.5px"
                      height="22.5px"
                    />
                  ) : (<>{item.val}</>
                  )}</p> */}
                <span>
                  {" "}
                  {loading ? (
                    <ShimmerLoader
                      width="22.5px"
                      height="16.5px"
                    />
                  ) : (
                    <>{item.percentage}%</>
                  )}
                </span>
              </div>
            </div>
            <ProgressBar percentage={item.percentage} color={"#000"} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderProgress;

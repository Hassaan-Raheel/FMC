import React from "react";
import "./AnalyticsOverviewCard.css";

const AnalyticsProductCard = ({ title, duration, value, growth, icon }) => {
  return (
    <div className="AnalyticsProductCard">

      <div className="Products-CardText">
        <div className="Products-CardTitle">{title}</div>
        <div className="Products-CardDescription">{duration}</div>
        <div className="Products-CardValue">{value}</div>
        <div className="Products-CardVisualization">
          <div className="Visualization-LeftSide">
          <div
            className={`Products-CardGrowth ${
              growth > 0 ? "positive" : "negative"
            }`}
          >
            {growth >= 0
              ? `${(growth / 1000).toFixed(2)}K+`
              : `${Math.abs(growth / 1000).toFixed(2)}K-`}
              
          </div>
          <span className="growthText"> {growth >= 0 ? "Increase" : "Decrease"}</span>
          </div>
          <div className="Products-CardIconContainer">{icon}</div>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsProductCard;

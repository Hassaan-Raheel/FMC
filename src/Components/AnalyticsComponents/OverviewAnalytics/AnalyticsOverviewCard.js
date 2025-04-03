import React from "react";
import "./AnalyticsOverviewCard.css";

const AnalyticsOverviewCard = ({ title, duration, value, growth, icon }) => {
  return (
    <div className="AnalyticsCard">
      {/* First Row: Title + Duration + Icon */}
      <div className="CardRow">
        <div className="CardText">
          <div className="CardTitle">{title}</div>
          <div className="CardDuration">{duration}</div>
        </div>
        <div className="CardIconContainer">{icon}</div>
      </div>

      {/* Second Row: Value + Growth */}
      <div className="CardRow">
        <div className="CardValue">{value}</div>
        <div className={`CardGrowth ${growth > 0 ? "positive" : "negative"}`}>
          {growth > 0 ? `↑ ${growth}%` : `↓ ${Math.abs(growth)} %`}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverviewCard;

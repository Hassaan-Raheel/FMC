import React from "react";
import "./AnalyticsOverviewCard.css";

const LeftCard01 = ({ netSales, grossSales }) => {
  const growth = -30;
  const value = 570;
  return (
    <div className="ParentLayout-LeftCard01">
      {/* Row 1 */}
      <div className="LeftCard01-Row01">
        <div className="Row01-Title">Total Sales</div>
        <div className="Row-01-Growth">Your current Balance</div>
        <div className="Row01-Value">$ 25,057</div>
        
        <div
          className={`Row01-GrowthDetail ${
            growth > 0 ? "positive" : "negative"
          }`}
        >
          {growth > 0 ? <>{`↑ ${growth}%`}</> : <>{`↓ ${Math.abs(growth)}%`}</>}
          <span className="GrowthSpan"> growth (${value})</span>
        </div>
      </div>

      {/* Row 2 */}
      <div className="LeftCard01-Row02">
        <button className="add-credit-button">Add Credit</button>
      </div>

      {/* Row 3 */}
      <div className="LeftCard01-Row03">
        <div className="LeftCard01-Row03-01">
        <div className="Row03-Title">Net Sales</div>
        <div className="Row03-Value">{netSales}%</div>
        </div><div className="LeftCard01-Row03-02">
        <div className="Row03-Title">Gross Sales</div>
        <div className="Row03-Value">{grossSales}%</div></div>
      </div>
    </div>
  );
};

export default LeftCard01;

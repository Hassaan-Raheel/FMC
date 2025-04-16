import React from "react";
import "./ECommerceComponents.css";

const OrderViewCard = ({ title, value, icon }) => {
  return (
    <div className="OrderAnalyticsCard">

      <div className="Order-CardText">
        <div className="Order-CardTitle">{title}</div>
        <div className="Order-CardVisualization">
          <div className="OrderVisualization-LeftSide">
          <div className="Order-CardIconContainer">{icon}</div>
          </div>

          <div className="Order-CardValue">{value}</div>
        </div>
      </div>

    </div>
  );
};

export default OrderViewCard;
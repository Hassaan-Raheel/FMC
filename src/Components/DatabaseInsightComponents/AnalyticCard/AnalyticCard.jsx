import React from "react";
import "./AnalyticCard.css";
import Counter from "../Counter/Counter";

const AnalyticCard = ({ title, duration, value, growth, icon, width, unit }) => {
    // console.log("value head", value)
    return (
        <div className="AnalyticsCard" style={{width: width}}>
            {/* First Row: Title + Duration + Icon */}
            <div className="CardRow">
                <div className="CardText">
                    <div className="CardTitle">{title}</div>
                    <div className="CardDuration">{duration}</div>
                </div>
                {/* <div className="CardIconContainer">{icon}</div> */}
                <img src={icon} alt="icon" className="database-options-icon" />
            </div>

            {/* Second Row: Value + Growth */}

            {value !== "" && value !== null && value !== undefined && !isNaN(Number(value)) ? (
                <div className="CardRow">
                    <div className="CardValue">
                        {
                            Number.isInteger(Number(value)) ?
                                <p>
                                    {value}
                                    {/* {console.log(" value inside p ", value)} */}
                                </p>
                                : Number(value).toFixed(2)
                        }

                        <span>{unit}</span>
                    </div>
                    <div className={`CardGrowth ${growth !== "" ? "positive" : "negative"}`}>
                        {/* {growth > 0 ? `↑ ${growth}%` : `↓ ${Math.abs(growth)} %`} */}
                        {growth}
                    </div>
                </div>
            ) : (
                <div className="analytic-card-value-shimmer-container">
                    <div className="analytic-card-value-shimmer"></div>
                        <div className="analytic-card-status-shimmer"></div>
                </div>
            )}
            
        </div>
    );
};

export default AnalyticCard;

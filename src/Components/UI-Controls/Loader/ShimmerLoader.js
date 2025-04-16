import React from "react";
import "./ShimmerLoader.css";

const ShimmerLoader = ({ width = "100%", height = "20px", borderRadius = "4px" }) => {
  return (
    <div className="shimmer-wrapper" style={{ width, height, borderRadius }}>
      <div className="shimmer"></div>
    </div>
  );
};

export default ShimmerLoader;
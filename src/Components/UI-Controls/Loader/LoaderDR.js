import React from "react";
import './Loader.css';

const Loader = () => {
  return (
    <div className="loadingio-spinner-double-ring">
      <div className="ldio">
        <div></div>
        <div></div>
        <div><div></div></div>
        <div><div></div></div>
      </div>
    </div>
  );
};

export default Loader;

import React from "react";
import loader from '../assets/Loader.gif'
const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
      <img src={loader} alt="loading" />
    </div>
  );
};

export default Loader;
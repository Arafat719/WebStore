import React from "react";
import loader from '../assets/Loader.gif'
const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
      <img src={loader} alt="loading" style={{height: "100px", width: "100px"}} />
    </div>
  );
};

export default Loader;
import React from "react";

const Loader = ({ width = "50px", borderWidth = "5px" }) => {
  return (
    <div
      className="loader"
      style={{
        width: width,
        borderWidth: borderWidth + " solid #0000",
      }}
    ></div>
  );
};

export default Loader;

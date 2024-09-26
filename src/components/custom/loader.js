import React from "react";

const Loader = ({ width = "50px", borderWidth = "5px", className }) => {
  return (
    <div
      className={`loader ${className}`}
      style={{
        width: width,
        borderWidth: borderWidth + " solid #0000",
      }}
    ></div>
  );
};

export default Loader;

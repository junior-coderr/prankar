import React from "react";

const Loader2 = ({ color }) => {
  // //  console.log("color", color);
  return (
    <span
      className={`loader2 `}
      style={{
        "--color": color,
      }}
    ></span>
  );
};

export default Loader2;

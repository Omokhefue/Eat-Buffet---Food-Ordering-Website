import React from "react";
import "./CircleDesign.scss";
const CircleDesign = ({ size, top, left }) => {
  return (
    <div
      className={`circle circle-${size}`}
      style={{ top: `${top}%`, left: `${left}%` }}
    ></div>
  );
};

export default CircleDesign;

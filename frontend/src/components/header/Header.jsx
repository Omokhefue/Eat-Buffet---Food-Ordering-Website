import React from "react";
import "./header.scss";
import CircleDesign from "../CircleDesign/CircleDesign";
import headerImg from "/images/header/header.png" ;
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header-section" id="home">
      <div className="container">
        <div className="left">
          <h2>
            Have the Fastest
            <span> Food</span> Delivery
          </h2>
          <p>
            Choose From a diverse menu featuring a delectable array of dished
            crafted with the finest ingredients
          </p>
          <Link to="/menu">Get Started</Link>
        </div>

        <div className="right">
          <img src={headerImg} />
        </div>
        <CircleDesign size="small" top={10} left={20} />
        <CircleDesign size="medium" top={60} left={40} />
        <CircleDesign size="large" top={10} left={70} />
      </div>
    </div>
  );
};

export default Header;

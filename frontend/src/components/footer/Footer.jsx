import React from "react";
import "./footer.scss";
import CircleDesign from "../CircleDesign/CircleDesign";
import Logo from "../logo/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faInstagram,
  faSnapchat,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <Logo />
          <p>Good Food. Fast Delivery</p>

          <div className="social-icons">
            <div className="icon">
              <FontAwesomeIcon icon={faTwitter} className="i" />
            </div>
            <div className="icon">
              <FontAwesomeIcon icon={faInstagram} className="i" />
            </div>
            <div className="icon">
              <FontAwesomeIcon icon={faSnapchat} className="i" />
            </div>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>FAQ</li>
            <li>Privacy</li>
            <li>Shipping</li>
          </ul>
        </div>
        <div className="footer-content-center">
          <h2>POLICY</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+1-000-000-000</li>
            <li>contact@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="copyright">Copyright 2025 - All Rights Reserved</p>
      <CircleDesign size="small" top={10} left={20} />
      <CircleDesign size="medium" top={40} left={60} />
      <CircleDesign size="large" top={20} left={70} />
    </div>
  );
};

export default Footer;

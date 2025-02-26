
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "./scrollIndicator.scss";

const ScrollIndicator = () => {
  return (
    <div className="scroll-indicator">
      <FontAwesomeIcon icon={faChevronRight} className="scroll-icon" />
    </div>
  );
};

export default ScrollIndicator;

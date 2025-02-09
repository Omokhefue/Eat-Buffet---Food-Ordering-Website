import React from "react";
import "./ImageLayout.scss";

const ImageLayout = () => {
  return (
    <div className="image-grid">
      <div className="up">
        <img
          src="/images/mosaicLayout/review-img-1.webp"
          alt="Image 1"
          className="main-image"
        />
      </div>
      <div className="bottom-left">
        <img
          src="/images//mosaicLayout/review-img-2.webp"
          alt="Image 2"
          className="sub-image"
        />
      </div>
      <div className="bottom-right">
        <img
          src="/images//mosaicLayout/review-img-3.webp"
          alt="Image 3"
          className="sub-image"
        />
      </div>
    </div>
  );
};

export default ImageLayout;

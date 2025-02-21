import React from "react";
import "./foodItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faStarHalfAlt,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import useFoodListStore from "../../context/foodStore";
import useConfigStore from "../../context/configStore";
import { Link } from "react-router-dom";
import useAuthStore from "../../context/authStore";

const FoodItem = ({ item, display = true }) => {
  const { _id: id, name, price, image, averageRating } = item;
  const { cartItems, updateCartItem } = useFoodListStore();
  const { url } = useConfigStore();

  let qty = cartItems[id]?.quantity;

  const { setShowLogin, token } = useAuthStore();

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(
        <FontAwesomeIcon key={`star-${i}`} icon={solidStar} className="full" />
      );
    }

    if (rating % 1 !== 0) {
      stars.push(
        <FontAwesomeIcon icon={faStarHalfAlt} className="fa-star-half-alt" />
      );
    }

    while (stars.length < 5) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-star-${stars.length}`}
          icon={regularStar}
          className="empty"
        />
      );
    }
    return stars;
  };

  return (
    <div className="fooditem-card">
      <Link to={`/item/${id}`} className="card-link">
        <div className="card-image" data-food-name={name}>
          <img src={`${url}/${image}`} alt={name} />
        </div>

        <div className="card-content">
          <div className="card-footer">
            <span className="price">${price.toFixed(2)}</span>
            <span className="stars">{renderStars(averageRating)}</span>
          </div>
        </div>
      </Link>

      {display && (
        <div className="button-container">
          {!cartItems[id] ? (
            <button
              className="icon-button pre-button"
              onClick={(e) => {
                e.stopPropagation();
                if (!token) {
                  setShowLogin(true);
                } else {
                  updateCartItem("add", id, name, price, image, 1);
                }
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          ) : (
            <div className="food-item-counter">
              <button
                className="icon-button remove-button"
                onClick={(e) => {
                  e.stopPropagation(); 
                  updateCartItem("remove", id, name, price, image, 1);
                }}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <p className="counter-value">{qty}</p>
              <button
                className="icon-button add-button"
                onClick={(e) => {
                  e.stopPropagation(); 
                  updateCartItem("add", id, name, price, image, qty + 1);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FoodItem;

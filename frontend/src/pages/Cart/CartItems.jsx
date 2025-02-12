import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useConfigStore from "../../context/configStore";
import useFoodListStore from "../../context/foodStore";

const CartItems = ({ item, foodId }) => {
  const { url } = useConfigStore();
  const { _id: id, name, price, image, quantity: itemQuantity } = item;
  const { updateCartItem } = useFoodListStore();

  const [quantity, setQuantity] = useState(itemQuantity);
  const [showUpdate, setShowUpdate] = useState(false);

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(newQuantity);
  };
  console.log(id);
  const handleUpdate = () => {
    updateCartItem("add", foodId, name, price, image, quantity);

    setShowUpdate(false);
  };

  return (
    <div key={id} className="a">
      <div className="cart-items-item">
        <Link className="img" to={`/item/${foodId}`}>
          <img src={`${url}/${image}`} alt="" />
        </Link>
        <div className="details">
          <Link className="name" to={`/item/${id}`}>
            {name}
          </Link>
          <p className="price">Price: ${price}</p>
          <div className="update-section">
            <label className="update-text" htmlFor={`quantity-${id}`}>
              Quantity:
            </label>
            <input
              type="number"
              className="update-input"
              id={`quantity-${id}`}
              min="0"
              value={quantity}
              onChange={handleQuantityChange}
              onClick={() => setShowUpdate(true)}
            />

            {showUpdate && (
              <button className="update-button" onClick={handleUpdate}>
                update
              </button>
            )}
          </div>

          <p className="total">Total: ${(price * quantity).toFixed(2)}</p>
        </div>
        <p
          onClick={() => updateCartItem("remove-completely", foodId)}
          className="remove"
        >
          <FontAwesomeIcon icon={faTrash} />
        </p>
      </div>

      <hr />
    </div>
  );
};

export default CartItems;

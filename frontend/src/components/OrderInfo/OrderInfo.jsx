import React from "react";
import useFoodListStore from "../../context/foodStore";
import { useLocation, useNavigate } from "react-router-dom";

import "./orderInfo.scss";
import useAuthStore from "../../context/authStore";

const OrderInfo = ({ formRef }) => {
  const totalPrice = useFoodListStore((state) =>
    state.getTotalCartAmount(state)
  );
  const { setShowLogin, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="order-right">
      <div className="total">
        <h2>Cart Total</h2>
        <div>
          <div className="details">
            <p>SubTotal</p>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
          <div className="details">
            <p>Delivery Fee</p>
            <p>${totalPrice === 0 ? 0 : 2}</p>
          </div>
          <div className="details">
            <b>Total</b>
            <b>${totalPrice === 0 ? 0 : (totalPrice + 2).toFixed(2)}</b>
          </div>
        </div>
        {location.pathname === "/order" ? (
          <button
            type="submit"
            onClick={() =>
              formRef.current.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
              )
            }
          >
            PROCEED TO PAYMENT
          </button>
        ) : (
          <button
            onClick={() => {
              if (!token) setShowLogin(true);
              else navigate("/order");
            }}
          >
            PROCEED TO CHECKOUT
          </button>
        )}
      </div>

      {location.pathname !== "/order" && (
        <div className="coupon">
          <p className="title">Coupon Code</p>
          <p className="desc">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium
            cum, ipsa excepturi et ab quasi pariatur quis natus aliquam
            similique quaerat neque vitae eaque placeat est ex accusantium
            exercitationem minus!
          </p>

          <input type="text" name="" id="" placeholder="Coupon Code" />
          <button>Apply</button>
        </div>
      )}

      <div className="delivery">
        <div className="title">Shipping Fee</div>
        <p className="fee">$2</p>
        <hr />
      </div>
    </div>
  );
};

export default OrderInfo;

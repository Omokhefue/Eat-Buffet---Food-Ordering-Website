import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useConfigStore from "../../context/configStore";

import "./verify.scss";
import Spinner from "../../components/Spinner/Spinner";
import axios from "axios";
import useAuthStore from "../../context/authStore";
import useFoodListStore from "../../context/foodStore";

const Verify = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { url } = useConfigStore();
  const { resetCart } = useFoodListStore();

  const handleVerifyPayment = async () => {
    const response = await axios.post(
      url + "/api/order/verify",
      { success, orderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      resetCart();
      navigate("/myorders");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    handleVerifyPayment();
  }, []);
  return (
    <div className="verify">
      <Spinner />
    </div>
  );
};

export default Verify;

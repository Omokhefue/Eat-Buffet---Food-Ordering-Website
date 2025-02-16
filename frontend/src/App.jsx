import React, { useEffect } from "react";
import Nav from "./components/navbar/Nav";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Order from "./pages/Order/Order";
import Footer from "./components/footer/Footer";
import Login from "./components/login/Login";
import Verify from "./pages/Verify/Verify";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import DisplayOrders from "./pages/DisplayOrders/DisplayOrders";
import AllMenu from "./pages/AllMenu/AllMenu";
import SingleItem from "./pages/SingleItem/SingleItem";
import useAuthStore from "./context/authStore";
import Search from "./pages/search/Search";
import useFoodListStore from "./context/foodStore";
import useConfigStore from "./context/configStore";
import axios from "axios";

const App = () => {
  const { showLogin, setShowLogin, setUser, token, user } = useAuthStore();
  const { url } = useConfigStore();
  const { setCartData } = useFoodListStore();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.get(url + "/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          let user = response.data.user;
          console.log(user);
          setUser(user);
          setCartData(user.cartData);
        } catch (error) {
          setUser({});
          navigate("/home");
        }
      } else {
        setUser({});
      }
    };

    fetchUserData();
    console.log("from app", user);
  }, []);
  return (
    <>
      <ToastContainer />
      {showLogin ? <Login setShowLogin={setShowLogin} /> : <></>}
      <>
        <Nav setShowLogin={setShowLogin} />

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/item/:id"
              element={<SingleItem setShowLogin={setShowLogin} />}
            />
            <Route path="/menu" element={<AllMenu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/search" element={<Search />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/myorders" element={<DisplayOrders />} />
          </Routes>
        </main>

        <Footer />
      </>
    </>
  );
};

export default App;

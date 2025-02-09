import React, { useEffect, useState } from "react";
import "./nav.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faSearch,
  faSignInAlt,
  faBars, // Hamburger icon
  faTimes,
  faClipboardList,
  faSignOutAlt, // Close icon
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import useFoodListStore from "../../context/foodStore";
import useAuthStore from "../../context/authStore";
import Logo from "../logo/Logo";
import useConfigStore from "../../context/configStore";

const Nav = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalPrice = useFoodListStore((state) =>
    state.getTotalCartAmount(state)
  );
  const navigate = useNavigate();
  const { token, setToken, user, setUser } = useAuthStore();
  const { url } = useConfigStore();
  console.log(url,user);

  const scrollToSection = (sectionId, targetPage = "/home") => {
    if (location.pathname !== targetPage) {
      navigate(targetPage);
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        section.scrollIntoView({ behavior: "smooth" });
        setMenu(sectionId);
      }, 300);
    } else {
      const section = document.getElementById(sectionId);
      section.scrollIntoView({ behavior: "smooth" });
      setMenu(sectionId);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (location.pathname !== "/menu" && location.pathname !== "/home") {
      setMenu("");
    } else if (location.pathname == "/menu") {
      setMenu("menu");
    } else {
      setMenu("home");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("user");
    setToken("");
    setUser({});
    navigate("/home");
    window.location.reload();
  };

  return (
    <div className="navbar">
      <div className="container">
        <Logo />

        <ul className={`menu ${isMenuOpen ? "open" : ""}`}>
          <li
            onClick={() => scrollToSection("home")}
            className={menu === "home" ? "active" : ""}
          >
            home
          </li>
          <Link
            to="/menu"
            onClick={() => setMenu("menu")}
            className={menu === "menu" ? "active" : ""}
          >
            menu
          </Link>
          <li
            onClick={() => scrollToSection("app-downloads")}
            className={menu === "app-downloads" ? "active" : ""}
          >
            mobile-app
          </li>
          <li
            onClick={() => scrollToSection("footer")}
            className={menu === "footer" ? "active" : ""}
          >
            contact us
          </li>
        </ul>

        {/* Icons */}
        <div className="right">
          <FontAwesomeIcon
            icon={faSearch}
            onClick={() => navigate("/search")}
            className="search"
          />

          <div className="cart-icon">
            <Link to="/cart">
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
            <div className={totalPrice === 0 ? "" : "dot"}></div>
          </div>

          {!token ? (
            <button
              onClick={() => setShowLogin(true)}
              className="button-signin"
            >
              <FontAwesomeIcon icon={faSignInAlt} />
              sign in
            </button>
          ) : (
            <div className="profile">
              <div className="user-img">
                {user?.image ? (
                  <img src={`${url}/${user.image}`} alt="" />
                ) : (
                  <p>{user.name?.charAt(0) || ""}</p>
                )}
              </div>
              <ul className="dropdown">
                <li onClick={() => navigate("/myorders")}>
                  <FontAwesomeIcon icon={faClipboardList} />
                  Orders
                </li>
                <hr />
                <li onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Logout
                </li>
              </ul>
            </div>
          )}

          <button
            className="hamburger"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Nav;

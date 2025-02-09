import React, { useState } from "react";
import "./login.scss";
import useConfigStore from "../../context/configStore";
import { toast } from "react-toastify";

import axios from "axios";
import useAuthStore from "../../context/authStore";
import useFoodListStore from "../../context/foodStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [currState, setCurrState] = useState("Sign Up");
  let { url } = useConfigStore();
  const { setToken, setUser, setShowLogin } = useAuthStore();
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const { fetchAllData } = useFoodListStore();
  const handleLogin = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);

    if (image) {
      data.append("image", image);
    }

    const newUrl =
      currState === "Login"
        ? `${url}/api/auth/login`
        : `${url}/api/auth/register`;

    try {
      const response = await axios.post(newUrl, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success === false) {
        return toast.error(response.data.message);
      }

      setToken(response.data.token);
      setUser(response.data.data);
      localStorage.setItem("token", response.data.token);

      setShowLogin(false);
      fetchAllData();
      toast.success("Success!");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "An error occurred during login";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="login">
      <form className="login-container" onSubmit={handleLogin}>
        <div className="login-title">
          <h2>{currState}</h2>
          <FontAwesomeIcon icon={faTimes} onClick={() => setShowLogin(false)} className="cancel" />
        </div>

        <div className="login-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={handleChange}
              value={formData.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            required
          />

          {currState === "Sign Up" && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="imageInput"
              />
              {image && (
                <div className="image-preview">
                  <img src={previewImage} alt="Selected Preview" />
                </div>
              )}
            </>
          )}
        </div>

        <button type="submit">
          {currState === "Sign Up" ? "Create an account" : "Login"}
        </button>

        <div className="login-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        {currState !== "Sign Up" ? (
          <p>
            Create a new Account?
            <span
              onClick={() => {
                setCurrState("Sign Up");
              }}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an Account?
            <span
              onClick={() => {
                setCurrState("Login");
              }}
            >
              {" "}
              Login here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;

const User = require("../models/User");

const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.status(201).json({
      message: "Login successful",
      data: user,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    console.log(user)
    res.status(201).json({
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

exports.register = async (req, res) => {
  const { name, password, email } = req.body;
  console.log(req.file);
  const { name: imageName } = req.file;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password should be a minimum of 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: `uploads/user/${imageName}`,
    });

    const token = createToken(user._id);
    res.status(201).json({
      message: "User created",
      data: user,
      token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating Users", error: error.message });
  }
};

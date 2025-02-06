const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }
};

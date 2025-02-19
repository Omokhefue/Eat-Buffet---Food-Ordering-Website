const { Router } = require("express");
const router = Router();

const { login, register, getLoggedInUser } = require("../controllers/auth");
const uploadMiddleware = require("../middleware/imageUpload");
const { protect } = require("../middleware/auth");

router.get("/profile", protect, getLoggedInUser);
router.post("/login", login);
router.post("/register", uploadMiddleware("user"), register);

module.exports = router;

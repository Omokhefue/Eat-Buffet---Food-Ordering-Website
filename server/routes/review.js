
const express = require("express");
const router = express.Router();
const { addReview, deleteReview } = require("../controllers/review");

router.post("/add", addReview);

router.delete("/delete", deleteReview);

module.exports = router;

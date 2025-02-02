const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    userId: { type: String, required: true },
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);

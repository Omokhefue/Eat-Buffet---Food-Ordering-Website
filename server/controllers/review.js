const Review = require("../models/Review");
const Food = require("../models/Food");

exports.addReview = async (req, res) => {
  try {
    const {
      foodId,
      username,
      userId,
      comment,
      rating,
      currentAverageRatings,
      noOfCurrentRatings,
    } = req.body;

    const ratingNum = parseFloat(rating);
    const currentAverageRatingNum = parseFloat(currentAverageRatings);
    const noOfRatingsNum = parseInt(noOfCurrentRatings);

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const review = await Review.create({
      username,
      userId,
      food: foodId,
      comment,
      rating: ratingNum,
    });

    const newNoOfRatings = noOfRatingsNum + 1;
    const newAverageRating =
      (currentAverageRatingNum * noOfRatingsNum + ratingNum) / newNoOfRatings;

    food.averageRating = parseFloat(newAverageRating);

    await food.save();

    res.status(201).json({
      message: "Review added successfully",
      newReview: review,
      newAverageRating: newAverageRating,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId, foodId, currentAverageRating, currentReviewCount } =
      req.body;

    const currentAverageRatingNum = parseFloat(currentAverageRating);
    const currentReviewCountNum = parseInt(currentReviewCount);

    const review = await Review.findByIdAndDelete(reviewId);
    let newAverageRating = 0;

    if (currentReviewCountNum > 1) {
      const totalRating = currentAverageRatingNum * currentReviewCountNum;
      const updatedTotalRating = totalRating - review.rating;

      const updatedReviewCount = currentReviewCountNum - 1;

      newAverageRating = updatedTotalRating / updatedReviewCount;
    } else {
      newAverageRating = 0;
    }

    const food = await Food.findByIdAndUpdate(
      foodId,
      {
        averageRating: newAverageRating,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Review deleted successfully",
      newAverageRating: newAverageRating,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

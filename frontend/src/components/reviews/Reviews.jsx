import React, { useState } from "react";
import axios from "axios";
import useAuthStore from "../../context/authStore"; 
import useFoodStore from "../../context/singleFoodStore";
import useConfigStore from "../../context/configStore";
import "./review.scss";

const Reviews = ({ foodId }) => {
  const { reviews, setReviews, averageRating, setAverageRating } =
    useFoodStore();
  console.log(averageRating);
  const { user, token, setShowLogin } = useAuthStore();
  const [visibleCount, setVisibleCount] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 1,
    comment: "",
  });
  const handleReviewFormToggle = () => {
    if (!token) {
      setShowLogin(true);
    } else {
      setShowReviewForm(!showReviewForm);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const { url } = useConfigStore();
  const handleDeleteReview = async (reviewId) => {
    const currentReviewCount = reviews.length;
    console.log();
    try {
      const response = await axios.delete(`${url}/api/review/delete`, {
        data: {
          currentAverageRating: averageRating,
          currentReviewCount,
          foodId,
          reviewId,
        },
      });

      if (response.status === 200) {
        const updatedReviews = reviews.filter(
          (review) => review._id !== reviewId
        );
        setReviews(updatedReviews);
        setAverageRating(response.data.newAverageRating);
      }
    } catch (error) {
      console.error(
        "Error deleting review:",
        error.response?.data || error.message
      );
    }
  };

  const handleShowMore = (action) => {
    if (action === "more") {
      setVisibleCount((prev) => Math.min(prev + 7, reviews.length));
    } else {
      setVisibleCount(() => reviews.length);
    }
  };
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const { rating, comment } = reviewData;

    if (rating < 1) rating = 1;
    if (rating > 5) rating = 5;

    const formData = new FormData();
    formData.append("foodId", foodId);
    formData.append("username", user?.name);
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("userId", user?._id);
    formData.append("currentAverageRatings", averageRating);
    formData.append("noOfCurrentRatings", reviews.length);

    try {
      const response = await axios.post(`${url}/api/review/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (response.status === 201) {
        setReviews([response.data.newReview, ...reviews]);
        setAverageRating(response.data.newAverageRating);
        setReviewData({ rating: 1, comment: "" });
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error(
        "Error adding review:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div className="food-item-reviews">
      <h2>User Reviews</h2>
      {reviews?.length > 0 ? (
        <>
          {reviews.slice(0, visibleCount).map((review, index) => (
            <div key={index} className="review">
              <p>
                <strong>{review.username}</strong>: {review.comment}
              </p>
              <p>Rating: ⭐ {review.rating}/5</p>
              {user?._id === review.userId && (
                <button
                  className="delete-review"
                  onClick={() => handleDeleteReview(review._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          <div className="show">
            {visibleCount < reviews.length && (
              <button
                className="show-more "
                onClick={() => handleShowMore("more")}
              >
                Show More
              </button>
            )}
            {visibleCount !== reviews.length && (
              <button
                className="show-all "
                onClick={() => handleShowMore("all")}
              >
                Show All
              </button>
            )}
          </div>
        </>
      ) : (
        <p>No reviews yet</p>
      )}
      <p className="add-review " onClick={handleReviewFormToggle}>
        -- Add Review --
      </p>
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="review-form">
          <h2>Write a Review</h2>
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <input
              id="rating"
              type="number"
              name="rating"
              min="1"
              max="5"
              value={reviewData.rating}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              name="comment"
              rows="4"
              value={reviewData.comment}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Submit Review
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={handleReviewFormToggle}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Reviews;
